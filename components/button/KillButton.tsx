import {TouchableOpacity, Text} from "react-native";
import {useWebSocket} from "@/components/websocket/WebSocketContext";
import React, {useEffect, useState} from "react";
import {useRouter} from "expo-router";
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";
import {useRobotControl} from "@/components/controls/RobotControlContext";
import {settingsEnum, useSettings} from "@/components/settings/SettingsContext";

type KillButtonProps = {
    // Optional prop to indicate if the button was pressed
    wasPressed?: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * Knopf um den Roboter im Notfall zu stoppen.
 */
function KillButton({wasPressed}: KillButtonProps): React.JSX.Element {
    const {isTablet} = useDeviceType();
    const {getSetting} = useSettings();
    const {socket, disconnect} = useWebSocket();
    const {giveUpRobotControl} = useRobotControl();
    const router = useRouter();

    const [address, setAddress] = useState<string>("");
    const [apiPort, setApiPort] = useState<string>("");

    // load settings for robot address and API port
    useEffect(() => {
        Promise.all([
            getSetting(settingsEnum.ROBOT_ADDRESS),
            getSetting(settingsEnum.ROBOT_API_PORT),
        ]).then(([address, apiPort]) => {
            // @ts-ignore => these are always strings, but the function returns string or boolean
            setAddress(address)
            // @ts-ignore
            setApiPort(apiPort);
        });
    }, [getSetting]);

    const manuelDrivingModeMessage = JSON.stringify({
        op: 'publish',
        topic: '/driving_mode',
        msg: {
            data: false,
        },
    });

    const stopDrivingMessage = JSON.stringify({
        op: 'publish',
        topic: '/cmd_vel',
        msg: {
            linear: {
                x: 0,
                y: 0,
                z: 0,
            },
            angular: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
    });

    const shutdown = () => {
        if (wasPressed) {
            wasPressed(true);
        }

        if (socket) {
            socket.send(manuelDrivingModeMessage);
            socket.send(stopDrivingMessage);

            disconnect();
        }

        giveUpRobotControl(`http://${address}:${apiPort}`);

        let json: { "failed_to_kill": string[], status: string, successfully_killed: string[] } | null = null;

        fetch(`http://${address}:${apiPort}/notaus`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async (response) => {
                if (!response.ok) {
                    console.error("Failed to send emergency stop command");
                }

                json = await response?.json();
            })
            .catch(error => {
                console.error("Fetch error:", error);
            })
            .finally(
                () => {
                    router.replace({
                        pathname: '/KillButtonScreen',
                        params: {
                            failedToKill: json ? json["failed_to_kill"] : null,
                            successfullyKilled: json ? json["successfully_killed"] : null,
                        },
                    });
                }
            );
    }

    return (
        <TouchableOpacity
            onPress={shutdown}
            style={{
                backgroundColor: "red",
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                height: isTablet ? 60 : 50,
                width: isTablet ? 200 : 150,
            }}
        >
            <Text
                style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: isTablet ? 20 : 12,
                }}
            >
                EMERGENCY STOP
            </Text>
        </TouchableOpacity>
    );
}

export default KillButton;