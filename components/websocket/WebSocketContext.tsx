import React, {
    createContext,
    useContext,
    useRef,
    useState,
} from 'react';

type WebSocketContextType = {
    socket: WebSocket | null;
    connect: (url: string) => Promise<void>;
    disconnect: () => void;
    isConnected: boolean;
    addMessageListener: (listener: (msg: MessageEvent) => void) => void;
    removeMessageListener: (listener: (msg: MessageEvent) => void) => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

/**
 * Globale Verwaltung eines WebSocket-Verbindungsstatus und -nachrichten.
 */
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const listenersRef = useRef<Set<(msg: MessageEvent) => void>>(new Set());

    const connect = async (url: string) => {
        if (socket) {
            socket.close();

            setSocket(null);
        }

        return new Promise<void>((resolve, reject) => {
            const ws = new WebSocket(url);
            let timeoutId: number;

            const handleOpen = () => {
                clearTimeout(timeoutId);
                setSocket(ws);
                setIsConnected(true);

                ws.onmessage = (event) => {
                    listenersRef.current.forEach((listener) => {
                        try {
                            listener(event);
                        } catch (e) {
                            console.error('WebSocket listener error:', e);
                        }
                    });
                };

                ws.onclose = () => {
                    console.warn('WebSocket closed');

                    setSocket(null);
                    setIsConnected(false);

                    listenersRef.current.clear();
                };

                ws.onerror = (err) => {
                    console.error('WebSocket error:', err);
                };

                resolve();
            }

            const handleError = (error: Event) => {
                clearTimeout(timeoutId);
                ws.close();

                reject(new Error('WebSocket connection failed'));
            }

            const handleTimeout = () => {
                console.warn('WebSocket connection timed out');
                ws.close();

                reject(new Error('WebSocket connection timed out'));
            }

            ws.onopen = handleOpen;
            ws.onerror = handleError;

            timeoutId = setTimeout(handleTimeout, 5000);
        });
    };

    const disconnect = () => {
        if (socket) {
            socket.close();
            setSocket(null);
            setIsConnected(false);

            listenersRef.current.clear();
        }
    };

    const addMessageListener = (listener: (msg: MessageEvent) => void) => {
        if (listener === undefined) {
            console.error('Attempted to add an undefined listener', listener);

            throw new Error("Listener cannot be undefined");

            return;
        }

        listenersRef.current.add(listener);
    };

    const removeMessageListener = (listener: (msg: MessageEvent) => void) => {
        listenersRef.current.delete(listener);
    };

    return (
        <WebSocketContext.Provider
            value={{
                socket,
                connect,
                disconnect,
                isConnected,
                addMessageListener,
                removeMessageListener,
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);

    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }

    return context;
};
