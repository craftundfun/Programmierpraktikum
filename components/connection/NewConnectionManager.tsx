import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, ScrollView, Text, View} from "react-native";
import ConnectionField from "@/components/connection/ConnectionField";
import colors from "@/styles/Colors";
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";
import {doesRobotExist, newRobot} from "@/components/connection/checkAddressAndConnect";
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import {useSettings, settingsEnum} from "@/components/settings/SettingsContext";

const TIMEOUT = 1000;
const STEP_SIZE = 10;
const MAX_IP = 255;

type RobotEntry = {
    address: string;
    reachable: boolean;
    uuid: string;
};

// reload flag to update the component if something changes
type NewConnectionManagerProps = {
    reloadFlag: boolean;
    setReloadFlag: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Hilfsfunktion, um eine Fetch-Anfrage mit einem Timeout zu versehen.
 */
const fetchWithTimeout = (url: string, timeout: number): Promise<Response> => {
    return Promise.race([
        fetch(url),
        new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), timeout)
        ),
    ]);
};

/**
 * Manager um Roboter im lokalen Netzwerk zu finden und neue Verbindungen zu erstellen.
 */
function NewConnectionManager({reloadFlag, setReloadFlag}: NewConnectionManagerProps): React.JSX.Element {
    const {isTablet} = useDeviceType();
    const {getSetting, reloadSettingsFlag} = useSettings();

    const [start, setStart] = useState<number>(0);
    const [leftScrollviewResults, setLeftScrollviewResults] = useState<RobotEntry[]>([]);
    const [rightScrollviewResults, setRightScrollviewResults] = useState<RobotEntry[]>([]);
    const [completeResults, setCompleteResults] = useState<RobotEntry[]>([]);

    const [robotStandardPort, setRobotStandardPort] = useState<string>("");
    const [apiStandardPort, setApiStandardPort] = useState<string>("");
    const [subnetAddress, setSubnetAddress] = useState<string>("");
    const [loadedSettings, setLoadedSettings] = useState<boolean>(false);

    // Load settings on mount
    useEffect(() => {
        Promise.all([
            getSetting(settingsEnum.ROBOT_PORT),
            getSetting(settingsEnum.ROBOT_API_PORT),
            getSetting(settingsEnum.SUBNET_ADDRESS),
        ]).then(([port, apiPort, subnetAddress]) => {
            // @ts-ignore => these are always strings, but the function returns string or boolean
            setRobotStandardPort(port);
            // @ts-ignore
            setApiStandardPort(apiPort);
            // @ts-ignore
            setSubnetAddress(subnetAddress);

            setLoadedSettings(true);
        });
    }, [getSetting, reloadSettingsFlag]);

    const leftScrollViewRef = useRef<ScrollView>(null);
    const rightScrollViewRef = useRef<ScrollView>(null);

    const triggerReload = () => setReloadFlag(prev => !prev);

    // Auto-scroll on update
    useEffect(() => {
        leftScrollViewRef.current?.scrollToEnd({animated: true});
    }, [leftScrollviewResults]);

    useEffect(() => {
        rightScrollViewRef.current?.scrollToEnd({animated: true});
    }, [rightScrollviewResults]);

    // keep reachable results in list and clear lists if we start again to scan
    useEffect(() => {
        if (start >= 250) {
            setLeftScrollviewResults(prev => [
                ...prev.filter(res => res.reachable),
            ]);
            setRightScrollviewResults(prev => [
                ...prev.filter(res => res.reachable),
            ]);
            setCompleteResults(prev => [
                ...prev.filter(res => res.reachable),
            ]);
        }
    }, [start]);

    // scan the network for robots
    useEffect(() => {
        if (!loadedSettings) {
            return;
        }

        const addresses: string[] = [];

        for (let i = start; i < start + STEP_SIZE && i <= MAX_IP; i++) {
            addresses.push(`${subnetAddress}${i}`);
        }

        // pings the currently selected IPs
        const pingIps = async () => {
            const pingResults = await Promise.allSettled(
                addresses.map(async (address: string) => {
                    try {
                        const response = await fetchWithTimeout(`http://${address}:${apiStandardPort}/ping`, TIMEOUT);

                        if (response.status === 200) {
                            const data = await response.json();

                            if (data.status === "success") {
                                // check if the robot was saved earlier
                                // if not, create a new uuid
                                const exists = await doesRobotExist(address, robotStandardPort);

                                if (exists === null) {
                                    return {address: address, reachable: true, uuid: uuidv4()};
                                }

                                return {address: exists.address, reachable: false, uuid: exists.uuid};
                            }
                        }

                        return {address: address, reachable: false, uuid: uuidv4()};
                    } catch {
                        return {address, reachable: false, uuid: uuidv4()};
                    }
                })
            );

            // filter out the fulfilled results and map them to RobotEntry
            const parsed = pingResults
                .filter((res): res is PromiseFulfilledResult<RobotEntry> => res.status === "fulfilled")
                .map(res => res.value);

            // deduplicate results by address
            // idk if this is still needed, but why not
            const deduplicateByAddress = (results: RobotEntry[]): RobotEntry[] => {
                const seen = new Set<string>();

                return results.filter(res => {
                    if (seen.has(res.address)) {
                        return false;
                    }

                    seen.add(res.address);

                    return true;
                });
            };

            const uniqueResults = deduplicateByAddress(parsed);

            setLeftScrollviewResults(prev => deduplicateByAddress([...prev, ...uniqueResults.slice(0, 5)]));
            setRightScrollviewResults(prev => deduplicateByAddress([...prev, ...uniqueResults.slice(5, 10)]));
            setCompleteResults(prev => deduplicateByAddress([...prev, ...uniqueResults]));
        };

        pingIps();

        // wait 1 seconds between new scan of the next IP-block
        const timeoutId = setTimeout(() => {
            setStart(prev => (prev + STEP_SIZE > MAX_IP ? 0 : prev + STEP_SIZE));
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
        }
    }, [apiStandardPort, loadedSettings, robotStandardPort, start, subnetAddress]);

    const searchResults = (paddingLeft: number, marginLeft: number) => (
        <View style={{flex: 1, alignItems: "center", marginTop: isTablet ? 20 : 30}}>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginLeft,
                paddingLeft,
            }}>
                <ActivityIndicator size={30} color={colors.accent}/>
                <Text
                    style={{
                        fontSize: 30,
                        color: colors.textPrimary,
                        paddingLeft: 15,
                    }}>
                    Scanning for robots...
                </Text>
            </View>
            <View style={{flex: 1, flexDirection: "row", marginTop: isTablet ? 0 : -20}}>
                <View style={{flex: isTablet ? 2 : 0.3}}/>
                <ScrollView
                    ref={leftScrollViewRef}
                    scrollEnabled={false}
                    contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}
                    style={{height: 225, flex: 0.1}}
                >
                    {leftScrollviewResults.slice(-5).map(entry => (
                        <Text key={entry.uuid} style={{fontSize: 18, color: "white", textAlign: 'center'}}>
                            {entry.address}
                        </Text>
                    ))}
                </ScrollView>
                <ScrollView
                    ref={rightScrollViewRef}
                    scrollEnabled={false}
                    contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}
                    style={{height: 225, flex: 0.1}}
                >
                    {rightScrollviewResults.slice(-5).map(entry => (
                        <Text key={entry.uuid} style={{fontSize: 18, color: "white", textAlign: 'center'}}>
                            {entry.address}
                        </Text>
                    ))}
                </ScrollView>
                <View style={{flexGrow: isTablet ? 2 : 0.3}}/>
            </View>
        </View>
    );

    return (
        <>
            <View style={{flex: isTablet ? 0.15 : 0.2, flexDirection: "column"}}>
                <Text style={{fontSize: 20, color: colors.textPrimary, textAlign: 'center'}}>
                    New Connection Manager
                </Text>
                <Text style={{fontSize: 16, color: colors.textSecondary, textAlign: 'center'}}>
                    This will scan for robots in the local network and display them here.
                </Text>
            </View>
            <View style={{flex: isTablet ? 0.85 : 0.8}}>
                {
                    completeResults.length === 0 || completeResults.every(r => !r.reachable)
                        ? searchResults(100, -100)
                        : (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingHorizontal: 10,
                                    paddingRight: 35,
                                    alignItems: 'center',
                                }}
                            >
                                {completeResults.map((robot) => (
                                    robot.reachable && (
                                        <ConnectionField
                                            key={robot.uuid}
                                            uuid={robot.uuid}
                                            address={robot.address}
                                            port={robotStandardPort}
                                            apiPort={apiStandardPort}
                                            triggerReload={triggerReload}
                                            lastUsed={null}
                                            saveEntry={() => {
                                                newRobot(
                                                    robot.uuid,
                                                    robot.address,
                                                    robotStandardPort,
                                                    apiStandardPort,
                                                    false,
                                                ).then(() => {
                                                    setCompleteResults(prev => prev.filter(r => r.address !== robot.address));
                                                    setLeftScrollviewResults(prev => prev.filter(r => r.address !== robot.address));
                                                    setRightScrollviewResults(prev => prev.filter(r => r.address !== robot.address));
                                                    triggerReload();
                                                });
                                            }}
                                            style={{marginRight: 25}}
                                        />
                                    )
                                ))}
                                {searchResults(20, -25)}
                            </ScrollView>
                        )
                }
            </View>
        </>
    );
}

export default NewConnectionManager;
