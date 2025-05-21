import colors from "./Colors.tsx";

const styles = {
	default: {
		headerStyle: {
			backgroundColor: colors.background,
		},
		headerTintColor: colors.primary,
		headerTitleStyle: {
			// otherwise this leads to an error, idk why
			fontWeight: "bold" as const,
		},
	},
};

export default styles;
