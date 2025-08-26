import colors from '@/styles/Colors';
import React from 'react';
import {StyleSheet, TextInput} from 'react-native';

type AddressFieldProps = {
    placeholder?: string | undefined;
    value: string;
    setValue: (value: string) => void;
    checkValue?: (value: string) => void;
};

type PortFieldProps = {
    placeholder?: string;
    value: string;
    setValue: (value: string) => void;
    checkValue?: (value: string) => void;
};

export function AddressField({
    placeholder = 'Enter Address',
    value,
    setValue,
    checkValue,
}: AddressFieldProps) {
    return (
        <TextInput
            style={styles.default}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            value={value}
            onChangeText={text => {
                setValue(text);
                checkValue?.(text);
            }}
        />
    );
}

export function PortField({
    placeholder = 'Enter port (default: 9090)',
    value,
    setValue,
    checkValue,
}: PortFieldProps) {
    return (
        <TextInput
            style={styles.default}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            value={value}
            onChangeText={text => {
                setValue(text);
                checkValue?.(text);
            }}
            keyboardType="numeric"
        />
    );
}

const styles = StyleSheet.create({
    default: {
        height: 40,
        borderColor: colors.accent,
        borderWidth: 1,
        marginBottom: 15,
        color: colors.textPrimary,
    },
});
