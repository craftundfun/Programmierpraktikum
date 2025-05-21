import {ActivityIndicator, Modal, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import React, {useCallback, useState} from "react";
import Orientation from "react-native-orientation-locker";
import {useFocusEffect} from "@react-navigation/native";
import {DefaultButton} from "../../components/button/Button.tsx";
import ViewStyles from "../../styles/View.tsx";
import TextStyles from "../../styles/Text.tsx";
import TextInputStyles from "../../styles/TextInput.tsx";
import colors from "../../styles/Colors.tsx";

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
		<View style={ViewStyles.default}>
			<Modal
				animationType="slide"
				transparent={true}
				visible={visible}
				onRequestClose={() => {
					setVisible(!visible);
				}}
			>
				{/* Close the modal when clicking outside it */}
				<TouchableWithoutFeedback onPress={() => setVisible(false)}>
					<View style={ViewStyles.overlay}>
						<View style={ViewStyles.popup}>
							<Text
								style={TextStyles.header}
							>
								Put in the robot address!
							</Text>
							<TextInput
								style={TextInputStyles.default}
								placeholder="Enter address"
								placeholderTextColor={"#000000"}
								value={address}
								onChangeText={(text) => setAddress(text)}
							/>
							{loading ? (
								<ActivityIndicator
									size="large"
									color={colors.accent}
								/>
							) : (address.length > 0 ? (
									<DefaultButton
										title={"Try connection"}
										onPress={checkAddress}
										disabled={address.length === 0}
									/>
								) : (
									<DefaultButton
										title={"Try connection"}
										disabled={true}
									/>
								)
							)}
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
			<DefaultButton
				title={'Input roboter address'}
				onPress={() => (setVisible(true))}
			/>
		</View>
	);
}

export default HomeScreen;
