import {View} from "react-native";
import {useWebSocket} from "@/components/websocket/WebSocketContext";
import React, {useEffect, useState} from "react";
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";
import {useRouter} from "expo-router";

type ColorDetectorProps = {
    useDebugMode?: boolean;
}

/**
 * Anzeige der Farbsensordaten des Roboters. Bei neuen Daten werden diese aktualisiert.
 */
function ColorDetector({useDebugMode = false}: ColorDetectorProps): React.JSX.Element {
    const {socket, addMessageListener, removeMessageListener} = useWebSocket();
    const {isTablet} = useDeviceType();
    const router = useRouter();

    const [firstSensor, setFirstSensor] = useState<{ r: number; g: number; b: number; c: number; } | null>(null);
    const [secondSensor, setSecondSensor] = useState<{ r: number; g: number; b: number; c: number; } | null>(null);
    const [thirdSensor, setThirdSensor] = useState<{ r: number; g: number; b: number; c: number; } | null>(null);
    const [fourthSensor, setFourthSensor] = useState<{ r: number; g: number; b: number; c: number; } | null>(null);

    // subscribe to color sensors on mount
    useEffect(() => {
        try {
            socket?.send(
                JSON.stringify({
                    op: 'subscribe',
                    topic: '/scan/floor',
                }),
            );
        } catch (error) {
            console.error('Error subscribing to color sensors:', error);

            if (useDebugMode) {
                console.warn("Debug mode is enabled. Skipping error handling.");

                return;
            }

            router.replace({
                pathname: '/ErrorScreen',
                params: {
                    errorMessage: "Error while subscribing to color sensors.",
                },
            });
        }

        // listener to handle incoming messages from the WebSocket
        const listener = (event: WebSocketMessageEvent) => {
            const data: any = JSON.parse(event.data);

            if (data.op === 'publish' && data.topic === '/scan/floor') {
                const colorData = data.msg.data;

                let sensors = [];

                for (let i = 0; i < colorData.length; i += 4) {
                    sensors.push({
                        r: colorData[i],
                        g: colorData[i + 1],
                        b: colorData[i + 2],
                        c: colorData[i + 3],
                    });
                }

                setFirstSensor(sensors[0]);
                setSecondSensor(sensors[1]);
                setThirdSensor(sensors[2]);
                setFourthSensor(sensors[3]);
            }
        };

        addMessageListener(listener);

        return () => {
            removeMessageListener(listener);
        };
    }, [addMessageListener, removeMessageListener, router, socket, useDebugMode]);

    // calculate RGB values from sensor data
    function getRgbFromSensor(sensor: { r: number, g: number, b: number, c: number }) {
        const c = sensor.c === 0 ? 1 : sensor.c;
        const r = Math.round((sensor.r / c) * 255);
        const g = Math.round((sensor.g / c) * 255);
        const b = Math.round((sensor.b / c) * 255);

        return `rgb(${r},${g},${b})`;
    }

    return (
        <View
            style={{
                width: isTablet ? 80 : 50,
                height: isTablet ? 40 : 25,
                backgroundColor: "white",
                borderTopLeftRadius: isTablet ? 80 : 55,
                borderTopRightRadius: isTablet ? 80 : 55,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "flex-end",
            }}
        >
            <View
                collapsable={false}
                style={{
                    backgroundColor: firstSensor
                        ? getRgbFromSensor(firstSensor)
                        : "grey",
                    borderRadius: 40,
                    width: isTablet ? 20 : 10,
                    height: isTablet ? 20 : 10,
                    marginBottom: isTablet ? 10 : 7.5,
                    marginLeft: isTablet ? -2 : 0,
                }}
            />
            <View
                collapsable={false}
                style={{
                    backgroundColor: secondSensor
                        ? getRgbFromSensor(secondSensor)
                        : "grey",
                    borderRadius: 40,
                    width: isTablet ? 20 : 10,
                    height: isTablet ? 20 : 10,
                    marginBottom: isTablet ? 20 : 15,
                }}
            />
            <View
                collapsable={false}
                style={{
                    backgroundColor: thirdSensor
                        ? getRgbFromSensor(thirdSensor)
                        : "grey",
                    borderRadius: 40,
                    width: isTablet ? 20 : 10,
                    height: isTablet ? 20 : 10,
                    marginBottom: isTablet ? 20 : 15,
                    marginLeft: isTablet ? 2 : 0,
                }}
            />
            <View
                collapsable={false}
                style={{
                    backgroundColor: fourthSensor
                        ? getRgbFromSensor(fourthSensor)
                        : "grey",
                    borderRadius: 40,
                    width: isTablet ? 20 : 10,
                    height: isTablet ? 20 : 10,
                    marginBottom: isTablet ? 10 : 7.5,
                }}
            />
        </View>
    );
}

export default ColorDetector;