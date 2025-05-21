import {StyleSheet} from "react-native";
import colors from "./Colors.tsx";

const styles = StyleSheet.create({
	default: {
		padding: '5%',
		flex: 1,
		backgroundColor: colors.background,
	},
	overlay: {
		flex: 1,
		justifyContent: 'center',
		// +80 = 50% opacity
		backgroundColor: colors.background + 'A0',
	},
	popup: {
		margin: 20,
		backgroundColor: colors.primaryDark,
		borderRadius: 10,
		padding: 20,
		elevation: 5,
	},
});

export default styles;
