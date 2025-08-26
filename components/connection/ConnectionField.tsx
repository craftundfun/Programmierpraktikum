import React, {useState, useEffect, useRef} from "react";
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle} from "react-native";
import {useRouter} from "expo-router";
import {checkAddressAndConnect, updateLastUsed} from "@/components/connection/checkAddressAndConnect";
import {useWebSocket} from '@/components/websocket/WebSocketContext';
import colors from "@/styles/Colors";
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";
import {settingsEnum, useSettings} from "@/components/settings/SettingsContext";
import {useRobotControl} from "@/components/controls/RobotControlContext";

type ConnectionFieldProps = {
    uuid: string;
    address: string;
    port: string;
    apiPort: string;
    deleteEntry?: () => void;
    saveEntry?: () => void;
    triggerReload: () => void;
    lastUsed: number | null;
};

/**
 * Eine Komponente die gegebenen Daten erhält und versucht einen Roboter mit diesen Daten zu erreichen.
 * Wenn dieser erreichbar, kann man sich damit verbinden. Zeigt Daten des erreichbaren Roboters live an.
 */
function ConnectionField({
                             uuid,
                             address,
                             port,
                             apiPort,
                             deleteEntry,
                             saveEntry,
                             // outer useState to tell other components that the connection field has been updated
                             triggerReload,
                             lastUsed,
                         }: ConnectionFieldProps & { style?: any }): React.JSX.Element {
    const {isTablet} = useDeviceType();
    const {getSetting} = useSettings();
    const router = useRouter();
    const {connect} = useWebSocket();
    const {getRobotControlIfPossible} = useRobotControl();

    const [connected, setConnected] = useState(false);
    const [batteryPercentage, setBatteryPercentage] = useState<number | null>(null);
    const [cpuUsage, setCpuUsage] = useState<number | null>(null);
    const [ramUsage, setRamUsage] = useState<number | null>(null);
    const [temperature, setTemperature] = useState<number | null>(null);
    const [useDebugMode, setUseDebugMode] = useState(false);

    // get setting from storage
    useEffect(() => {
        getSetting(settingsEnum.USE_DEBUG_MODE)
            .then((value) => {
                // @ts-ignore, this is a boolean value
                setUseDebugMode(value);
            })
    }, [getSetting]);

    if (!deleteEntry && !saveEntry) {
        throw new Error("Either deleteEntry or saveEntry must be provided.");
    }

    useEffect(() => {
        // ping the api from the robot to detect if he's online
        const checkConnection = () => {
            fetch(`http://${address}:${apiPort}/ping`)
                .then(res => {
                    if (res.status === 200) {
                        return res.json().then(json => {
                            if (json.status === "success") {
                                setConnected(true);
                            } else {
                                triggerReload();
                                setConnected(false);
                            }
                        });
                    } else {
                        triggerReload();
                        setConnected(false);
                    }
                })
                .catch(() => {
                    triggerReload();
                    setConnected(false);
                });
        };

        checkConnection();

        // recheck every 5 seconds
        const intervalId = setInterval(checkConnection, 5000);

        return () => {
            clearInterval(intervalId);
        }
    }, [address, apiPort, triggerReload]);

    const localSocket = useRef<WebSocket | null>(null);

    // temporary socket to get the data from the robot
    useEffect(() => {
        if (!connected) {
            return;
        }

        try {
            localSocket.current = new WebSocket(`ws://${address}:${port}`);

            if (!localSocket) {
                return;
            }

            // subscribe to the topics we are interested in
            localSocket.current.onopen = () => {
                localSocket.current?.send(
                    JSON.stringify({
                        op: 'subscribe',
                        topic: '/battery/status',
                    }),
                );

                localSocket.current?.send(
                    JSON.stringify({
                        op: 'subscribe',
                        topic: '/system',
                    }),
                );
            };

            // listener to extract the data from the robot
            localSocket.current.onmessage = (event: WebSocketMessageEvent) => {
                const data: any = JSON.parse(event.data);

                if (data.op === 'publish' && data.topic === '/battery/status') {
                    const batteryStatus = data.msg;
                    setBatteryPercentage(Number(batteryStatus.state_of_charge.toFixed(0)));
                } else if (data.op === 'publish' && data.topic === '/system') {
                    const parsedData = JSON.parse(data.msg.data);

                    setCpuUsage(parsedData['CPU Usage']);
                    setRamUsage(parsedData['RAM Usage']);
                    setTemperature(parsedData['CPU Temp']);
                }
            };
        } catch (error) {
            console.error("WebSocket connection error:", error);

            setConnected(false);
        }

        // cleanup function to close the socket when the component unmounts or dependencies change
        return () => {
            if (localSocket.current) {
                localSocket.current.close();
                localSocket.current = null;
            }
        }

    }, [address, connected, port]);

    // function to handle the connection button click
    const handleConnect = async () => {
        try {
            await checkAddressAndConnect(
                address,
                port,
                apiPort,
                router,
                connect,
                getRobotControlIfPossible,
                useDebugMode,
            );
        } catch (error) {
            console.warn("Connection failed", error);
        }
    };

    const activityIndicator = () => {
        return (
            <ActivityIndicator
                size={isTablet ? 15 : 10}
                color={colors.accent}
                style={{
                    paddingLeft: isTablet ? 5 : 0,
                }}
            />
        );
    }

    const textContainer: ViewStyle = {
        flexDirection: "row",
        marginTop: isTablet ? 5 : 0,
    };

    const buttonText: TextStyle = {
        fontWeight: "600",
        textAlign: "center",
        lineHeight: isTablet ? 15 : 15,
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 10,
                padding: 15,
                marginVertical: 8,
                marginRight: isTablet ? 15 : 10,
            }}
        >
            <View
                style={{
                    flex: isTablet ? 0.15 : 0.15,
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                        color: colors.textPrimary,
                        fontWeight: "bold",
                    }}
                >
                    {`Address: ${address} | Port: ${port} | API Port: ${apiPort}`}
                </Text>
            </View>
            <View
                style={{
                    flexDirection: "column",
                    marginTop: isTablet ? 10 : 5,
                    flex: isTablet ? 0.67 : 0.85,
                }}
            >
                <View style={textContainer}>
                    <Text style={styles.statText}>
                        🔋 Battery:
                        {batteryPercentage !== null ? ` ${batteryPercentage}%` : null}
                    </Text>
                    {batteryPercentage === null && activityIndicator()}
                </View>
                <View style={textContainer}>
                    <Text style={styles.statText}>
                        🖥️ CPU:
                        {cpuUsage !== null ? ` ${cpuUsage}` : null}
                    </Text>
                    {cpuUsage === null && activityIndicator()}
                </View>
                <View style={textContainer}>
                    <Text style={styles.statText}>
                        💾 RAM:
                        {ramUsage !== null ? ` ${ramUsage}` : null}
                    </Text>
                    {ramUsage === null && activityIndicator()}
                </View>
                <View style={textContainer}>
                    <Text style={styles.statText}>
                        🌡️ Temperature:
                        {temperature !== null ? ` ${temperature} °C` : null}
                    </Text>
                    {temperature === null && activityIndicator()}
                </View>
                <View style={textContainer}>
                    <Text style={styles.statText}>
                        ️⏰ Last Used: {lastUsed ? ` ${new Date(lastUsed).toLocaleString()}` : " Never"}
                    </Text>
                </View>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    flex: isTablet ? 0.18 : 0.15,
                }}
            >
                <TouchableOpacity
                    style={{
                        borderRadius: 8,
                        alignSelf: "flex-end",
                        padding: isTablet ? 10 : 5,
                        backgroundColor: (connected || useDebugMode) ? "#4CAF50" : colors.textDisabled,
                    }}
                    onPress={() => {
                        handleConnect();
                        updateLastUsed(uuid);
                    }}
                    disabled={!connected && !useDebugMode}
                >
                    <Text
                        style={
                            connected || useDebugMode ? (
                                buttonText
                            ) : (
                                {
                                    color: "#a6a6a6",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    lineHeight: isTablet ? 15 : 15,
                                }
                            )
                        }
                    >
                        Connect
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={deleteEntry ? {
                        backgroundColor: "#e53935", // rot
                        borderRadius: 8,
                        alignSelf: "flex-end",
                        padding: isTablet ? 10 : 5,
                    } : {
                        backgroundColor: "#485ed3",
                        borderRadius: 8,
                        alignSelf: "flex-end",
                        padding: isTablet ? 10 : 5,
                    }}
                    onPress={deleteEntry ? deleteEntry : saveEntry}
                >
                    <Text style={
                        buttonText
                    }>
                        {deleteEntry ? "Delete" : "Save to list"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default ConnectionField;

const styles = StyleSheet.create({
    statText: {
        color: colors.textPrimary,
        fontSize: 14,
    },
});
