import {
  View,
  Text,
  TouchableOpacity,
  ImageSourcePropType,
  Image,
} from "react-native";
import React from "react";
import Feather from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";

interface FeatureItem {
  label: string;
  available: boolean;
}

interface PlanCardProps {
  iconSource: ImageSourcePropType;
  title: string;
  subtitle: string;
  price: string;
  period: string;
  features: FeatureItem[];
  selected?: boolean;
  badge?: string;
  onPress?: () => void;
}

const PlanCard = ({
  iconSource,
  title,
  subtitle,
  price,
  period,
  features,
  selected = false,
  badge,
  onPress,
}: PlanCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className={`rounded-[28px] border px-5 py-5 relative overflow-hidden ${
        selected
          ? "border-[#8B5CF6] bg-[#1A102B]"
          : "border-[#2A2845] bg-[#141325]"
      }`}
    >
      {/* Top badge */}
      {badge ? (
        <View
          className="absolute top-0 right-0 overflow-hidden"
          style={{
            borderBottomLeftRadius: 24,
          }}
        >
          <LinearGradient
            colors={["#D946C4", "#9B4DFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              paddingHorizontal: 28,
              paddingVertical: 8,
            }}
          >
            <Text className="text-white text-[12px] font-bold uppercase tracking-wide">
              {badge}
            </Text>
          </LinearGradient>
        </View>
      ) : null}

      {/* Selector */}
      <View
        className={`absolute right-5 ${
          badge ? "top-[30px]" : "top-8"
        } w-[22px] h-[22px] items-center justify-center ${
          selected ? "" : "border-2 border-[#4F517A]"
        }`}
        style={{
          borderRadius: 999,
          overflow: "hidden",
          zIndex: 999,
          elevation: 999,

          borderWidth: selected ? 0 : 2,
          borderColor: selected ? "transparent" : "#4F517A",
        }}
      >
        {selected ? (
          <LinearGradient
            colors={["#D946C4", "#9B4DFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 22,
              height: 22,
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View className="w-3 h-3 rounded-full bg-white" />
          </LinearGradient>
        ) : null}
      </View>

      {/* Top content */}
      <View className="flex-row items-start justify-between mt-3">
        <View className="flex-row items-center gap-4 flex-1">
          <View
            className={`w-[54px] h-[54px] rounded-[12px] items-center justify-center ${
              selected ? "bg-[#3A215E]" : "bg-[#211F3A]"
            }`}
          >
            <Image
              source={iconSource}
              className="w-10 h-15"
              resizeMode="contain"
            />
          </View>

          <View className="flex-1">
            <Text className="text-white text-[22px] font-bold">{title}</Text>
            <Text className="text-[#7F7B9D] text-[12px] mt-1">{subtitle}</Text>
          </View>
        </View>

        <View className="items-start ml-3">
          <Text className="text-white text-[26px] font-bold">{price}</Text>
          <Text className="text-[#7F7B9D] text-[12px] mt-1">{period}</Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-[1px] bg-[#2A2845] my-6" />

      {/* Features */}
      <View className="gap-3">
        {features.map((feature, index) => (
          <View key={index} className="flex-row items-center gap-4">
            <View
              className={`w-7 h-7 rounded-full items-center justify-center ${
                feature.available ? "bg-[#153C3A]" : "bg-[#1F1D35]"
              }`}
            >
              <Feather
                name={feature.available ? "check" : "x"}
                size={16}
                color={feature.available ? "#45E0B8" : "#4F4B6A"}
              />
            </View>

            <Text
              className={`text-[16px] ${
                feature.available ? "text-[#EAE7FF]" : "text-[#7F7B9D]"
              }`}
            >
              {feature.label}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

export default PlanCard;
