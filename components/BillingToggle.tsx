import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type BillingType = "monthly" | "yearly";

interface BillingToggleProps {
  value: BillingType;
  onChange: (value: BillingType) => void;
}

const BillingToggle = ({ value, onChange }: BillingToggleProps) => {
  const isYearly = value === "yearly";
  const isMonthly = value === "monthly";

  return (
    <View className="h-[64px] rounded-[24px] border border-[#2A2845] bg-[#141325] p-2 flex-row items-center">
      {/* Monthly */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onChange("monthly")}
        className={`flex-1 h-full rounded-[18px] items-center justify-center ${
          isMonthly ? "bg-[#B954F5]" : "bg-transparent"
        }`}
      >
        <Text
          className={`text-lg font-bold ${
            isMonthly ? "text-white" : "text-[#6A6880]"
          }`}
        >
          Monthly
        </Text>
      </TouchableOpacity>

      {/* Yearly */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onChange("yearly")}
        className={`flex-1 h-full rounded-[18px] flex-row items-center justify-center gap-3 ${
          isYearly ? "bg-[#B954F5]" : "bg-transparent"
        }`}
      >
        <Text
          className={`text-lg font-bold ${
            isYearly ? "text-white" : "text-[#6A6880]"
          }`}
        >
          Yearly
        </Text>

        <View
          className={`px-3 py-1 rounded-full border ${
            isYearly
              ? "border-[#F2B84B] bg-white/10"
              : "border-[#2A2845] bg-transparent"
          }`}
        >
          <Text
            className={`text-sm font-extrabold ${
              isYearly ? "text-[#FFD84D]" : "text-[#6A6880]"
            }`}
          >
            SAVE 40%
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default BillingToggle;