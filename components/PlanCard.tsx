import {
  View,
  Text,
  TouchableOpacity,
  ImageSourcePropType,
  Image,
} from "react-native";
import React from "react";
import Feather from "react-native-vector-icons/Feather";

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
      className={`rounded-[28px] birder px-5 py-5 relative overflow-hidden ${
        selected
          ? "border-[#8B5CF6] bg-[#1A102B]"
          : "border-[#2A2845] bg-[#141325]"
      }`}
      style={
        selected
          ? {
              shadowColor: "#8B5CF6",
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 10,
            }
          : undefined
      }
    >
      {/* Top badge */}
      {badge ? (
        <View className="absolute top-0 right-0 bg-[#E14ECF] px-5 py-3 rounded-bl-[24px]">
          <Text className="text-white text-[12px] font-bold uppercase">
            {badge}
          </Text>
        </View>
      ) : null}

      {/* Selector */}
      <View
        className={`absolute top-5 right-5 w-9 h-9 rounded-full border-2 items-center justify-center ${
          selected ? "border-[#C084FC]" : "border-[#4A476A]"
        }`}
      >
        {selected ? (
          <View className="w-5 h-5 rounded-full bg-[#C084FC]" />
        ) : null}
      </View>

      {/* Top content */}
      <View className="flex-row items-start justify-between pr-12">
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
            <Text className="text-white text-[26px] font-bold">{title}</Text>
            <Text className="text-[#7F7B9D] text-[14px] mt-1">{subtitle}</Text>
          </View>
        </View>

        <View className="items-end ml-3">
          <Text className="text-white text-[26px] font-bold">{price}</Text>
          <Text className="text-[#7F7B9D] text-[14px] mt-1">{period}</Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-[1px] bg-[#2A2845] my-6" />

      {/* Features */}
      <View className="gap-4">
        {features.map((feature, index) => (
          <View key={index} className="flex-row items-center gap-4">
            <View
              className={`w-9 h-9 rounded-full items-center justify-center ${
                feature.available ? "bg-[#153C3A]" : "bg-[#1F1D35]"
              }`}
            >
              <Feather
                name={feature.available ? "check" : "x"}
                size={18}
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
