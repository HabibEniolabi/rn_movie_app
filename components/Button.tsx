import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
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
  return (
    <View
      className="rounded-[28px]"
      style={
        isPrimary
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
        className={`h-[64px] rounded-[22px] items-center flex-row justify-center gap-4 ${
          isPrimary ? "bg-[#B954F5]" : "bg-transparent border border-[#2A2845]"
        } ${disabled ? "opacity-50" : "opacity-100"}`}
        // style={{
        //   backgroundColor: "rgba(185, 84, 245, 1)",
        // }}
      >
        <Text
          className={`text-xl font-bold ${
            isPrimary ? "text-white" : "text-[#6A6880]"
          }`}
        >
          {title}
        </Text>
        {showArrow && (
          <View className="w-9 h-9 rounded-[12px] bg-white/20 items-center justify-center">
            <FontAwesome
              name="long-arrow-right"
              color="#ffffff"
              size={12}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Button;
