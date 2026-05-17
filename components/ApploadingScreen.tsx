import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const AppLoadingScreen = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0.7)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.18,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),

        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -1,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),

        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.7,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),

        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [scaleAnim, rotateAnim, fadeAnim, bounceAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-8deg", "0deg", "8deg"],
  });

  return (
    <LinearGradient
      colors={["#030014", "#120A2A", "#24103F", "#030014"]}
      locations={[0, 0.35, 0.7, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 items-center justify-center px-8"
    >
      {/* Background glow 1 */}
      <View
        className="absolute w-[260px] h-[260px] rounded-full top-[90px] -right-[90px]"
        style={{
          backgroundColor: "rgba(217, 70, 196, 0.18)",
        }}
      />

      {/* Background glow 2 */}
      <View
        className="absolute w-[240px] h-[240px] rounded-full bottom-[120px] -left-[100px]"
        style={{
          backgroundColor: "rgba(155, 77, 255, 0.18)",
        }}
      />

      {/* Logo */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { rotate },
            { translateY: bounceAnim },
          ],
        }}
        className="w-28 h-28 rounded-[36px] overflow-hidden mb-6"
      >
        <LinearGradient
          colors={["#D946C4", "#9B4DFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1 items-center justify-center border border-white/20"
        >
          <Text className="text-white font-bold text-5xl">M</Text>
        </LinearGradient>
      </Animated.View>

      <Text className="text-white font-bold text-3xl mb-2">MovieFlix</Text>

      <Text className="text-light-200 text-sm text-center mb-8">
        Find your next favorite movie
      </Text>

      <ActivityIndicator size="large" color="#D946C4" />

      <Text className="text-light-200 text-sm mt-4">Loading movies...</Text>
    </LinearGradient>
  );
};

export default AppLoadingScreen;