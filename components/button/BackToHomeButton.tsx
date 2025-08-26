import {useRouter} from "expo-router";
import colors from "@/styles/Colors";
import {Text, TouchableOpacity} from "react-native";
import React from "react";
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";
import {useWebSocket} from "@/components/websocket/WebSocketContext";
import {useRobotControl} from "@/components/controls/RobotControlContext";

type BackToHomeButtonProps = {
    // optional prop to set a state when the button is pressed
    setWasPressed?: React.Dispatch<React.SetStateAction<boolean>>;
    // optional prop to specify a URL for robot control
    url?: string | null;
};

/**
 * Knopf um zum Homescreen zu navigieren. Wenn eine URL mitgegeben wird, meldet sich der Button vom Roboter ab.
 */
function BackToHomeButton({setWasPressed, url = null}: BackToHomeButtonProps): React.JSX.Element {
    const router = useRouter();
    const {isTablet} = useDeviceType();
    const {disconnect} = useWebSocket();
    const {giveUpRobotControl} = useRobotControl();

    return (
        <TouchableOpacity
            style={{
                width: isTablet ? 50 : 40,
                height: isTablet ? 50 : 40,
                padding: 10,
                backgroundColor: colors.accent,
                borderRadius: 87.5,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onPress={() => {
                if (setWasPressed) {
                    setWasPressed(true);
                }

                disconnect();
                url && giveUpRobotControl(url);
                router.replace('/');
            }}
        >
            <Text
                style=
                    {{
                        color: "white",
                        fontWeight: "bold",
                        lineHeight: isTablet ? 20 : 15,
                        fontSize: isTablet ? 20 : 15,
                    }}
            >
                {"X"}
            </Text>
        </TouchableOpacity>
    );
}

export default BackToHomeButton;