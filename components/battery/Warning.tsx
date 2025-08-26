import colors from '@/styles/Colors';
import {useEffect, useRef} from 'react';
import {Animated, Easing, Text} from 'react-native';
import {WarningType} from './WarningTypes';
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";

type WarningProps = {
    // Enable or disable the flashing animation
    enableAnimation: boolean;
    // Type of warning to determine animation speed, higher severity means faster flashing
    type: WarningType;
};

/**
 * Komponente die eine blinkende Warnung anzeigt, wenn der Akkustand niedrig ist.
 */
export function Warning({enableAnimation, type}: WarningProps) {
    const {isTablet} = useDeviceType();

    const flashAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // speed in milliseconds for the flashing animation
        let animSpeed;

        if (type === 'warning') {
            animSpeed = 750;
        } else if (type === 'danger') {
            animSpeed = 500;
        } else if (type === 'critical') {
            animSpeed = 200;
        } else {
            throw new Error(
                "Invalid warning type provided. Use 'warning', 'danger', or 'critical'.",
            );
        }

        if (enableAnimation) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(flashAnim, {
                        toValue: 1,
                        duration: animSpeed,
                        easing: Easing.linear,
                        useNativeDriver: false,
                    }),
                    Animated.timing(flashAnim, {
                        toValue: 0,
                        duration: animSpeed,
                        easing: Easing.linear,
                        useNativeDriver: false,
                    }),
                ]),
            ).start();
        } else {
            flashAnim.stopAnimation();
        }
    }, [enableAnimation, flashAnim, type]);

    return (
        <Animated.View
            style={{
                backgroundColor: flashAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['transparent', 'red'],
                }),
                borderRadius: 8,
                borderWidth: 2,
                borderColor: colors.accent,
                alignSelf: 'center',
                width: isTablet ? 200 : 175,
            }}>
            <Text
                style={{
                    color: colors.accent,
                    fontSize: isTablet ? 18 : 14,
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}>
                ⚠️ Battery level low!
            </Text>
        </Animated.View>
    );
}
