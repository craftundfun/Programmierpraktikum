// DeviceTypeContext.tsx
import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import * as Device from 'expo-device';

type DeviceType = {
    isTablet: boolean;
    isPhone: boolean;
};

const DeviceTypeContext = createContext<DeviceType>({
    isTablet: false,
    isPhone: true,
});

export const useDeviceType = () => useContext(DeviceTypeContext);

type Props = {
    children: ReactNode;
};

/**
 * Globale Komponente, die den Gerätetyp bereitstellt.
 */
export const DeviceTypeProvider = ({children}: Props) => {
    const [deviceType, setDeviceType] = useState<DeviceType>({
        isTablet: false,
        isPhone: true,
    });

    useEffect(() => {
        const checkDeviceType = async () => {
            const type = await Device.getDeviceTypeAsync();
            const isTablet = type === Device.DeviceType.TABLET;

            setDeviceType({
                isTablet,
                isPhone: !isTablet,
            });
        };

        checkDeviceType();
    }, []);

    return (
        <DeviceTypeContext.Provider value={deviceType}>
            {children}
        </DeviceTypeContext.Provider>
    );
};
