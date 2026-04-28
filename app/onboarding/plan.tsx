import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import OnboardingHeader from "@/components/OnboardingHeader";
import OnboardingHeaderInfo from "@/components/OnboardingHeaderInfo";

const Plan = () => {
  return (
    <View className="bg-primary flex-1 px-10">
      <View className="flex mt-16 flex-col">
        <OnboardingHeader step={1} />
        <OnboardingHeaderInfo
          title={"Choose your plan 🎬"}
          subtitle={
            "Pick a plan that works for you. Upgrade or cancel anytime."
          }
          warning="Save 40% with yearly billing"
        />
      </View>
    </View>
  );
};

export default Plan;
