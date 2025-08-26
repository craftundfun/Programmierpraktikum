import React, {
    createContext,
    useContext, useState,
} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";


const settingsEnum = {
    ROBOT_ADDRESS: 'ROBOT_ADDRESS',
    ROBOT_PORT: 'ROBOT_PORT',
    ROBOT_API_PORT: 'ROBOT_API_PORT',
    SUBNET_ADDRESS: 'SUBNET_ADDRESS',
    USE_JOYSTICK: 'USE_JOYSTICK',
    USE_DEBUG_MODE: 'USE_DEBUG_MODE',
} as const;
type SettingsEnumType = typeof settingsEnum[keyof typeof settingsEnum];

export {settingsEnum};

const storageKey = "settings";
type SettingsType = {
    ROBOT_ADDRESS: string;
    ROBOT_PORT: string;
    ROBOT_API_PORT: string;
    USE_JOYSTICK: boolean;
    SUBNET_ADDRESS: string;
    USE_DEBUG_MODE: boolean;
}

const STANDARD_ADDRESS = "roboapp";
const STANDARD_PORT = "9090";
const STANDARD_API_PORT = "8081";
const STANDARD_SUBNET_ADDRESS = "192.168.10.";
const STANDARD_USE_JOYSTICK = false;
const STANDARD_USE_DEBUG_MODE = false;

type SettingsContextType = {
    getSetting: (settingType: SettingsEnumType, defaultValue?: boolean) => Promise<string | boolean>;
    setSettings: (newSettings: Partial<SettingsType>) => Promise<void>;
    resetToDefaultSettings: () => Promise<void>;
    // Flag to trigger settings reload in components
    reloadSettingsFlag: boolean;
    triggerSettingsReload: () => void;
};


const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * Globaler Zugang zu gespeicherten Einstellungen.
 */
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [reloadSettingsFlag, setReloadSettingsFlag] = useState(false);

    const triggerSettingsReload = () => setReloadSettingsFlag(prev => !prev);

    const getSetting = async (settingType: SettingsEnumType, defaultValue: boolean = false) => {
        const data = await AsyncStorage.getItem(storageKey);

        switch (settingType) {
            case "ROBOT_ADDRESS":
                if (!data || defaultValue) {
                    return STANDARD_ADDRESS;
                }

                const parsedData: SettingsType = JSON.parse(data);

                return parsedData.ROBOT_ADDRESS;
            case "ROBOT_PORT":
                if (!data || defaultValue) {
                    return STANDARD_PORT;
                }

                const parsedPortData: SettingsType = JSON.parse(data);

                return parsedPortData.ROBOT_PORT;
            case "ROBOT_API_PORT":
                if (!data || defaultValue) {
                    return STANDARD_API_PORT;
                }

                const parsedApiPortData: SettingsType = JSON.parse(data);

                return parsedApiPortData.ROBOT_API_PORT;
            case "USE_JOYSTICK":
                if (!data || defaultValue) {
                    return STANDARD_USE_JOYSTICK;
                }

                const parsedJoystickData: SettingsType = JSON.parse(data);

                return parsedJoystickData.USE_JOYSTICK;
            case "SUBNET_ADDRESS":
                if (!data || defaultValue) {
                    return STANDARD_SUBNET_ADDRESS;
                }

                const parsedSubnetData: SettingsType = JSON.parse(data);
                return parsedSubnetData.SUBNET_ADDRESS;
            case "USE_DEBUG_MODE":
                if (!data || defaultValue) {
                    return STANDARD_USE_DEBUG_MODE;
                }

                const parsedDebugData: SettingsType = JSON.parse(data);
                return parsedDebugData.USE_DEBUG_MODE;
            default:
                throw new Error(`Unknown setting type: ${settingType}`);
        }
    };

    const setSettings = async (newSettings: Partial<SettingsType>) => {
        const data = await AsyncStorage.getItem(storageKey);

        let settings: SettingsType = data ? JSON.parse(data) : {
            ROBOT_ADDRESS: STANDARD_ADDRESS,
            ROBOT_PORT: STANDARD_PORT,
            ROBOT_API_PORT: STANDARD_API_PORT,
            USE_JOYSTICK: STANDARD_USE_JOYSTICK,
            SUBNET_ADDRESS: STANDARD_SUBNET_ADDRESS,
            USE_DEBUG_MODE: STANDARD_USE_DEBUG_MODE,
        };

        settings = {...settings, ...newSettings};

        await AsyncStorage.setItem(storageKey, JSON.stringify(settings));
    };

    const resetToDefaultSettings = async () => {
        const defaultSettings: SettingsType = {
            ROBOT_ADDRESS: STANDARD_ADDRESS,
            ROBOT_PORT: STANDARD_PORT,
            ROBOT_API_PORT: STANDARD_API_PORT,
            USE_JOYSTICK: STANDARD_USE_JOYSTICK,
            SUBNET_ADDRESS: STANDARD_SUBNET_ADDRESS,
            USE_DEBUG_MODE: STANDARD_USE_DEBUG_MODE,
        };

        await AsyncStorage.setItem(storageKey, JSON.stringify(defaultSettings));
    }

    return (
        <SettingsContext.Provider
            value={{
                getSetting,
                setSettings,
                resetToDefaultSettings,
                reloadSettingsFlag,
                triggerSettingsReload,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }

    return context;
};
