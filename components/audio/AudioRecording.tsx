import {
    AudioModule,
    RecordingPresets,
    setAudioModeAsync, useAudioPlayer,
    useAudioRecorder,
    useAudioRecorderState,
} from "expo-audio";
import {FontAwesome} from '@expo/vector-icons';
import {useCallback, useEffect, useState} from "react";
import {TouchableOpacity} from "react-native";
import {useWebSocket} from "@/components/websocket/WebSocketContext";
import * as FileSystem from 'expo-file-system';
import {EncodingType} from 'expo-file-system';
import colors from "@/styles/Colors";
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";
import {useRouter} from "expo-router";

type AudioRecordingProps = {
    useDebugMode?: boolean;
}

/**
 * Stellt eine Schaltfläche zum Aufnehmen von Audio bereit und sendet diese an den Roboter.
 */
function AudioRecording({useDebugMode = false}: AudioRecordingProps) {
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const recorderState = useAudioRecorderState(audioRecorder);

    const {socket} = useWebSocket();
    const {isTablet} = useDeviceType();
    const router = useRouter();
    const player = useAudioPlayer();

    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const record = useCallback(async () => {
        await audioRecorder.prepareToRecordAsync();

        audioRecorder.record();
    }, [audioRecorder]);

    const stopRecording = useCallback(async () => {
        const recordingResult = await audioRecorder.stop();

        // this works
        // @ts-ignore
        if (!recordingResult) {
            console.error("Recording failed to stop or no result returned");

            return;
        }

        // this works
        // @ts-ignore
        const audioUrl = recordingResult.url;

        if (!audioUrl) {
            console.warn("Recording URL is empty or undefined");

            return;
        }

        setFileUrl(audioUrl);
    }, [audioRecorder]);

    // get microphone permissions and set audio mode
    useEffect(() => {
        (async () => {
            const status = await AudioModule.requestRecordingPermissionsAsync();

            if (!status.granted) {
                console.error("Audio recording permissions not granted");

                return;
            }

            await setAudioModeAsync({
                playsInSilentMode: true,
                allowsRecording: true,
            })
        })();
    }, []);

    // send audio file to robot
    useEffect(() => {
        if (!fileUrl || !socket) {
            return;
        }

        try {
            FileSystem.readAsStringAsync(fileUrl, {
                encoding: EncodingType.Base64,
            }).then((base64String) => {
                socket.send(JSON.stringify({
                    op: 'publish',
                    topic: '/audio_wav',
                    msg: {
                        data: base64String,
                    },
                }));

                FileSystem.deleteAsync(fileUrl).catch((error) => {
                    console.error("Error deleting audio file:", error);
                });

                setFileUrl(null);
            });
        } catch (error) {
            console.error("Error reading audio file:", error);

            if (useDebugMode) {
                console.warn("Debug mode is enabled, skipping error handling.");

                return;
            }

            router.replace({
                pathname: '/ErrorScreen',
                params: {
                    errorMessage: "Error while reading audio file from FileSystem.",
                },
            });
        }
    }, [player, router, socket, fileUrl, useDebugMode]);

    return (
        <TouchableOpacity
            style={{
                borderRadius: 10,
                backgroundColor: colors.primary,
                height: isTablet ? 75 : 50,
                width: isTablet ? 75 : 50,
                justifyContent: "center",
                alignItems: "center",
                opacity: 0.8,
            }}
            onPress={() => {
                if (!recorderState.isRecording) {
                    record();
                } else if (recorderState.isRecording) {
                    stopRecording();
                }
            }}
        >
            <FontAwesome
                name={recorderState.isRecording ? "microphone" : "microphone-slash"}
                color={recorderState.isRecording ? "limegreen" : colors.accent}
                size={isTablet ? 75 : 50}
            />
        </TouchableOpacity>
    );
}

export default AudioRecording;