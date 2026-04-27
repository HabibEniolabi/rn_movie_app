import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface ButtonProps {
  title: string;
  onPress: () => void;
}

const Button = ({ title, onPress }: ButtonProps) => {
  return (
    <View
      className="mt-8 rounded-[28px]"
      style={{
        shadowColor: "#9B59F5",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 18,
        elevation: 10,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        className="h-[60px] rounded-[18px] items-center justify-center"
        style={{
          backgroundColor: "rgba(185, 84, 245, 1)",
        }}
      >
        <Text className="text-white text-xl font-bold">{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;
