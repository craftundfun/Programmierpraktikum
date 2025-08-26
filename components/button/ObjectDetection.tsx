import {TouchableOpacity, Text} from "react-native";
import React from "react";
import colors from "@/styles/Colors";
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";

type ObjectDetectionButtonProps = {
    active: boolean;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
    disabled?: boolean;
}

/**
 * Knopf um die Objekterkennung zu aktivieren oder zu deaktivieren.
 */
function ObjectDetectionButton({active, setActive, disabled = false}: ObjectDetectionButtonProps): React.JSX.Element {
    const {isTablet} = useDeviceType();

    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={() => {
                setActive(!active);
            }}
            style={{
                flex: 1,
                backgroundColor: disabled ? (colors.textDisabled) : (active ? colors.accent : colors.primary),
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
                borderColor: colors.accent,
                borderWidth: 1,
                minHeight: "100%",
            }}>
            <Text
                style={{
                    marginTop: isTablet ? 2 : 0,
                    textAlign: "center",
                    lineHeight: isTablet ? 14 : 10,
                    color: active ? colors.textPrimary : colors.textSecondary,
                    fontSize: isTablet ? 14 : 10,
                }}
            >
                Object Detection
            </Text>
        </TouchableOpacity>
    );
}

export {ObjectDetectionButton};