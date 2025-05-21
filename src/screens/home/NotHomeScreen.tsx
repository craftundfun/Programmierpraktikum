// for route testing
import React, {useCallback} from "react";
import {Text, View} from "react-native";
import Orientation from "react-native-orientation-locker";
import {CommonActions, useFocusEffect} from "@react-navigation/native";
import {DefaultButton} from "../../components/button/Button.tsx";
import ViewStyles from "../../styles/View.tsx";
import TextStyles from "../../styles/Text.tsx";


function NotHomeScreen({navigation, route}: any): React.JSX.Element {
	// don't use useEffect here, because it will not be called when coming back
	useFocusEffect(
		useCallback(() => {
			Orientation.lockToLandscape();

			return () => {
				Orientation.lockToPortrait();
			};
		}, [])
	);

	return (
		<View style={ViewStyles.default}>
			<Text
				style={TextStyles.header}
			>
				Your address was {route.params?.address ?? 'unknown'}
			</Text>
			<DefaultButton
				title={"Go to Home again"}
				onPress={() => {
					navigation.dispatch(
						CommonActions.reset({
							index: 0,
							routes: [{name: 'Home'}],
						})
					);
				}}
			/>
		</View>
	);
}

export default NotHomeScreen;
