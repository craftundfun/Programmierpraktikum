// for route testing
import React, {useCallback} from "react";
import {Button, Text, View} from "react-native";
import Orientation from "react-native-orientation-locker";
import {useFocusEffect} from "@react-navigation/native";
import {CommonActions} from '@react-navigation/native';

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
		<View style={{padding: '5%'}}>
			<Text>Your address was {route.params?.address ?? 'unknown'}</Text>
			<Button title={"Go to Home again"}
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
