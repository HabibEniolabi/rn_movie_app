import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useTranslation } from "react-i18next";

type OnboardingHeaderProps = {
  step: number;
  totalSteps?: number;
};

const OnboardingHeader = ({ step, totalSteps = 3 }: OnboardingHeaderProps) => {
  const { t } = useTranslation();

  return (
    <View className="flex-row items-center justify-between w-full">
      <TouchableOpacity
        onPress={() => router.back()}
        activeOpacity={0.8}
        className="p-2 rounded-[12px] border border-[#2A2845] bg-dark-300 items-center justify-center"
      >
        <Feather name="chevron-left" size={24} color="#8B88A8" />
      </TouchableOpacity>

      {/* Progress Bars */}
      <View className="flex-row items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index + 1 <= step;

          return (
            <View
              key={index}
              className={`h-[5px] w-[38px] rounded-full ${
                isActive ? "bg-[#E040D6]" : "bg-[#25243A]"
              }`}
            />
          );
        })}
      </View>

      {/* Step Text */}
      <Text className="text-[#8B88A8] font-semibold text-base">
        {t("onboarding.stepProgress", {
          step,
          totalSteps,
        })}
      </Text>
    </View>
  );
};

export default OnboardingHeader;