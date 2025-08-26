import React, {useEffect, useState} from 'react';
import {Text, View, ActivityIndicator, TextStyle} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import colors from '@/styles/Colors';
import {useWebSocket} from "@/components/websocket/WebSocketContext";
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";
import {useRouter} from "expo-router";

type BatteryProps = {
    // Optional: Array of battery percentages that trigger a warning
    warningPercentage?: number[];
    // Optional: Function to call when battery percentage is in warning range
    warningFunction?: (percentage: number) => void;
    useDebugMode?: boolean;
};

/**
 * Stellt den Batteriestatus des Roboters dar, einschließlich des Ladezustands und der verbleibenden Zeit bis zur Entladung.
 * Kann optional eine Warnung bei benutzerdefinierten Batterieständen anzeigen.
 */
function Battery({warningPercentage, warningFunction, useDebugMode = false}: BatteryProps) {
    const {socket, addMessageListener, removeMessageListener} = useWebSocket();
    const {isTablet} = useDeviceType();
    const router = useRouter();

    const [stateOfCharge, setStateOfCharge] = useState<number | null>(null);
    const [timeToEmpty, setTimeToEmpty] = useState<number | null>(null);

    // subscribe to battery status updates
    useEffect(() => {
        try {
            socket?.send(
                JSON.stringify({
                    op: 'subscribe',
                    topic: '/battery/status',
                }),
            );
        } catch (error) {
            console.error('Error subscribing to battery status:', error);

            if (useDebugMode) {
                console.warn("Debug mode is enabled. Skipping error handling.");

                return;
            }

            router.replace({
                pathname: '/ErrorScreen',
                params: {
                    errorMessage: "Error while subscribing to battery status.",
                },
            });
        }

        // listener to handle incoming battery status messages
        const listener = (event: WebSocketMessageEvent) => {
            const data: any = JSON.parse(event.data);

            if (data.op === 'publish' && data.topic === '/battery/status') {
                const batteryStatus = data.msg;
                const percentage = Number(batteryStatus.state_of_charge.toFixed(0));
                const time = Number(batteryStatus.time_to_empty);

                setStateOfCharge(percentage);
                setTimeToEmpty(time);

                if (warningPercentage?.includes(percentage)) {
                    warningFunction?.(percentage);
                }
            }
        };

        addMessageListener(listener);

        return () => {
            removeMessageListener(listener);
        };
    }, [addMessageListener, removeMessageListener, router, socket, useDebugMode, warningFunction, warningPercentage]);

    const [batteryIcon, setBatteryIcon] = useState<React.ReactElement | null>(null);
    const [batteryText, setBatteryText] = useState<React.ReactElement>();

    // battery icon and optional loading spinner if no data is available
    // if data is available, display the battery percentage with appropriate color coding
    useEffect(() => {
        const batteryIconSize = isTablet ? 50 : 35;
        const percentText: TextStyle = {
            position: "relative",
            top: isTablet ? -37 : -30,
            fontSize: 16,
            color: colors.textPrimary,
            fontWeight: 'bold',
        };

        if (stateOfCharge === null) {
            setBatteryIcon(
                <FontAwesome name="battery-4" size={batteryIconSize} color={colors.primaryLight}/>
            );
            setBatteryText(
                <ActivityIndicator
                    size={15}
                    color={colors.accent}
                    style={{
                        position: "relative",
                        top: isTablet ? -36 : -26,
                    }}
                />
            );

            return;
        }

        if (stateOfCharge >= 75) {
            setBatteryIcon(
                <FontAwesome name="battery-4" size={batteryIconSize} color="limegreen"/>
            );
            setBatteryText(
                <Text style={percentText}>
                    {stateOfCharge + '%'}
                </Text>
            )
        } else if (stateOfCharge >= 50) {
            setBatteryIcon(
                <FontAwesome name="battery-3" size={batteryIconSize} color="yellow"/>
            );
            setBatteryText(
                <Text style={{...percentText, color: 'black'}}>
                    {stateOfCharge + '%'}
                </Text>
            )
        } else if (stateOfCharge >= 25) {
            setBatteryIcon(
                <FontAwesome name="battery-2" size={batteryIconSize} color="orange"/>
            );
            setBatteryText(
                <Text style={percentText}>
                    {stateOfCharge + '%'}
                </Text>
            )
        } else if (stateOfCharge >= 5) {
            setBatteryIcon(
                <FontAwesome name="battery-1" size={batteryIconSize} color="red"/>
            );
            setBatteryText(
                <Text style={percentText}>
                    {stateOfCharge + '%'}
                </Text>
            )
        } else {
            setBatteryIcon(
                <FontAwesome name="battery-0" size={batteryIconSize} color="darkred"/>
            );
            setBatteryText(
                <Text style={percentText}>
                    {stateOfCharge + '%'}
                </Text>
            )
        }
    }, [isTablet, stateOfCharge]);

    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            padding: 10,
            marginRight: 5,
        }}>
            <View style={{
                position: 'relative',
                top: 10,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 20,
            }}>
                {batteryIcon}
                {batteryText}
            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <AntDesign name="clockcircle" size={isTablet ? 36.75 : 25} color="white"/>
                <Text style={{
                    fontSize: 16,
                    color: colors.textPrimary,
                    fontWeight: 'bold',
                    marginLeft: 8,
                }}>
                    {timeToEmpty === null ? (
                        <ActivityIndicator size={isTablet ? "large" : "small"} color={colors.accent}/>
                    ) : (
                        Math.floor(timeToEmpty / 60) + ' Min'
                    )}
                </Text>
            </View>
        </View>
    );
}

export default Battery;
