import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";

interface ButtonProps {
  title: string;
  onPress: () => void;
  showArrow?: boolean;
  variant?: "primary" | "outline";
  disabled?: boolean;
}

const Button = ({
  title,
  onPress,
  showArrow = false,
  variant = "primary",
  disabled = false,
}: ButtonProps) => {
  const isPrimary = variant === "primary";
  const isOutline = variant === "outline";

  const backgroundColor = disabled
    ? "#2A2845"
    : isPrimary
      ? "#B954F5"
      : "transparent";

  const borderColor = isOutline || disabled ? "#2A2845" : "transparent";

  const textColor = disabled
    ? "#8B88A8"
    : isPrimary
      ? "#FFFFFF"
      : "#6A6880";

  const content = (
    <>
      <Text
          className="text-xl font-bold text-center"
          style={{ color: textColor }}
          numberOfLines={1}
        >
          {title}
        </Text>

        {showArrow && !disabled && (
          <View className="w-9 h-9 rounded-[12px] bg-white/20 items-center justify-center">
            <FontAwesome
              name="long-arrow-right"
              color="#ffffff"
              size={16}
            />
          </View>
        )}
    </>
  )

  return (
    <View
      className="w-full rounded-[22px]"
      style={
        isPrimary && !disabled
          ? {
              shadowColor: "#9B59F5",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.35,
              shadowRadius: 18,
              elevation: 10,
            }
          : undefined
      }
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.85}
        className="w-full h-[64px] rounded-[22px] overflow-hidden"
        style={{
          borderWidth: isOutline || disabled ? 1 : 0,
          borderColor,
        }}
      >
        {isPrimary && !disabled ? (
          <LinearGradient
            colors={["#D946C4", "#9B4DFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="w-full h-full items-center justify-center flex-row gap-4"
          >
            {content}
          </LinearGradient>
        ) : (
          <View
            className="w-full h-full items-center justify-center flex-row gap-4"
            style={{
              backgroundColor: disabled ? "#2A2845" : "transparent",
            }}
          >
            {content}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Button;