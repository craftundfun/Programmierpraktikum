import {Button, Text, View} from "react-native";
import React, {useCallback} from "react";
import Orientation from "react-native-orientation-locker";
import {useFocusEffect} from "@react-navigation/native";

function HomeScreen({navigation}: any): React.JSX.Element {
	// don't use useEffect here, because it will not be called when coming back
	useFocusEffect(
		useCallback(() => {
			Orientation.lockToPortrait();
		}, [])
	);

	return (
		<View style={{padding: '5%'}}>
			<Text>Hallo!</Text>
			<Button title={'Go to Not Home'} onPress={() => navigation.navigate('Not Home')}/>
		</View>
	);
}

export default HomeScreen;
