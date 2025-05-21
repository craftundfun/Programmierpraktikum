import {Button} from "react-native";
import {JSX} from "react";
import colors from "../../styles/Colors.tsx";

export type MyButtonProps = {
	title: string;
	onPress?: () => void;
	disabled?: boolean;
}

// Component because a Button can't have a style prop
export function DefaultButton({title, onPress = () => {}, disabled = false}: MyButtonProps): JSX.Element {
	return (
		<Button
			title={title}
			onPress={onPress}
			disabled={disabled}
			color={colors.primary}
		/>
	);
}

