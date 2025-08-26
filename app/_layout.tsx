import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Slot} from 'expo-router';
import React, {useEffect, useState} from "react";
import {StatusBar, Text} from 'react-native';
import {WebSocketProvider} from "@/components/websocket/WebSocketContext";
import {DeviceTypeProvider} from "@/components/windowDimesions/DeviceTypeContext";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SettingsProvider} from "@/components/settings/SettingsContext";
import * as NavigationBar from 'expo-navigation-bar';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Font from 'expo-font';
import {RobotControlProvider} from "@/components/controls/RobotControlContext";

function App(): React.JSX.Element {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    // Hide the navigation bar and status bar on Android
    // only works partially and not in IOS
    useEffect(() => {
        NavigationBar.setVisibilityAsync("hidden");
        StatusBar.setHidden(true, 'fade');
    }, []);

    // load the icons for them to be available offline
    // otherwise if the app has no network connection, the icons will not be displayed
    useEffect(() => {
        async function loadFonts() {
            await Font.loadAsync(FontAwesome.font);
            setFontsLoaded(true);
        }

        loadFonts();
    }, []);

    if (!fontsLoaded) {
        return <Text>Load Fonts…</Text>;
    }

    return (
        // Wrap the app in the needed contexts
        <SafeAreaProvider>
            <DeviceTypeProvider>
                <WebSocketProvider>
                    <SettingsProvider>
                        <RobotControlProvider>
                            <StatusBar hidden={true}/>
                            <GestureHandlerRootView style={{flex: 1}}>
                                <Slot/>
                            </GestureHandlerRootView>
                        </RobotControlProvider>
                    </SettingsProvider>
                </WebSocketProvider>
            </DeviceTypeProvider>
        </SafeAreaProvider>
    );
}

export default App;