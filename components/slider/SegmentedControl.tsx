import colors from '@/styles/Colors';
import React from 'react';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";

type SegmentedControlProps = {
    values: string[];
    index: number;
    onIndexChange: (index: number) => void;
    active?: boolean;
};

/**
 * Horizontaler Slider zur Auswahl von gegeben Werten.
 */
function MySegmentedControl({
                                values,
                                index,
                                onIndexChange,
                                active = true,
                            }: SegmentedControlProps): React.JSX.Element {
    const {isTablet} = useDeviceType();

    return (
        <SegmentedControlTab
            enabled={active}
            values={values}
            selectedIndex={index}
            onTabPress={onIndexChange}
            tabsContainerStyle={{
                flex: 1,
                margin: 10,
                borderRadius: 8,
                backgroundColor: colors.primary,
                minHeight: "100%",
            }}
            tabStyle={{
                backgroundColor: colors.primary,
                borderColor: colors.accent,
            }}
            activeTabStyle={{
                backgroundColor: colors.accent,
            }}
            tabTextStyle={{
                color: colors.textSecondary,
                lineHeight: isTablet ? 20 : 10,
                fontSize: isTablet ? 14 : 10,
            }}
            activeTabTextStyle={{
                color: colors.textPrimary,
                fontWeight: '600',
            }}
        />
    );
}

export default MySegmentedControl;
