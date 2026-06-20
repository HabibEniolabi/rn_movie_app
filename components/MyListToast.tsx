import { View, Text, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import Feather from "react-native-vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MyListToastProps = {
  visible: boolean;
  message: string;
  type?: "added" | "removed";
  onHide: () => void;
};

const MyListToast = ({
  visible,
  message,
  type = "added",
  onHide,
}: MyListToastProps) => {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (!visible) return;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }, 1600);

    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: insets.top + 14,
        left: 20,
        right: 20,
        zIndex: 999,
        opacity,
        transform: [{ translateY }],
      }}
    >
      <View className="bg-[#17152A] border border-white/10 rounded-2xl px-4 py-4 flex-row items-center shadow-lg">
        <View
          className={`w-10 h-10 rounded-full items-center justify-center ${
            type === "added" ? "bg-[#AB8BFF]" : "bg-red-500"
          }`}
        >
          <Feather
            name={type === "added" ? "check" : "minus"}
            size={22}
            color="#fff"
          />
        </View>

        <View className="flex-1 ml-3">
          <Text className="text-white text-base font-extrabold">
            {message}
          </Text>

          <Text className="text-light-200 text-xs mt-1">
            {type === "added"
              ? "You can find it in My List."
              : "Removed from your saved list."}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default MyListToast;