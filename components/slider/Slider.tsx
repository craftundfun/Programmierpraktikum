import React, {useEffect, useRef, useState} from 'react';
import {Animated, Text, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import colors from '../../styles/Colors';
import {useDeviceType} from "@/components/windowDimesions/DeviceTypeContext";

type SliderProps = {
	value: number;
	setValue: (value: number) => void;
	minimumValue?: number;
	maximumValue?: number;
	active?: boolean;
	// Gesture ref for external control
	gestureRef?: any;
	// Simultaneous gesture ref for external control
	simultaneousRef?: any;
};

function MyCustomSlider({
							value,
							setValue,
							minimumValue = 0,
							maximumValue = 1,
							active = true,
							gestureRef,
							simultaneousRef,
						}: SliderProps) {
	const {isTablet} = useDeviceType();

	const SLIDER_WIDTH = isTablet ? 225 : 175;
	const THUMB_SIZE = isTablet ? 24 : 20;

	const [containerWidth, setContainerWidth] = useState(SLIDER_WIDTH);

	const translateX = useRef(new Animated.Value(0)).current;
	const valueRef = useRef(value);
	const lastEmit = useRef(0);

	// Update position when value changes externally
	useEffect(() => {
		const clampedValue = Math.min(maximumValue, Math.max(minimumValue, value));
		const pos = ((clampedValue - minimumValue) / (maximumValue - minimumValue)) * containerWidth;

		translateX.setValue(pos);

		valueRef.current = clampedValue;
	}, [value, containerWidth, minimumValue, maximumValue, translateX]);

	const startX = useRef(0);

	const gesture = Gesture.Pan()
		.onBegin(() => {
			// saves the initial position when the gesture starts
			startX.current = ((valueRef.current - minimumValue) / (maximumValue - minimumValue)) * containerWidth;
		})
		.onUpdate(event => {
			let newPos = startX.current + event.translationX;
			newPos = Math.min(containerWidth, Math.max(0, newPos));

			const newValue = minimumValue + (newPos / containerWidth) * (maximumValue - minimumValue);
			valueRef.current = newValue;

			const now = Date.now();

			// only update data every 50 ms to avoid useEffect exhaustion
			if (now - lastEmit.current > 50) {
				lastEmit.current = now;
				setValue(newValue);
			}
		})
		.onEnd(() => {
			const clampedValue = Math.min(maximumValue, Math.max(minimumValue, valueRef.current));
			const newPos = ((clampedValue - minimumValue) / (maximumValue - minimumValue)) * containerWidth;

			Animated.spring(translateX, {
				toValue: newPos,
				useNativeDriver: false,
			}).start();

			setValue(clampedValue);
		})
		.shouldCancelWhenOutside(false)
		.withRef(gestureRef)
		.simultaneousWithExternalGesture(simultaneousRef)
		.manualActivation(!active)
		.runOnJS(true);

	// Position of the filled track width (animated)
	const filledWidth = translateX.interpolate({
		inputRange: [0, containerWidth],
		outputRange: [0, containerWidth],
		extrapolate: 'clamp',
	});

	return (
		<View
			collapsable={false}
			style={{
				width: isTablet ? 250 : 200,
				padding: isTablet ? 12 : 6,
				backgroundColor: colors.primary,
				borderRadius: 14,
				justifyContent: 'center',
				alignItems: 'center',
				opacity: active ? 1 : 0.5,
			}}
		>
			<Text
				style={{
					fontSize: isTablet ? 16 : 14,
					color: colors.textPrimary,
					marginBottom: isTablet ? 8 : 2,
					fontWeight: '500',
					textAlign: 'center',
				}}
			>
				Speed: {Math.round(value * 100) + '%'}
			</Text>
			<GestureDetector gesture={gesture}>
				<View
					style={{
						width: SLIDER_WIDTH,
						height: 40,
						justifyContent: 'center',
					}}
				>
					{/* Track background */}
					<View
						style={{
							height: 4,
							borderRadius: 2,
							backgroundColor: colors.primaryLight,
							position: 'absolute',
							left: 0,
							right: 0,
						}}
					/>
					{/* Filled track */}
					<Animated.View
						style={{
							height: 4,
							borderRadius: 2,
							backgroundColor: colors.primaryDark,
							position: 'relative',
							top: isTablet ? 12 : 10,
							width: filledWidth
						}}
					/>
					{/* Thumb */}
					<Animated.View
						style={{
							width: THUMB_SIZE,
							height: THUMB_SIZE,
							borderRadius: THUMB_SIZE / 2,
							backgroundColor: colors.accent,
							position: 'relative',
							top: -2,
							transform: [
								{
									translateX: Animated.subtract(translateX, THUMB_SIZE / 2),
								},
							],
						}}
					/>
				</View>
			</GestureDetector>
		</View>
	);
}

export default MyCustomSlider;
