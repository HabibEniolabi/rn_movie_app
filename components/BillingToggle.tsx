import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type BillingType = "monthly" | "yearly";

interface BillingToggleProps {
  value: BillingType;
  onChange: (value: BillingType) => void;
}

const BillingToggle = ({ value, onChange }: BillingToggleProps) => {
  const isYearly = value === "yearly";
  const isMonthly = value === "monthly";

  const ActiveBg = ({ children }: { children: React.ReactNode }) => (
    <LinearGradient
      colors={["#E14ECF", "#9B4DFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        flex: 1,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </LinearGradient>
  );

  return (
    <View className="h-[64px] rounded-[24px] border border-[#2A2845] bg-[#141325] p-2 flex-row items-center">
      {/* Monthly */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onChange("monthly")}
        className="flex-1 h-full rounded-[18px] overflow-hidden"
      >
        {isMonthly ? (
          <ActiveBg>
            <Text className="text-lg font-bold text-white">Monthly</Text>
          </ActiveBg>
        ) : (
          <View className="flex-1 items-center justify-center rounded-[18px]">
            <Text className="text-lg font-bold text-[#6A6880]">Monthly</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Yearly */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onChange("yearly")}
        className="flex-1 h-full rounded-[18px] overflow-hidden"
      >
        {isYearly ? (
          <ActiveBg>
            <View className="flex-row items-center justify-center gap-3">
              <Text className="text-lg font-bold text-white">Yearly</Text>

              <View className="px-3 py-1 rounded-full border border-[#F2B84B] bg-white/10">
                <Text className="text-sm font-extrabold text-[#FFD84D]">
                  SAVE 40%
                </Text>
              </View>
            </View>
          </ActiveBg>
        ) : (
          <View className="flex-1 flex-row items-center justify-center gap-3 rounded-[18px]">
            <Text className="text-lg font-bold text-[#6A6880]">Yearly</Text>

            <View className="px-3 py-1 rounded-full border border-[#2A2845] bg-transparent">
              <Text className="text-sm font-extrabold text-[#6A6880]">
                SAVE 40%
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default BillingToggle;
