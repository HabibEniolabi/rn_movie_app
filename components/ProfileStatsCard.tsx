import { View, Text } from "react-native";
import React from "react";

const stats = [
  { value: "47", label: "Saved" },
  { value: "128", label: "Watched" },
  { value: "34", label: "Reviews" },
  { value: "Pro", label: "Plan", highlight: true },
];

const ProfileStatsCard = () => {
  return (
    <View className="mt-6 rounded-[28px] border border-dark-400 bg-dark-300 overflow-hidden flex-row">
      {stats.map((stat, index) => {
        const isLast = index === stats.length - 1;
        return (
          <View
            key={index}
            className={`flex-1 items-center justify-center py-6 ${
              !isLast ? "border-r border-dark-400" : ""
            }`}
          >
            <Text
              className={`text-[26px] font-bold ${
                stat.highlight ? "text-[#FF4DB8]" : "text-white"
              }`}
            >
              {stat.value}
            </Text>

            <Text className="mt-2 text-[14px] text-dark-500">
              {stat.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default ProfileStatsCard;
