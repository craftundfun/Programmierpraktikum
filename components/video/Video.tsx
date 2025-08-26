import {SafeAreaView, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import React, {useEffect, useState} from 'react';
import {useSafeAreaInsets} from "react-native-safe-area-context";

type VideoProps = {
    address: string;
    port: number;
    route?: string;
};

/**
 * Zeigt einen MJPEG-Stream in einer WebView an.
 */
function Video({
                   address,
                   port,
                   route = '/video_feed',
               }: VideoProps): React.JSX.Element {
    const insets = useSafeAreaInsets();

    const [html, setHtml] = useState<string>('');

    useEffect(() => {
        const url = `http://${address}:${port}${route}`;

        setHtml(
            `
            <html lang="de">
                <body style="margin:0; padding:0; background:black; width:100%; height:100%;">
                    <img src="${url}" alt="Video" style="width:100%; height:100%; object-fit:contain;" />
                </body>
            </html>
            `
        );
    }, [address, port, route]);

    return (
        <SafeAreaView
            style={[
                StyleSheet.absoluteFill,
                {
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                },
            ]}
        >
            <WebView
                originWhitelist={['*']}
                source={{html}}
                style={{flex: 1}}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowFileAccess={true}
            />
        </SafeAreaView>
    );
}

export default Video;
