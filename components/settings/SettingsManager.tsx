import {TouchableOpacity, Text, Modal, View, Switch} from "react-native";
import {settingsEnum, useSettings} from "@/components/settings/SettingsContext";
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";
import {useEffect, useState} from "react";
import colors from '@/styles/Colors';
import {AddressField, PortField} from "@/components/input/InputFields";

// maybe validate input of this in the future
// const SUBNET_ADDRESS_REGEX = new RegExp("^((25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)\\.){3}")

function SettingsManager() {
    const {isTablet} = useDeviceType();
    const {getSetting, setSettings, resetToDefaultSettings, triggerSettingsReload} = useSettings();

    const [reloadSettings, setReloadSettings] = useState<boolean>(false);

    const [robotAddress, setRobotAddress] = useState<string>("");
    const [robotPort, setRobotPort] = useState<string>("");
    const [apiPort, setApiPort] = useState<string>("");
    const [useJoystick, setUseJoystick] = useState<boolean>(false);
    const [useDebugMode, setUseDebugMode] = useState<boolean>(false);
    const [subnetAddress, setSubnetAddress] = useState<string>("");
    const [loadedSettings, setLoadedSettings] = useState<boolean>(false);

    // load settings on mount and when reloadSettings changes
    useEffect(() => {
        Promise.all([
            getSetting(settingsEnum.ROBOT_ADDRESS),
            getSetting(settingsEnum.ROBOT_PORT),
            getSetting(settingsEnum.ROBOT_API_PORT),
            getSetting(settingsEnum.USE_JOYSTICK),
            getSetting(settingsEnum.SUBNET_ADDRESS),
            getSetting(settingsEnum.USE_DEBUG_MODE),
        ]).then(([address, port, apiPort, joystick, subnet, debugMode]) => {
            // @ts-ignore => these are always strings, but the function returns string or boolean
            setRobotAddress(address);
            // @ts-ignore
            setRobotPort(port);
            // @ts-ignore
            setApiPort(apiPort);
            // @ts-ignore
            setUseJoystick(joystick);
            // @ts-ignore
            setSubnetAddress(subnet);
            // @ts-ignore
            setUseDebugMode(debugMode);

            setLoadedSettings(true);
            setReloadSettings(false);
        });
    }, [getSetting, reloadSettings]);

    const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

    return (
        <>
            <TouchableOpacity
                style={{
                    backgroundColor: colors.primary,
                    borderRadius: 5,
                    width: isTablet ? 350 : 250,
                    height: isTablet ? 60 : 50,
                    alignItems: "center",
                    justifyContent: "center",
                }}
                onPress={() => {
                    setShowSettingsModal(true);
                }}
            >
                <Text
                    style={{
                        color: colors.textPrimary,
                        fontWeight: "bold",
                        fontSize: isTablet ? 18 : 12,
                    }}
                >
                    Change global settings
                </Text>
            </TouchableOpacity>
            {(showSettingsModal && loadedSettings) && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showSettingsModal}
                    onRequestClose={() => {
                        setShowSettingsModal(false);
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
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
                                Change the global settings for new, non saved robots
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
                            <Text
                                style={{
                                    color: colors.textSecondary,
                                    fontSize: isTablet ? 16 : 12,
                                }}
                            >
                                Subnet address to scan for robots in the local network
                            </Text>
                            <AddressField value={subnetAddress} setValue={setSubnetAddress}/>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Switch
                                    value={useJoystick}
                                    onValueChange={(value: boolean) => {
                                        setUseJoystick(value);
                                    }}
                                    thumbColor={colors.accent}
                                    trackColor={{
                                        false: colors.textSecondary,
                                        true: colors.primary,
                                    }}
                                />
                                <Text
                                    style={{
                                        color: colors.textPrimary,
                                        fontSize: isTablet ? 16 : 12,
                                        marginLeft: 10,
                                    }}
                                >
                                    Use Joystick for driving
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: 20,
                                }}
                            >
                                <Switch
                                    value={useDebugMode}
                                    onValueChange={(value: boolean) => {
                                        setUseDebugMode(value);
                                    }}
                                    thumbColor={colors.accent}
                                    trackColor={{
                                        false: colors.textSecondary,
                                        true: colors.primary,
                                    }}
                                />
                                <Text
                                    style={{
                                        color: colors.textPrimary,
                                        fontSize: isTablet ? 16 : 12,
                                        marginLeft: 10,
                                    }}
                                >
                                    Use debug mode
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: isTablet ? "row" : "column",
                                    justifyContent: "space-around",
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: colors.primary,
                                        borderRadius: 5,
                                        borderColor: colors.accent,
                                        borderWidth: 1,
                                        marginBottom: isTablet ? 0 : 10,
                                    }}
                                    onPress={async () => {
                                        await setSettings({
                                            ROBOT_ADDRESS: robotAddress,
                                            ROBOT_PORT: robotPort,
                                            ROBOT_API_PORT: apiPort,
                                            USE_JOYSTICK: useJoystick,
                                            SUBNET_ADDRESS: subnetAddress,
                                            USE_DEBUG_MODE: useDebugMode,
                                        });
                                        triggerSettingsReload();
                                        setShowSettingsModal(false);
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
                                        Save Settings
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: colors.primary,
                                        borderRadius: 5,
                                        borderColor: colors.accent,
                                        borderWidth: 1,
                                        marginBottom: isTablet ? 0 : 10,
                                    }}
                                    onPress={async () => {
                                        await resetToDefaultSettings();
                                        setReloadSettings(true);
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
                                        Reset to default and save
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: colors.primary,
                                        borderRadius: 5,
                                        borderColor: colors.accent,
                                        borderWidth: 1,
                                    }}
                                    onPress={() => {
                                        setReloadSettings(true);
                                        setShowSettingsModal(false);
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
                                        Close without saving
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </>
    );
}

export default SettingsManager;