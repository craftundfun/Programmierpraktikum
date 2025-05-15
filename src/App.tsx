import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import HomeScreen from "./Home/HomeScreen.tsx";
import NotHomeScreen from "./Home/NotHomeScreen.tsx";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {


	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name="Home"
					component={HomeScreen}
				/>
				<Stack.Screen
					name="Not Home"
					component={NotHomeScreen}
				/>
			</Stack.Navigator>
		</NavigationContainer>

	);
}

export default App;
