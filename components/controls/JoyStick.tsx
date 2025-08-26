import React, {useEffect, useRef, useState} from 'react';
import {Animated, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";
import colors from "@/styles/Colors";
import {useRouter} from "expo-router";
import {useWebSocket} from "@/components/websocket/WebSocketContext";

const radius = 60;

interface JoystickProps {
    active?: boolean;
    speedMultiplier: number;
    useDebugMode?: boolean;
    gestureRef?: any;
    simultaneousRef?: any;
}

function Joystick({active = true, speedMultiplier, useDebugMode = false, gestureRef, simultaneousRef}: JoystickProps) {
    const {isTablet} = useDeviceType();
    const {socket} = useWebSocket();
    const router = useRouter();

    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });

    const lastSentRef = useRef(0);
    const timeoutRef = useRef<number | null>(null);
    const latestDataRef = useRef({position, speedMultiplier});
    const lastMessageRef = useRef<string>("");

    // update the latest data reference whenever position or speedMultiplier changes
    useEffect(() => {
        latestDataRef.current = {position, speedMultiplier};
    }, [position, speedMultiplier]);

    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    // update the last sent message reference whenever the position changes
    const panGesture = Gesture.Pan()
        .onUpdate(event => {
            let dx = event.translationX;
            let dy = event.translationY;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > radius) {
                const angle = Math.atan2(dy, dx);

                dx = radius * Math.cos(angle);
                dy = radius * Math.sin(angle);
            }

            translateX.setValue(dx);
            translateY.setValue(dy);

            setPosition({
                x: dx / radius,
                y: dy / radius,
            });
        })
        .onEnd(() => {
            // jump back to the center when the gesture ends
            Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
            }).start();

            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
            }).start();

            setPosition({
                x: 0,
                y: 0,
            });
        })
        .shouldCancelWhenOutside(false)
        .withRef(gestureRef)
        .simultaneousWithExternalGesture(simultaneousRef)
        .runOnJS(true);

    // useEffect to send messages at a regular interval
    useEffect(() => {
        const sendMessage = () => {
            const {position, speedMultiplier} = latestDataRef.current;
            const now = Date.now();

            const newMessage: object = {
                op: 'publish',
                topic: '/manuell/cmd_vel',
                msg: {
                    linear: {
                        x: -position.y * speedMultiplier,
                        y: 0,
                        z: 0,
                    },
                    angular: {
                        x: 0,
                        y: 0,
                        z: -position.x * speedMultiplier * 8,
                    },
                },
            };

            const newMessageJSON = JSON.stringify(newMessage);

            // only resend every 100ms to avoid flooding the WebSocket
            // don't send on message change, because the joystick is very sensitive
            if ((now - lastSentRef.current) < 100) {
                return;
            }

            lastMessageRef.current = newMessageJSON;
            lastSentRef.current = now;

            try {
                socket?.send(newMessageJSON);
            } catch (error) {
                console.error('Error sending message:', error);

                if (useDebugMode) {
                    console.warn("Debug mode is enabled. Skipping error handling.");

                    return;
                }

                router.replace({
                    pathname: '/ErrorScreen',
                    params: {
                        errorMessage: "Could not send message to WebSocket.",
                    },
                });
            }
        };

        timeoutRef.current = setInterval(sendMessage, 100);

        return () => {
            if (timeoutRef.current) {
                clearInterval(timeoutRef.current);
            }
        };
    }, [router, socket, useDebugMode]);

    const joystickView = (
        <Animated.View
            style={{
                width: isTablet ? 80 : 55,
                height: isTablet ? 80 : 55,
                backgroundColor: colors.accent,
                borderRadius: 40,
                transform: [
                    {translateX: translateX},
                    {translateY: translateY},
                ],
                opacity: active ? 1 : 0.5,
            }}
        />
    );

    return (
        <View
            style={{
                width: isTablet ? 175 : 125,
                height: isTablet ? 175 : 125,
                borderRadius: 87.5,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: active ? 1 : 0.5,
            }}
        >
            {active ? (
                <GestureDetector gesture={panGesture}>
                    {joystickView}
                </GestureDetector>
            ) : (
                joystickView
            )}
        </View>
    );
};

export default Joystick;
