import { View, Text, Image } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";

interface OnboardingHeaderInfoProps {
  title: string;
  subtitle: string;
  warning?: string;
}

const OnboardingHeaderInfo = ({
  title,
  subtitle,
  warning,
}: OnboardingHeaderInfoProps) => {
  return (
    <View className="flex flex-col gap-5 mt-6">
      <View className="flex-row gap-4 items-center">
        <Image source={icons.logo} className="w-12" />
        <Text className="text-2xl text-white font-bold">MovieFlix</Text>
      </View>
      <View className="flex flex-col gap-3">
        <Text className="text-3xl text-white font-bold">{title}</Text>
        <Text className="text-md text-dark-500 font-bold">{subtitle}</Text>
      </View>
      <View className="self-start flex-row items-center gap-2 rounded-full border border-[#5C4520] bg-[#1D180F] px-4 py-2">
        <View className="w-2 h-2 rounded-full bg-[#FFD84D]" />

        <Text className="text-[#FFD84D] font-bold text-sm">
          Save 40% with yearly billing
        </Text>
      </View>
    </View>
  );
};

export default OnboardingHeaderInfo;
