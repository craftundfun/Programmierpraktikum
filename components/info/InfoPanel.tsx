import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Easing, Text, TouchableOpacity, View,} from 'react-native';
import colors from '@/styles/Colors';
import InfoText from './InfoText';
import {useWebSocket} from "@/components/websocket/WebSocketContext";
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";
import {useRouter} from "expo-router";

type InfoPanelProps = {
    useDebugMode?: boolean;
}

/**
 * Panel um Statusinformationen des Roboters anzuzeigen.
 */
function InfoPanel({useDebugMode = false}: InfoPanelProps): React.JSX.Element {
    const {isTablet} = useDeviceType();
    const router = useRouter();
    const {socket, addMessageListener} = useWebSocket();

    const width = isTablet ? 225 : 180;
    const hiddenWidth = isTablet ? 20 : 15;

    const [cpuUsage, setCpuUsage] = useState<string | null>(null);
    const [cpuAlarm, setCpuAlarm] = useState<boolean>(false);
    const [ramAlarm, setRamAlarm] = useState<boolean>(false);
    const [ramUsage, setRamUsage] = useState<string | null>(null);
    const [cpuTemperature, setCpuTemperature] = useState<string | null>(null);
    const [temperatureAlarm, setTemperatureAlarm] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false);

    const slideAnim = useRef(new Animated.Value(-(width - hiddenWidth))).current;

    // subscribe to system status updates
    useEffect(() => {
        try {
            socket?.send(
                JSON.stringify({
                    op: 'subscribe',
                    topic: '/system',
                }),
            );
        } catch (error) {
            console.error('Error subscribing to system status:', error);

            if (useDebugMode) {
                console.warn("Debug mode is enabled. Skipping error handling.");

                return;
            }

            router.replace({
                pathname: '/ErrorScreen',
                params: {
                    errorMessage: "Error while subscribing to system status.",
                },
            });
        }

        // Listen for messages from the WebSocket
        addMessageListener((event: WebSocketMessageEvent) => {
            const data: any = JSON.parse(event.data);

            if (data.op === 'publish' && data.topic === '/system') {
                const parsedData = JSON.parse(data.msg.data);

                setCpuUsage(parsedData['CPU Usage']);
                setRamUsage(parsedData['RAM Usage']);
                setCpuTemperature(parsedData['CPU Temp']);
            }
        });
    }, [addMessageListener, router, socket, useDebugMode]);

    // open or close the drawer
    const toggleDrawer = useCallback((openDefinitely: boolean = false) => {
        if (openDefinitely && isOpen) {
            return;
        }

        Animated.timing(slideAnim, {
            toValue: isOpen ? -(width - hiddenWidth) : 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start(() => setIsOpen(!isOpen));
    }, [hiddenWidth, isOpen, slideAnim, width]);

    // check if alarms should be triggered
    useEffect(() => {
        if (!cpuUsage || !ramUsage || !cpuTemperature) {
            return;
        }

        const localCpuUsage = cpuUsage?.replace("%", "");
        const localRamUsage = ramUsage?.replace("%", "");

        if (parseInt(localCpuUsage) >= 90) {
            setCpuAlarm(true);
        } else {
            setCpuAlarm(false);
        }

        if (parseInt(localRamUsage) >= 80) {
            setRamAlarm(true);
        } else {
            setRamAlarm(false);
        }

        if (parseInt(cpuTemperature) >= 50) {
            setTemperatureAlarm(true);
        } else {
            setTemperatureAlarm(false);
        }

        if (cpuAlarm || ramAlarm || temperatureAlarm) {
            toggleDrawer(true);
        }
    }, [cpuAlarm, cpuTemperature, cpuUsage, ramAlarm, ramUsage, temperatureAlarm, toggleDrawer]);

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                position: "relative",
                left: 10,
            }}>
            <View
                style={{
                    width: width,
                    height: isTablet ? 100 : 90,
                    overflow: 'hidden',
                }}
            >
                <Animated.View
                    style={{
                        transform: [{translateX: slideAnim}],
                        width: width,
                        height: isTablet ? 100 : 90,
                        backgroundColor: colors.primary,
                        padding: 10,
                        zIndex: 1000,
                        elevation: 20,
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            marginLeft: 10,
                            alignItems: 'flex-start',
                            flex: 1,
                        }}
                    >
                        <InfoText
                            text={"CPU Usage"}
                            textColor={cpuAlarm ? colors.error : colors.textPrimary}
                            textBold={cpuAlarm}
                            info={cpuUsage}
                        />
                        <InfoText
                            text={"CPU Temp"}
                            textColor={temperatureAlarm ? colors.error : colors.textPrimary}
                            textBold={temperatureAlarm}
                            info={cpuTemperature} appendix={"°C"}
                        />
                        <InfoText
                            text={"RAM Usage"}
                            textColor={ramAlarm ? colors.error : colors.textPrimary}
                            textBold={ramAlarm}
                            info={ramUsage}
                        />
                    </View>
                    <TouchableOpacity
                        style={{
                            width: isTablet ? 20 : 15,
                            height: isTablet ? 100 : 90,
                            position: "relative",
                            right: -10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: (cpuAlarm || ramAlarm || temperatureAlarm) ? "#7e7d7d" : colors.accent,
                            borderTopRightRadius: 10,
                            borderBottomRightRadius: 10,
                        }}
                        onPress={() => toggleDrawer()}
                        disabled={cpuAlarm || ramAlarm || temperatureAlarm}
                    >
                        <Text
                            style={{
                                color: (cpuAlarm || ramAlarm || temperatureAlarm) ? "#a6a6a6" : "#fff",
                                fontSize: 18,
                            }}
                        >
                            {isOpen ? '◀' : '▶'}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>

    );
}

export default InfoPanel;
