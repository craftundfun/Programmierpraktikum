import {View, Text, ScrollView} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import React, {ReactElement, useCallback, useEffect, useState} from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import colors from "@/styles/Colors";
import {useLocalSearchParams} from "expo-router";
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";
import BackToHomeButton from "@/components/button/BackToHomeButton";
import {useSafeAreaInsets} from "react-native-safe-area-context";

/**
 * Bildschirm der angezeigt wird, nachdem der Not-Aus-Knopf gedrückt wurde.
 * Zeigt die Ergebnisse der Not-Aus-Funktion an, also welche Nodes erfolgreich
 */
function KillButtonScreen(): React.JSX.Element {
    const params = useLocalSearchParams();
    const {isTablet} = useDeviceType();
    const insets = useSafeAreaInsets();

    const [failedToKill, setFailedToKill] = useState<string | null>(params.failedToKill as string ?? null);
    const [successfullyKilled, setSuccessfullyKilled] = useState<string | null>(params.successfullyKilled as string ?? null);
    const [nodeList, setNodeList] = useState<ReactElement[] | null>(null);

    // Set the screen orientation to landscape when the screen is focused
    useFocusEffect(
        useCallback(() => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

            return () => {
                ScreenOrientation.unlockAsync();
            };
        }, []),
    );

    useEffect(() => {
        const createNodeList = () => {
            let nodes: ReactElement[] = [];

            if (failedToKill) {
                for (const node of failedToKill.replaceAll(" ", "").split(",")) {
                    nodes.push(
                        <Text
                            key={node}
                            style={{
                                color: colors.error,
                                fontSize: isTablet ? 25 : 18,
                                marginBottom: 5,
                                textAlign: "center",
                            }}
                        >
                            {node}
                        </Text>
                    );
                }
            }

            if (successfullyKilled) {
                for (const node of successfullyKilled.replaceAll(" ", "").split(",")) {
                    nodes.push(
                        <Text
                            key={node}
                            style={{
                                color: "limegreen",
                                fontSize: isTablet ? 25 : 18,
                                marginBottom: 5,
                                textAlign: "center",
                            }}
                        >
                            {node}
                        </Text>
                    );
                }
            }

            setNodeList(nodes);
        }

        createNodeList();
    }, [failedToKill, isTablet, successfullyKilled]);

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
                        fontWeight: "bold",
                        color: colors.textPrimary,
                        textDecorationLine: "underline",
                        fontSize: isTablet ? 30 : 20,
                        textAlign: "center",
                        marginBottom: 20,
                    }}
                >
                    EMERGENCY SHUTDOWN RESULTS
                </Text>
                <ScrollView
                    persistentScrollbar={true}
                    indicatorStyle={"white"}
                >
                    {nodeList !== null ? (
                        nodeList.map((node, index) => (
                            node
                        ))
                    ) : (
                        <Text
                            style={{
                                color: colors.textPrimary,
                            }}
                        >
                            No information about killed nodes.
                        </Text>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}

// this is definitely needed to route to this screen
export default KillButtonScreen;