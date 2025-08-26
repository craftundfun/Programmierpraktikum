import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";
import {useWebSocket} from "@/components/websocket/WebSocketContext";
import React, {useEffect, useState, useRef} from "react";
import {View,} from "react-native";
import colors from "@/styles/Colors";
import {
    Gesture,
    GestureDetector,
} from "react-native-gesture-handler";
import {FontAwesome} from '@expo/vector-icons';
import {useRouter} from "expo-router";

type ControlPadProps = {
    speedMultiplier: number;
    gestureRef?: any;
    simultaneousRef?: any;
    active: boolean;
    useDebugMode?: boolean;
};

const drivingEnum = {
    FORWARD: 'FORWARD',
    BACKWARD: 'BACKWARD',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    STOP: 'STOP',
};

/**
 * Steuerkreuz um den Roboter zu fahren.
 */
function ControlPad({speedMultiplier, gestureRef, simultaneousRef, active, useDebugMode = false}: ControlPadProps) {
    const {isTablet} = useDeviceType();
    const {socket} = useWebSocket();
    const router = useRouter();

    const [drivingDirection, setDrivingDirection] = useState<string>(drivingEnum.STOP);
    const [lastDrivingDirection, setLastDrivingDirection] = useState<string | null>(null);
    const [lastSpeedMultiplier, setLastSpeedMultiplier] = useState<number>(speedMultiplier);
    const [buttonNumberPressed, setButtonNumberPressed] = useState<number>(-1);

    const intervalRef = useRef<number | null>(null);

    // set the button number according to the driving direction
    useEffect(() => {
        let forwardSpeed = 0;
        let rotationSpeed = 0;

        switch (drivingDirection) {
            case drivingEnum.FORWARD:
                forwardSpeed = -1;
                setButtonNumberPressed(1);
                break;
            case drivingEnum.BACKWARD:
                forwardSpeed = 1;
                setButtonNumberPressed(2);
                break;
            case drivingEnum.LEFT:
                rotationSpeed = -1;
                setButtonNumberPressed(3);
                break;
            case drivingEnum.RIGHT:
                rotationSpeed = 1;
                setButtonNumberPressed(4);
                break;
            case drivingEnum.STOP:
            default:
                forwardSpeed = 0;
                rotationSpeed = 0;
                setButtonNumberPressed(-1);
                break;
        }

        // send the driving command to the robot
        const sendMessage = () => {
            if (!active) {
                return;
            }

            const newMessage = JSON.stringify({
                op: 'publish',
                topic: '/manuell/cmd_vel',
                msg: {
                    linear: {
                        x: -forwardSpeed * speedMultiplier,
                        y: 0,
                        z: 0,
                    },
                    angular: {
                        x: 0,
                        y: 0,
                        z: -rotationSpeed * speedMultiplier * 8,
                    },
                },
            });

            try {
                socket?.send(newMessage);
            } catch (err) {
                console.error("WebSocket error:", err);

                if (useDebugMode) {
                    console.warn("Debug mode is enabled. Skipping error handling.");

                    return;
                }

                router.replace({
                    pathname: '/ErrorScreen',
                    params: {
                        errorMessage: "WebSocket connection lost while sending driving command.",
                    },
                });
            }
        };

        // directly resend message if driving direction or speed multiplier changed
        if (drivingDirection !== lastDrivingDirection) {
            sendMessage();

            setLastDrivingDirection(drivingDirection);
            setLastSpeedMultiplier(speedMultiplier);

            return;
        }

        if (speedMultiplier !== lastSpeedMultiplier) {
            sendMessage();
            setLastDrivingDirection(drivingDirection);
            setLastSpeedMultiplier(speedMultiplier);

            return;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // resend message every second to avoid the robot to stop because it thinks something is wrong
        intervalRef.current = setInterval(() => sendMessage(), 1000);

        // Cleanup on unmount or direction change
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [drivingDirection, socket, speedMultiplier, lastDrivingDirection, lastSpeedMultiplier, active, router, useDebugMode]);

    // gesture handling of the control pad
    const buildTapGesture = (direction: string) =>
        Gesture.LongPress()
            .minDuration(0)
            .onStart(() => setDrivingDirection(direction))
            .onEnd(() => setDrivingDirection(drivingEnum.STOP))
            .onFinalize(() => setDrivingDirection(drivingEnum.STOP))
            .withRef(gestureRef)
            .simultaneousWithExternalGesture(simultaneousRef)
            .runOnJS(true);

    // render the button with the icon for the direction
    const button = (buttonNumber: number) => {
        let iconName: string;

        switch (buttonNumber) {
            case 1:
                iconName = "arrow-up";
                break;
            case 2:
                iconName = "arrow-down";
                break;
            case 3:
                iconName = "arrow-left";
                break;
            case 4:
                iconName = "arrow-right";
                break;
            default:
                iconName = "question";
        }

        return (
            <View
                style={{
                    backgroundColor: active ? (buttonNumberPressed === buttonNumber ? colors.primaryDark : colors.primary) : colors.primary,
                    width: isTablet ? 75 : 50,
                    height: isTablet ? 75 : 50,
                    margin: isTablet ? 5 : 2.5,
                    alignItems: "center",
                    opacity: active ? 1 : 0.5,
                }}
            >
                <FontAwesome
                    // @ts-ignore
                    name={iconName}
                    size={isTablet ? 50 : 35}
                    color={colors.textPrimary}
                    style={{
                        marginTop: isTablet ? 10 : 5,
                        marginBottom: isTablet ? 5 : 2,
                    }}
                />

            </View>
        );
    }

    return (
        <View style={{flexDirection: "column", alignItems: "center"}}>
            {/* Top */}
            <GestureDetector gesture={buildTapGesture(drivingEnum.FORWARD)}>
                {button(1)}
            </GestureDetector>

            {/* Middle Row: Left - Spacer - Right */}
            <View style={{flexDirection: "row", justifyContent: "center"}}>
                <GestureDetector gesture={buildTapGesture(drivingEnum.LEFT)}>
                    {button(3)}
                </GestureDetector>

                {/* Spacer / No action */}
                <View
                    style={{
                        backgroundColor: "yellow",
                        opacity: 0,
                        width: isTablet ? 75 : 50,
                        height: isTablet ? 75 : 50,
                        margin: isTablet ? 5 : 2.5,
                    }}
                />

                <GestureDetector gesture={buildTapGesture(drivingEnum.RIGHT)}>
                    {button(4)}
                </GestureDetector>
            </View>

            {/* Bottom */}
            <GestureDetector gesture={buildTapGesture(drivingEnum.BACKWARD)}>
                {button(2)}
            </GestureDetector>
        </View>
    );
}

export default ControlPad;
