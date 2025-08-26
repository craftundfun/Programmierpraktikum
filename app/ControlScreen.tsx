import Battery from '@/components/battery/Battery';
import {Warning} from '@/components/battery/Warning';
import {WarningType} from '@/components/battery/WarningTypes';
import InfoPanel from '@/components/info/InfoPanel';
import MySegmentedControl from '@/components/slider/SegmentedControl';
import MySlider from '@/components/slider/Slider';
import colors from '@/styles/Colors';
import {useFocusEffect} from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, SafeAreaView, ActivityIndicator, Text, Platform} from 'react-native';
import {useWebSocket} from '@/components/websocket/WebSocketContext';
import Video from '@/components/video/Video';
import {useLocalSearchParams, useRouter} from 'expo-router';
import KillButton from '@/components/button/KillButton';
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import BackToHomeButton from "@/components/button/BackToHomeButton";
import ColorDetector from "@/components/colorDetection/ColorDetector";
import ControlPad from "@/components/controls/ControlPad";
import AudioRecording from "@/components/audio/AudioRecording";
import {ObjectDetectionButton} from "@/components/button/ObjectDetection";
import {useSettings, settingsEnum} from "@/components/settings/SettingsContext";
import Joystick from "@/components/controls/JoyStick";
import LedManager from "@/components/leds/LedManager";
import {useRobotControl} from "@/components/controls/RobotControlContext";

function ControlScreen(): React.JSX.Element {
    const router = useRouter();
    const params = useLocalSearchParams();
    const {socket} = useWebSocket();
    const {isTablet} = useDeviceType();
    const insets = useSafeAreaInsets();
    const {getSetting} = useSettings();
    const {doWeControlTheRobot, getRobotControlIfPossible} = useRobotControl();

    const [wasHomeButtonPressed, setWasHomeButtonPressed] = useState<boolean>(false);
    const [wasKillButtonPressed, setWasKillButtonPressed] = useState<boolean>(false);

    const [cameraPort, setCameraPort] = useState<string>(params.apiPort as string || '');
    const [address, setAddress] = useState<string>(params.address as string || '');
    const [apiPort, setApiPort] = useState<string>(params.apiPort as string || '');

    const [useJoystick, setUseJoystick] = useState<boolean>(false);
    const [useDebugMode, setUseDebugMode] = useState<boolean>(false);
    const [finishedLoadingSettings, setFinishedLoadingSettings] = useState<boolean>(false);

    const [speedMultiplier, setSpeedMultiplier] = useState(0.5);
    const [activeObjectDetection, setActiveObjectDetection] = useState<boolean>(false);

    // Segmented Control for camera selection and driving mode
    // 0 = left camera, 1 = separate camera, 2 = right camera
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [cameraValues, setCameraValues] = useState<string[]>([
        'Left camera',
        'Separate cameras',
        'Right camera',
    ]);
    const [videoType, setVideoType] = useState('');
    // 0 = manual, 1 = autonomous, 2 = follow person
    const [drivingMode, setDrivingMode] = useState<number>(0);
    const [active, setActive] = useState<boolean>(true);
    const [drivingValues, setDrivingValues] = useState<string[]>([
        'Manual',
        'Autonomous',
    ]);

    // Battery warning logic
    const [showBatteryWarning, setShowBatteryWarning] = useState(false);
    const [warningType, setWarningType] = useState<WarningType>('warning');
    // levels of percentage for battery warnings
    const batteryWarningLevels = useMemo(() => [20, 10, 5, 1], []);
    // Function to handle battery warning based on percentage
    const batteryWarning = useCallback((percentage: number) => {
        const biggest = Math.max(...batteryWarningLevels);

        if (percentage > biggest) {
            setShowBatteryWarning(false);
        } else {
            setShowBatteryWarning(true);
        }

        if (percentage <= 5) {
            setWarningType('critical');
        } else if (percentage <= 10) {
            setWarningType('danger');
        } else if (percentage <= 20) {
            setWarningType('warning');
        }
    }, [batteryWarningLevels]);

    const joystickGestureRef = useRef(null);
    const sliderGestureRef = useRef(null);

    // fix the screen orientation to landscape
    useFocusEffect(
        useCallback(() => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

            return () => {
                ScreenOrientation.unlockAsync();
            };
        }, []),
    );

    // load settings from storage
    useEffect(() => {
        Promise.all([
            getSetting(settingsEnum.USE_JOYSTICK),
            getSetting(settingsEnum.USE_DEBUG_MODE),
        ]).then(([useJoystick, useDebugMode]) => {
                // @ts-ignore
                setUseJoystick(useJoystick);
                // @ts-ignore
                setUseDebugMode(useDebugMode);

                setFinishedLoadingSettings(true);
            }
        );
    }, [getSetting]);

    // if the websocket is not connected, redirect to error screen
    useEffect(() => {
        if (!socket && !wasHomeButtonPressed && !wasKillButtonPressed && !useDebugMode && finishedLoadingSettings) {
            console.warn("No WebSocket connection available.");

            router.replace({
                pathname: '/ErrorScreen',
                params: {
                    errorMessage: "No WebSocket connection available anymore.",
                },
            });
        }
    }, [finishedLoadingSettings, router, socket, useDebugMode, wasHomeButtonPressed, wasKillButtonPressed]);

    // Update videoType based on selectedIndex
    useEffect(() => {
        if (activeObjectDetection) {
            if (selectedIndex === 0) {
                setVideoType("?camera=left&detect=1");
            } else if (selectedIndex === 1) {
                setVideoType("?camera=right&detect=1");
            }
        } else {
            if (selectedIndex === 0) {
                setVideoType("?camera=left");
            } else if (selectedIndex === 1) {
                setVideoType("");
            } else if (selectedIndex === 2) {
                setVideoType("?camera=right");
            }
        }
    }, [selectedIndex, activeObjectDetection, params.cameraPort]);

    // Update camera values and driving values based on activeObjectDetection
    useEffect(() => {
        if (activeObjectDetection) {
            setCameraValues([
				'Left camera',
				'Right camera',
            ]);
            setDrivingValues([
                'Manual',
                'Autonomous',
                'Follow person',
            ])
            setSelectedIndex(0);
        } else {
            setCameraValues([
				'Left camera',
				'Separate cameras',
				'Right camera',
            ]);
            setDrivingValues([
                'Manual',
                'Autonomous',
            ]);
            setSelectedIndex(1);
        }
    }, [activeObjectDetection]);

    // Update driving mode and send a message to WebSocket
    useEffect(() => {
        if (drivingMode === 0) {
            setActive(true);
        } else {
            setActive(false);
        }

        const newMessage = JSON.stringify({
            op: 'publish',
            topic: '/driving_mode',
            msg: {
                data: drivingMode === 0 ? "manuell" : drivingMode === 1 ? "autonom" : "follow_person",
            },
        });

        try {
            socket?.send(newMessage);
        } catch (error) {
            console.error('Error sending driving mode message:', error);
        }
    }, [drivingMode, router, socket]);

    // recheck every 5 seconds if the robot is already in use
    useEffect(() => {
        const localFunc = async () => {
            getRobotControlIfPossible(`http://${address}:${apiPort}`);
        }

        const interval = setInterval(localFunc, 5000); // Check every 5 seconds

        return () => {
            clearInterval(interval);
        }
    }, [address, apiPort, getRobotControlIfPossible, isTablet]);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.background,
                paddingTop: insets.top - 10,
                paddingLeft: insets.left,
                paddingRight: insets.right,
                //paddingBottom: insets.bottom,
            }}
        >
            <Video
                address={address}
                port={parseInt(cameraPort)}
                route={`/video_feed${videoType}`}
            />
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    flex: isTablet ? 0.05 : 0.075,
                }}>
                <View
                    style={{
                        flex: 1.3,
                        marginHorizontal: isTablet ? 5 : 2,
                    }}>
                    <MySegmentedControl
                        values={cameraValues}
                        index={selectedIndex}
                        onIndexChange={setSelectedIndex}
                    />
                </View>
                <View
                    style={{
                        flex: 0.4,
                        marginHorizontal: isTablet ? 5 : -7.5,
                    }}>
                    <ObjectDetectionButton
                        active={activeObjectDetection}
                        setActive={setActiveObjectDetection}
                    />
                </View>
                <View
                    style={{
                        flex: 1.3,
                        marginHorizontal: isTablet ? 5 : 2,
                    }}>
                    {doWeControlTheRobot && (
                        <MySegmentedControl
                            values={drivingValues}
                            index={drivingMode}
                            onIndexChange={setDrivingMode}
                        />
                    )}
                </View>
            </View>
            <View
                style={{
                    flex: isTablet ? 0.2 : 0.15,
                    flexDirection: "row",
                    justifyContent: 'space-between',
                }}
            >
                <View
                    style={{
                        marginTop: isTablet ? 25 : 25,
                        marginLeft: isTablet ? 15 : 10,
                    }}
                >
                    <BackToHomeButton setWasPressed={setWasHomeButtonPressed} url={`http://${address}:${apiPort}`}/>
                </View>
                <View
                    style={{
                        flex: isTablet ? 0.2 : 0.2,
                        flexDirection: 'column',
                        position: 'relative',
                        top: isTablet ? 10 : 5,
                    }}>
                    <Battery
                        warningPercentage={batteryWarningLevels}
                        warningFunction={batteryWarning}
                        useDebugMode={useDebugMode}
                    />
                    {showBatteryWarning && (
                        <View
                            style={{
                                position: "relative",
                                left: isTablet ? 0 : -17.5,
                                top: -15,
                            }}
                        >
                            <Warning
                                enableAnimation={showBatteryWarning}
                                type={warningType}
                            />
                        </View>
                    )}
                    <View
                        style={{
                            position: "relative",
                            left: isTablet ? 120 : 80,
                            top: isTablet ? 10 : 5,
                        }}
                    >
                        <ColorDetector useDebugMode={useDebugMode}/>
                    </View>
                    <View style={{
                        zIndex: 10,
                        position: "relative",
                        left: isTablet ? 122.5 : 80,
                        top: isTablet ? 50 : 25,
                    }}>
                        {(doWeControlTheRobot && Platform.OS === "android") && (
                            <AudioRecording useDebugMode={useDebugMode}/>
                        )}
                    </View>
                    <View
                        style={{
                            zIndex: 10,
                            position: "relative",
                            top: isTablet ? 75 : 35,
                        }}
                    >
                        {(doWeControlTheRobot && Platform.OS === "android") && (
                            <LedManager/>
                        )}
                    </View>
                </View>
            </View>
            {/* Spacer */}
            <View
                collapsable={false}
                style={{
                    flex: isTablet ? 0.4 : 0.3,
                }}
            >
                <View
                    style={{
                        position: "relative",
                        top: isTablet ? -30 : 20,
                    }}
                >
                    <InfoPanel useDebugMode={useDebugMode}/>
                </View>
            </View>
            {/* Controls */}
            {doWeControlTheRobot ? (
                <View
                    style={{
                        flex: isTablet ? 0.35 : 0.45,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <View
                        collapsable={false}
                        style={{
                            position: "relative",
                            left: isTablet ? 50 : 10,
                        }}
                    >
                        {useJoystick ? (
                            <Joystick
                                speedMultiplier={speedMultiplier}
                                active={active}
                                gestureRef={joystickGestureRef}
                                simultaneousRef={sliderGestureRef}
                                useDebugMode={useDebugMode}
                            />
                        ) : (
                            <ControlPad
                                speedMultiplier={speedMultiplier}
                                simultaneousRef={sliderGestureRef}
                                gestureRef={joystickGestureRef}
                                active={active}
                                useDebugMode={useDebugMode}
                            />
                        )}
                    </View>
                    <View
                        style={{
                            position: "relative",
                            left: isTablet ? -40 : 0,
                        }}
                    >
                        {wasKillButtonPressed ? (
                            <ActivityIndicator size={isTablet ? 100 : 50} color={colors.error}/>
                        ) : (
                            <KillButton wasPressed={setWasKillButtonPressed}/>
                        )}
                    </View>
                    <View
                        collapsable={false}
                        style={{
                            position: "relative",
                            right: isTablet ? 50 : 40,
                            top: isTablet ? 0 : 20,
                        }}
                    >
                        <MySlider
                            value={speedMultiplier}
                            setValue={setSpeedMultiplier}
                            active={active}
                            gestureRef={sliderGestureRef}
                            simultaneousRef={joystickGestureRef}
                        />
                    </View>
                </View>
            ) : (
                <View
                    style={{
                        flex: isTablet ? 0.35 : 0.45,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: colors.primary,
                            padding: isTablet ? 20 : 10,
                            marginTop: isTablet ? 0 : 100,
                        }}
                    >
                        <Text
                            style={{
                                color: colors.textPrimary,
                                fontSize: isTablet ? 25 : 15,
                            }}
                        >
                            Someone else is already controlling the robot.
                        </Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

// this is definitely needed to route to this screen
export default ControlScreen;
