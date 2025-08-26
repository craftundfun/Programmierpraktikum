import ColorPicker, {
    ColorFormatsObject,
    HueSlider,
    Panel1,
    Swatches,
} from "reanimated-color-picker";
import React from "react";
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";

type MyColorPickerProps = {
    value: { data: number[] };
    setValue: (value: { data: number[] }) => void;
    ledIndex: number;
};

/**
 * Farbauswahl für eine gegebene LED.
 */
function MyColorPicker({value, setValue, ledIndex}: MyColorPickerProps) {
    const {isTablet} = useDeviceType();

    return (
        <ColorPicker
            value={`rgb(${value.data[ledIndex * 3]}, ${value.data[ledIndex * 3 + 1]}, ${value.data[ledIndex * 3 + 2]})`}
            onCompleteJS={(color: ColorFormatsObject) => {
                const rgbMatch = color.rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                if (!rgbMatch) return;

                const r = parseInt(rgbMatch[1], 10);
                const g = parseInt(rgbMatch[2], 10);
                const b = parseInt(rgbMatch[3], 10);

                const newData = [...value.data];
                newData[ledIndex * 3] = r;
                newData[ledIndex * 3 + 1] = g;
                newData[ledIndex * 3 + 2] = b;

                setValue({data: newData});
            }}
        >
            {isTablet && (
                <>
                    <Panel1/>
                    <HueSlider
                        style={{
                            marginBottom: 10,
                        }}
                    />
                </>
            )}
            <Swatches/>
        </ColorPicker>
    );
}

export default MyColorPicker;