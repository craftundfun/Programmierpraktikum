import {Modal, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import MyColorPicker from "@/components/leds/MyColorPicker";
import colors from "@/styles/Colors";
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";
import {useWebSocket} from "@/components/websocket/WebSocketContext";

/**
 * Manager der es ermöglicht, die LEDs zu steuern.
 * Es wird ein Kreis mit 8 LEDs angezeigt, die jeweils eine Farbe haben.
 */
function LedManager() {
    const {isTablet} = useDeviceType();
    const {socket} = useWebSocket();

    const CIRCLE_RADIUS = isTablet ? 250 : 100;
    const LED_RADIUS = isTablet ? 30 : 20;

    const [showModal, setShowModal] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [currentLedIndex, setCurrentLedIndex] = useState<number>(0);
    // eight leds with three color values each (RGB)
    const [ledColors, setLedColors] = useState<{ data: number[] }>({
        data: [
            0,
            0,
            0,

            0,
            0,
            0,

            0,
            0,
            0,

            0,
            0,
            0,

            0,
            0,
            0,

            0,
            0,
            0,

            0,
            0,
            0,

            0,
            0,
            0,
        ]
    });
    const leds = Array.from({length: 8});

    // send new data to the robot via websocket
    useEffect(() => {
        if (!socket) {
            return;
        }

        try {
            socket.send(JSON.stringify({
                op: 'publish',
                topic: '/led_rgb',
                msg: ledColors,
            }));
        } catch (error) {
            console.error('Fehler beim Senden der LED-Daten:', error);
        }
    }, [ledColors, socket]);

    return (
        <>
            <View>
                <TouchableOpacity
                    style={{
                        backgroundColor: colors.primary,
                        borderRadius: 5,
                        borderColor: colors.accent,
                        borderWidth: 1,
                        alignItems: 'center',
                        paddingVertical: isTablet ? 10 : 0,
                    }}
                    onPress={() => {
                        setShowModal(true)
                    }}
                >
                    <Text
                        style={{
                            color: colors.textPrimary,
                            fontWeight: "bold",
                            fontSize: isTablet ? 20 : 16,
                        }}
                    >
                        LED-Control
                    </Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModal}
                onRequestClose={() => {
                    setShowModal(false);
                }}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.background + 'A0',
                    }}
                >
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text
                            style={{
                                color: colors.textPrimary,
                                fontWeight: 'bold',
                                textDecorationLine: "underline",
                                fontSize: isTablet ? 36 : 20,
                                textAlign: 'center',
                                marginBottom: 25,
                            }}
                        >
                            LED-Control
                        </Text>
                        <View
                            style={{
                                width: CIRCLE_RADIUS * 2,
                                height: CIRCLE_RADIUS * 2,
                                borderRadius: CIRCLE_RADIUS,
                                borderWidth: 2,
                                borderColor: 'gray',
                                position: 'relative',
                            }}
                        >
                            {leds.map((_, i) => {
                                // calculate the position of each LED in a circle
                                const angle = (i * 2 * Math.PI) / leds.length - Math.PI * 5 / 3.625;
                                const x = CIRCLE_RADIUS * Math.cos(angle);
                                const y = CIRCLE_RADIUS * Math.sin(angle);

                                return (
                                    <TouchableOpacity
                                        key={i}
                                        style={{
                                            position: 'absolute',
                                            width: LED_RADIUS * 2,
                                            height: LED_RADIUS * 2,
                                            borderRadius: LED_RADIUS,
                                            backgroundColor: `rgb(${ledColors.data[i * 3]}, ${ledColors.data[i * 3 + 1]}, ${ledColors.data[i * 3 + 2]})`,
                                            borderWidth: 1,
                                            borderColor: 'white',
                                            left: CIRCLE_RADIUS + x - LED_RADIUS,
                                            top: CIRCLE_RADIUS + y - LED_RADIUS,
                                        }}
                                        onPress={() => {
                                            console.log(`LED ${i + 1} gedrückt`);
                                            setCurrentLedIndex(i);
                                            setShowColorPicker(true);
                                        }}
                                    />
                                );
                            })}
                        </View>
                        <TouchableOpacity
                            style={{
                                backgroundColor: colors.primary,
                                borderRadius: 5,
                                borderColor: colors.accent,
                                borderWidth: 1,
                                marginTop: 30,
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                alignItems: 'center',
                            }}
                            onPress={() => setShowModal(false)}
                        >
                            <Text
                                style={{
                                    color: colors.textPrimary,
                                    fontWeight: 'bold',
                                    fontSize: isTablet ? 18 : 12,
                                    textAlign: 'center',
                                }}
                            >
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showColorPicker}
                onRequestClose={() => {
                    setShowColorPicker(false);
                }}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.background + 'A0',
                    }}
                >
                    <View
                        style={{
                            margin: 20,
                            backgroundColor: colors.primaryDark,
                            borderRadius: 10,
                            padding: 20,
                            width: isTablet ? 500 : 300,
                            alignItems: 'center',
                        }}
                    >
                        <MyColorPicker value={ledColors} setValue={setLedColors} ledIndex={currentLedIndex}/>
                        <TouchableOpacity
                            style={{
                                backgroundColor: colors.primary,
                                borderRadius: 5,
                                borderColor: colors.accent,
                                borderWidth: 1,
                                marginTop: 20,
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                            }}
                            onPress={() => {
                                setShowColorPicker(false);
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.textPrimary,
                                    fontWeight: "bold",
                                    fontSize: isTablet ? 18 : 12,
                                    textAlign: "center",
                                }}
                            >
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

export default LedManager;