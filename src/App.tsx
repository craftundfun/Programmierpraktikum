import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import HomeScreen from "./screens/home/HomeScreen.tsx";
import NotHomeScreen from "./screens/home/NotHomeScreen.tsx";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import NavigatorStyles from "./styles/Navigator.tsx";

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {


	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name="Home"
					component={HomeScreen}
					options={NavigatorStyles.default}
				/>
				<Stack.Screen
					name="Not Home"
					component={NotHomeScreen}
					options={{
						...NavigatorStyles.default,
						headerShown: false,
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>

	);
}

export default App;
