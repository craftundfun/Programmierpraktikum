import {View, Text} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import React, {useCallback, useState} from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import colors from "@/styles/Colors";
import {useLocalSearchParams} from "expo-router";
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";
import BackToHomeButton from "@/components/button/BackToHomeButton";
import {useSafeAreaInsets} from "react-native-safe-area-context";

/**
 * Fehlerbildschirm, der angezeigt wird, wenn ein Fehler auftritt und ggf. dem User mitteilt, was schiefgelaufen ist.
 */
function ErrorScreen(): React.JSX.Element {
    const params = useLocalSearchParams();
    const {isTablet} = useDeviceType();
    const insets = useSafeAreaInsets();

    const [errorMessage, setErrorMessage] = useState<string>(params.errorMessage as string || "An unknown error occurred.");

    // lock the screen orientation to landscape when this screen is focused
    useFocusEffect(
        useCallback(() => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

            return () => {
                ScreenOrientation.unlockAsync();
            };
        }, []),
    );

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.background,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }}
        >
            <View
                style={{
                    flex: 0.1,
                    top: 25,
                    left: 25,
                }}
            >
                <BackToHomeButton/>
            </View>
            <View
                style={{
                    flex: 0.9,
                    justifyContent: 'center',
                    padding: "10%",
                }}
            >
                <Text
                    style={{
                        textAlign: 'center',
                        marginBottom: 50,
                    }}
                >
                    <Text
                        style={{
                            color: colors.textPrimary,
                            fontSize: isTablet ? 60 : 40,
                            fontWeight: 'bold',
                            textDecorationLine: 'underline',
                        }}>
                        Error
                    </Text>
                    {'\n'}
                    <Text
                        style={{
                            color: colors.accent,
                            fontSize: isTablet ? 25 : 15,
                        }}>
                        {errorMessage.slice(0, 250)}
                    </Text>
                </Text>
            </View>
        </View>
    );
}

// this is definitely needed to route to this screen
export default ErrorScreen;