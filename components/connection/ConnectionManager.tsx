import {ScrollView, Text} from 'react-native';
import React, {useEffect, useState} from "react";
import {useIsFocused} from '@react-navigation/native';
import ConnectionField from "@/components/connection/ConnectionField";
import colors from "@/styles/Colors";
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";
import {getRobots, removeRobot, RobotType} from "@/components/connection/checkAddressAndConnect";
import {settingsEnum, useSettings} from "@/components/settings/SettingsContext";

// reload flag to update the component if something changes
type ConnectionManagerProps = {
	reloadFlag: boolean;
	setReloadFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Manager um die vergangenen Verbindungen anzuzeigen und zu verwalten.
 */
function ConnectionManager({reloadFlag, setReloadFlag}: ConnectionManagerProps): React.JSX.Element {
	const {isTablet} = useDeviceType();
	const isFocused = useIsFocused();
	const {getSetting} = useSettings();

	const [robots, setRobots] = useState<RobotType[]>([]);
	const [useDebugMode, setUseDebugMode] = useState<boolean>(false);
	const [finishedLoadingSettings, setFinishedLoadingSettings] = useState<boolean>(false);

	const triggerReload = () => setReloadFlag(prev => !prev);

	// load settings from storage
	useEffect(() => {
		Promise.all([
			getSetting(settingsEnum.USE_DEBUG_MODE),
		]).then(([useDebugMode]) => {
				// @ts-ignore
				setUseDebugMode(useDebugMode);

				setFinishedLoadingSettings(true);
			}
		);
	}, [getSetting]);

	// reload addresses when the component is focused or the reload flag changes
	useEffect(() => {
		const loadAddresses = async () => {
			try {
				let parsedData = await getRobots();

				if (useDebugMode) {
					parsedData.push(
						{
							uuid: "debug-robot",
							address: "debug",
							port: "debug",
							apiPort: "debug",
							lastUsed: Date.now(),
						}
					)
				}

				// sort robots descending by lastUsed timestamp
				parsedData.sort((a: any, b: any) => (b.lastUsed ?? 0) - (a.lastUsed ?? 0));

				setRobots(parsedData);
			} catch (error) {
				console.error("Error loading addresses from AsyncStorage:", error);
			}
		};

		loadAddresses();
	}, [isFocused, reloadFlag, useDebugMode, finishedLoadingSettings]);

	return (
		<>
			<Text
				style={{
					fontSize: 20,
					color: colors.textPrimary,
					textAlign: 'center',
				}}
			>
				Recent Connections
			</Text>
			<Text
				style={{
					fontSize: 16,
					color: colors.textSecondary,
					textAlign: 'center',
				}}
			>
				These are your most recent connections.
			</Text>
			<ScrollView
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					paddingHorizontal: isTablet ? 20 : 10, // links und rechts je 10
					paddingRight: 35,      // mehr Platz rechts, damit letztes Element nicht abgeschnitten ist
				}}
				style={{
					flex: 1,
				}}
			>
				{robots.map((currentRobot, index) => (
					<ConnectionField
						key={`${currentRobot.address}:${currentRobot.port}:${index}`}
						uuid={currentRobot.uuid}
						address={currentRobot.address}
						port={currentRobot.port}
						apiPort={currentRobot.apiPort}
						lastUsed={currentRobot.lastUsed}
						triggerReload={triggerReload}
						deleteEntry={() => {
							removeRobot(currentRobot.uuid).then(triggerReload);
						}}
						style={{marginRight: index === robots.length - 1 ? 25 : 25}}
					/>
				))}
			</ScrollView>
		</>
	);
}


export default ConnectionManager;
