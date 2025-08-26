import {AddressField, PortField} from '@/components/input/InputFields';
import colors from '@/styles/Colors';
import {useRouter} from 'expo-router';
import React, {useCallback, useEffect, useState} from 'react';
import {checkAddressAndConnect} from '@/components/connection/checkAddressAndConnect';
import {useWebSocket} from '@/components/websocket/WebSocketContext';
import ConnectionManager from '@/components/connection/ConnectionManager';
import {
    Modal,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet, ActivityIndicator,
} from 'react-native';
import NewConnectionManager from "@/components/connection/NewConnectionManager";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";
import {useFocusEffect} from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import {settingsEnum, useSettings} from "@/components/settings/SettingsContext";
import SettingsManager from "@/components/settings/SettingsManager";
import {useRobotControl} from "@/components/controls/RobotControlContext";

/**
 * Homescreen der App. Hier werden die vergangen und potenziell neue Verbindungen angezeigt. Außerdem kann man sich
 * manuell mit einem Roboter verbinden oder Einstellungen ändern.
 */
function HomeScreen(): React.JSX.Element {
    const {isTablet} = useDeviceType();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const {getSetting} = useSettings();
    const {getRobotControlIfPossible} = useRobotControl();
    const {connect} = useWebSocket();

    const [robotAddress, setRobotAddress] = useState<string>("");
    const [robotPort, setRobotPort] = useState<string>("");
    const [apiPort, setApiPort] = useState<string>("");

    const [visible, setVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    // lock the screen in landscape for tablets and portrait for phones
    useFocusEffect(
        useCallback(() => {
            if (!isTablet) {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
            } else {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            }

            return () => {
                ScreenOrientation.unlockAsync();
            };
        }, [isTablet]),
    );

    // load the settings from the storage
    useEffect(() => {
        Promise.all([
            getSetting(settingsEnum.ROBOT_ADDRESS),
            getSetting(settingsEnum.ROBOT_PORT),
            getSetting(settingsEnum.ROBOT_API_PORT),
        ]).then(([address, port, apiPort]) => {
            // @ts-ignore => these are always strings, but the function returns string or boolean
            setRobotAddress(address);
            // @ts-ignore
            setRobotPort(port);
            // @ts-ignore
            setApiPort(apiPort);
        });
    }, [getSetting]);

    // check the manually entered address and port when the user clicks the button
    const checkAddress = async () => {
        setLoading(true);

        const success = await checkAddressAndConnect(
            robotAddress,
            robotPort,
            apiPort,
            router,
            connect,
            getRobotControlIfPossible,
        );

        if (!success) {
            console.warn("Failed to connect to the robot with the provided address and port.");
        }

        setLoading(false);
    };

    const [reload, setReload] = useState<boolean>(false);

    // modal component for manual input
    const modal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={() => {
                    setVisible(false);
                }}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        // +A0 = ~62.75% opacity
                        backgroundColor: colors.background + 'A0',
                    }}
                >
                    <View
                        style={{
                            margin: 20,
                            backgroundColor: colors.primaryDark,
                            borderRadius: 10,
                            padding: 20,
                        }}
                    >
                        <Text style={{
                            color: colors.textPrimary,
                            fontSize: 20,
                            textAlign: 'center',
                            marginBottom: 20,
                            textDecorationLine: "underline",
                        }}>
                            Input custom robot address, port and API port
                        </Text>
                        <Text
                            style={{
                                color: colors.textSecondary,
                                fontSize: isTablet ? 16 : 12,
                            }}
                        >
                            Address for WebSocket
                        </Text>
                        <AddressField value={robotAddress} setValue={setRobotAddress}/>
                        <Text
                            style={{
                                color: colors.textSecondary,
                                fontSize: isTablet ? 16 : 12,
                            }}
                        >
                            Port for WebSocket
                        </Text>
                        <PortField value={robotPort} setValue={setRobotPort}/>
                        <Text
                            style={{
                                color: colors.textSecondary,
                                fontSize: isTablet ? 16 : 12,
                            }}
                        >
                            Port for API
                        </Text>
                        <PortField value={apiPort} setValue={setApiPort}/>

                        <View
                            style={{
                                flexDirection: isTablet ? "row" : "column",
                                justifyContent: "space-around",
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator size={isTablet ? 30 : 10} color={colors.accent}/>
                            ) : (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: colors.primary,
                                        borderRadius: 5,
                                        borderColor: colors.accent,
                                        borderWidth: 1,
                                        marginBottom: isTablet ? 0 : 10,
                                    }}
                                    onPress={
                                        checkAddress
                                    }
                                >
                                    <Text
                                        style={{
                                            color: colors.textPrimary,
                                            fontWeight: "bold",
                                            fontSize: isTablet ? 18 : 12,
                                            padding: 5,
                                            textAlign: "center",
                                        }}
                                    >
                                        Connect to robot
                                    </Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={{
                                    backgroundColor: colors.primary,
                                    borderRadius: 5,
                                    borderColor: colors.accent,
                                    borderWidth: 1,
                                }}
                                onPress={() => {
                                    setVisible(false);
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.textPrimary,
                                        fontWeight: "bold",
                                        fontSize: isTablet ? 18 : 12,
                                        padding: 5,
                                        textAlign: "center",
                                    }}
                                >
                                    Close
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.background,
                paddingTop: insets.top,
                paddingLeft: insets.left,
                paddingRight: insets.right,
                paddingBottom: insets.bottom,
            }}
        >
            <View style={{flex: isTablet ? 0 : 0.05}}/>
            <View
                style={{
                    flex: isTablet ? 0.5 : 0.45,
                    overflow: "hidden",
                    borderRadius: 15,
                    borderColor: colors.accent,
                    borderWidth: 2,
                }}
            >
                <ConnectionManager
                    reloadFlag={reload}
                    setReloadFlag={setReload}
                />
            </View>
            <View
                style={{
                    flex: isTablet ? 0.5 : 0.45,
                    overflow: "hidden",
                    borderRadius: 15,
                    borderColor: colors.accent,
                    borderWidth: 2,
                    marginTop: isTablet ? 10 : 5,
                    marginBottom: isTablet ? 10 : 5,
                }}
            >
                <NewConnectionManager
                    reloadFlag={reload}
                    setReloadFlag={setReload}
                />
            </View>
            <View style={{flex: isTablet ? 0 : 0.05}}/>
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    flexDirection: isTablet ? "row" : "column",
                    marginBottom: isTablet ? 10 : 0,
                    position: isTablet ? "static" : "relative",
                    top: isTablet ? 0 : -25,
                }}
            >
                <TouchableOpacity
                    onPress={() => setVisible(true)}
                    style={{
                        backgroundColor: colors.primary,
                        borderRadius: 5,
                        width: isTablet ? 350 : 250,
                        height: isTablet ? 60 : 50,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: isTablet ? 0 : 5,
                    }}
                >
                    <Text
                        style={{
                            color: colors.textPrimary,
                            fontWeight: "bold",
                            fontSize: isTablet ? 18 : 12,
                        }}
                    >
                        Input your custom robot address here!
                    </Text>
                </TouchableOpacity>
                <SettingsManager/>
            </View>
            {modal()}
        </SafeAreaView>
    );
}

StyleSheet.create({
    header: {
        color: colors.textPrimary,
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
        textDecorationLine: "underline",
    },
    error: {
        color: colors.error,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        // +A0 = ~62.75% opacity
        backgroundColor: colors.background + 'A0',
    },
    popup: {
        margin: 20,
        backgroundColor: colors.primaryDark,
        borderRadius: 10,
        padding: 20,
    },
});

// this is definitely needed to route to this screen
// @ts-ignore
export default HomeScreen;
