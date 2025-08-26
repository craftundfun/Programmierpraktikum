import {Router} from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

// Type definition for a robot in the storage
type RobotType = {
    uuid: string;
    address: string;
    port: string;
    apiPort: string;
    lastUsed: number | null;
    debugMode?: boolean;
};
export {RobotType};

/**
 * Funktion um sich mit dem WebSocket des Roboters zu verbinden und die Verbindung zu speichern.
 * Fängt Fehler ab und leitet den Nutzer zur Fehlerseite weiter, wenn die Verbindung fehlschlägt.
 */
export async function checkAddressAndConnect(
    address: string,
    port: string,
    apiPort: string,
    router: Router,
    connect: (url: string) => Promise<void>,
    getRobotControlIfPossible: (url: string) => Promise<boolean>,
    useDebugMode: boolean = false,
): Promise<boolean> {
    if (!address || !port || !apiPort) {
        throw new Error("Address, port, API address, and API port cannot be empty");
    }

    if (useDebugMode) {
        console.warn("Debug mode is enabled.");

        router.replace({
            pathname: '/ControlScreen',
            params: {
                address,
                port,
                apiPort,
            },
        });

        return true;
    }

    try {
        const url = `ws://${address}:${port}`;

        // connect with websocket
        await connect(url);

        // save robot to storage
        await newRobot(
            null,
            address,
            port,
            apiPort,
            true,
        );

        // gain access to the robot control if possible
        await getRobotControlIfPossible(`http://${address}:${apiPort}`);

        router.replace({
            pathname: '/ControlScreen',
            params: {
                address,
                port,
                apiPort,
            },
        });

        return true;
    } catch (error) {
        console.error('Error connecting to WebSocket:', error);

        router.replace({
            pathname: '/ErrorScreen',
            params: {
                errorMessage: `Error connecting to WebSocket at ws://${address}:${port}. Please check the address and port.`,
            },
        });

        return false;
    }
}

// @ts-ignore
export default checkAddressAndConnect;

const storageKey = "robots";

/**
 * Speichert einen neuen Roboter mit den gegebenen Daten in den Speicher.
 */
async function newRobot(
    uuid: string | null,
    address: string,
    port: string,
    apiPort: string,
    setLastUsed: boolean = true,
): Promise<boolean> {
    if (
        address === ""
        || port === ""
        || apiPort === ""
    ) {
        throw new Error("Arguments cannot be empty");
    }

    try {
        let data = await AsyncStorage.getItem(storageKey);

        if (!data) {
            data = JSON.stringify([]);
        }

        const robots = JSON.parse(data);
        const newRobot = {
            uuid: uuid ? uuid : uuidv4(),
            address,
            port,
            apiPort,
            lastUsed: setLastUsed ? new Date().getTime() : null,
        };

        // check if this exact robot already exists
        if (robots.some((r: any) => (
            r.address === address
            && r.port === port
            && r.apiPort === apiPort
        ))) {
            return true;
        }

        robots.push(newRobot);
        await AsyncStorage.setItem(storageKey, JSON.stringify(robots));

        return true;
    } catch (error) {
        console.error("Couldn't save new robot: ", error);

        // no route to error screen, just log the error due to potentially lock out the user of the app entirely

        return false;
    }
}

/**
 * Listet alle Roboter aus dem Speicher auf.
 */
async function getRobots(): Promise<RobotType[]> {
    const data = await AsyncStorage.getItem(storageKey);

    if (!data) {
        return [];
    }

    return JSON.parse(data);
}

/**
 * Entfernt einen Roboter aus dem Speicher anhand seiner UUID.
 */
async function removeRobot(uuid: string): Promise<void> {
    const data = await AsyncStorage.getItem(storageKey)

    if (!data) {
        return;
    }

    const robots: RobotType[] = JSON.parse(data);

    for (let i = 0; i < robots.length; i++) {
        if (robots[i].uuid === uuid) {
            robots.splice(i, 1);

            break;
        }
    }

    await AsyncStorage.setItem(storageKey, JSON.stringify(robots));
}

/**
 * Überprüft, ob ein Roboter mit der angegebenen Adresse und dem Port im Speicher existiert.
 */
async function doesRobotExist(address: string, port: string): Promise<RobotType | null> {
    const data = await AsyncStorage.getItem(storageKey);

    if (!data) {
        return null;
    }

    const robots = JSON.parse(data);
    const index = robots.findIndex((r: any) => r.address === address && r.port === port);

    if (index !== -1) {
        return robots[index];
    } else {
        return null;
    }
}

/**
 * Aktualisiert das letzte Nutzungsdatum eines Roboters anhand seiner UUID.
 */
async function updateLastUsed(uuid: string): Promise<void> {
    const data = await AsyncStorage.getItem(storageKey);

    if (!data) {
        return;
    }

    const robots: RobotType[] = JSON.parse(data);
    const index = robots.findIndex((r: any) => r.uuid === uuid);

    if (index !== -1) {
        robots[index].lastUsed = Date.now();

        await AsyncStorage.setItem(storageKey, JSON.stringify(robots));
    }
}

export {newRobot, removeRobot, doesRobotExist, updateLastUsed, getRobots};
