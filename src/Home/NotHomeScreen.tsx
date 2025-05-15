// for route testing
import React, {useCallback} from "react";
import {Button, Text, View} from "react-native";
import Orientation from "react-native-orientation-locker";
import {useFocusEffect} from "@react-navigation/native";

function NotHomeScreen({navigation}: any): React.JSX.Element {
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
			<Text>Not Home</Text>
			<Button title={"Go to Home"} onPress={() => navigation.navigate('Home')}/>
		</View>
	)
}

export default NotHomeScreen;