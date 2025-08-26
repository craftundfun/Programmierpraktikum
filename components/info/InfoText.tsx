import {ActivityIndicator, Text, View} from 'react-native';
import colors from '@/styles/Colors';
import React from 'react';
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";

type InfoTextProps = {
    text: string;
    textColor: string;
    textBold: boolean;
    info: string | null;
    appendix?: string;
};

/**
 * Text-Komponente für die Anzeige von Informationen im InfoPanel.
 */
function InfoText({text, textColor, textBold, info, appendix}: InfoTextProps): React.JSX.Element {
    const {isTablet} = useDeviceType();

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
            }}>
            <Text
                style={{
                    color: textColor,
                    fontSize: isTablet ? 18 : 14,
                    fontWeight: textBold ? 'bold' : 'normal',
                }}>
                {text}:{' '}
            </Text>
            {info ? (
                <Text
                    style={{
                        color: textColor,
                        fontSize: isTablet ? 18 : 14,
                        fontWeight: textBold ? 'bold' : 'normal',
                    }}>
                    {info + (appendix ? appendix : "")}
                </Text>
            ) : (
                <ActivityIndicator size="small" color={colors.accent}/>
            )}
        </View>
    );
}

export default InfoText;
