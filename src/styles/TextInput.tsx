import {StyleSheet} from "react-native";
import colors from "./Colors.tsx";

const styles = StyleSheet.create({
	default: {
		height: 40,
		borderColor: colors.accent,
		borderWidth: 1,
		marginBottom: 15,
		color: colors.textPrimary,
	},
});

export default styles;
