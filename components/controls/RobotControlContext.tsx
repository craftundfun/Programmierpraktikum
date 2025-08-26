import React, {
    createContext,
    useContext, useEffect,
    useState,
} from 'react';
import {settingsEnum, useSettings} from "@/components/settings/SettingsContext";

type RobotControlContextType = {
    doWeControlTheRobot: boolean;
    getRobotControlIfPossible: (url: string) => Promise<boolean>;
    giveUpRobotControl: (url: string) => void;
    checkIfRobotIsAlreadyInUse: (url: string) => Promise<boolean>;
};

const RobotControlContext = createContext<RobotControlContextType | undefined>(undefined);

/**
 * Kontext um global den Besitzstatus des Roboters zu verwalten.
 */
export const RobotControlProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {getSetting} = useSettings();

    const [doWeControlTheRobot, setDoWeControlTheRobot] = useState(false);
    const [useDebugMode, setUseDebugMode] = useState(false);

    // load setting for debug mode
    useEffect(() => {
        getSetting(settingsEnum.USE_DEBUG_MODE)
            .then((value) => {
                // @ts-ignore => this is always a boolean, but the function returns string or boolean
                setUseDebugMode(value);
            })
    }, [getSetting]);

    const checkIfRobotIsAlreadyInUse = async (url: string): Promise<boolean> => {
        if (url === undefined) {
            throw new Error("URL is undefined, cannot check if robot is in use.");
        }

        if (useDebugMode) {
            return false;
        }

        try {
            const res = await fetch(`${url}/use_status`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 200) {
                const json = await res.json();

                return json.someone_on_robot;
            } else {
                console.warn("Failed to fetch use status, assuming robot is not in use.");

                return false;
            }
        } catch (error) {
            console.warn("Failed to fetch use status! Assuming robot is not in use.", error);

            return false;
        }
    };

    const getRobotControlIfPossible = async (url: string): Promise<boolean> => {
        if (useDebugMode) {
            setDoWeControlTheRobot(true);

            return true;
        }

        const isRobotAlreadyInUse = await checkIfRobotIsAlreadyInUse(url);

        if (isRobotAlreadyInUse && !doWeControlTheRobot) {
            console.warn("Robot is already in use by someone else.");

            return false;
        }

        try {
            const res = await fetch(`${url}/use_status`, {
                method: 'POST',
                body: JSON.stringify({
                    someone_on_robot: true,
                }),
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (res.status === 200) {
                setDoWeControlTheRobot(true);

                return true;
            } else {
                console.error("Failed to set use status to true, API returned status:", res.status);

                setDoWeControlTheRobot(false);

                return false;
            }
        } catch (error) {
            console.error("Couldn't set use status", error);

            setDoWeControlTheRobot(false);

            return false;
        }
    };

    const giveUpRobotControl = (url: string): void => {
        if (useDebugMode) {
            return;
        }

        if (!doWeControlTheRobot) {
            console.warn("We are not controlling the robot, no need to give up control.");

            return;
        }

        fetch(`${url}/use_status`, {
            method: 'POST',
            body: JSON.stringify({
                someone_on_robot: false,
            }),
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(res => {
                if (res.status === 200) {
                    setDoWeControlTheRobot(false);

                    return;
                } else {
                    setDoWeControlTheRobot(false);

                    console.error("Failed to set use status to true, API returned status:", res.status);

                    return;
                }
            })
            .catch((error) => {
                console.error("Couldn't set use status", error);

                setDoWeControlTheRobot(false);

                return;
            });
    }

    return (
        <RobotControlContext.Provider
            value={{
                doWeControlTheRobot,
                getRobotControlIfPossible,
                giveUpRobotControl,
                checkIfRobotIsAlreadyInUse,
            }}
        >
            {children}
        </RobotControlContext.Provider>
    );
};

export const useRobotControl = () => {
    const context = useContext(RobotControlContext);

    if (!context) {
        throw new Error('useRobotControl must be used within a RobotControlProvider');
    }

    return context;
};
