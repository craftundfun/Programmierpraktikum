import {Button, Modal, StyleSheet, Text, TextInput, View, ActivityIndicator} from "react-native";
import React, {useCallback, useState} from "react";
import Orientation from "react-native-orientation-locker";
import {useFocusEffect} from "@react-navigation/native";

function HomeScreen({navigation}: any): React.JSX.Element {
	const [address, setAddress] = useState<string>("");
	const [visible, setVisible] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	// don't use useEffect here, because it will not be called when coming back
	useFocusEffect(
		useCallback(() => {
			Orientation.lockToPortrait();
		}, [])
	);

	const checkAddress = () => {
		setLoading(true);

		// simulate a network request
		fetch("https://www.google.com")
			.then(async () => {
				await new Promise((resolve) => setTimeout(resolve, 2000)); // delay
			})
			.catch((error) => {
				console.error("Error:", error);
			})
			.finally(() => {
				setLoading(false);
				navigation.navigate("Not Home", {
					address: address,
				});
			});
	};

	return (
		<View style={{padding: '5%'}}>
			<Text>Hallo!</Text>
			<Modal
				animationType="slide"
				transparent={true}
				visible={visible}
				onRequestClose={() => {
					setVisible(!visible);
				}}>
				<View style={styles.overlay}>
					<View style={styles.popup}>
						<Text>Put in the roboter address!</Text>
						<TextInput
							style={{height: 40, borderColor: 'gray', borderWidth: 1}}
							placeholder="Enter address"
							value={address}
							onChangeText={(text) => setAddress(text)}
						/>
						{loading ? (
							<ActivityIndicator size="large" color="#0000ff"/>
						) : (address.length > 0 ? (
								<Button
									title={"Try connection"}
									disabled={address.length === 0}
									onPress={checkAddress}
								/>
							) : (
								<Button
									title={"Try connection"}
									disabled={true}
								/>
							)
						)}
					</View>
				</View>
			</Modal>
			<Button title={'Input roboter address'} onPress={() => (setVisible(true))}/>
		</View>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	popup: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 10,
		padding: 20,
		elevation: 5,
	},
});

export default HomeScreen;
