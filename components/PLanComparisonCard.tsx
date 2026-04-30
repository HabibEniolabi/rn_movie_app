import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import React from "react";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";

type PlanVariant = "free" | "pro" | "ultra";

interface FeatureItem {
  label: string;
  available?: boolean;
  iconType?: "check" | "x" | "star";
  highlight?: string;
  trailingText?: string;
}

interface PlanComparisonCardProps {
  variant: PlanVariant;
  iconSource: ImageSourcePropType;
  title: string;
  subtitle: string;
  price: string;
  oldPrice?: string;
  period: string;
  badge?: string;
  features: FeatureItem[];
  buttonTitle: string;
  onPress: () => void;
}

const getVariantStyle = (variant: PlanVariant) => {
  if (variant === "ultra") {
    return {
      border: "border-[#6B5528]",
      title: "text-[#FFC857]",
      iconBg: "bg-[#342744]",
      button: "bg-[#B954F5]",
      buttonText: "text-white",
    };
  }

  if (variant === "pro") {
    return {
      border: "border-[#8B5CF6]",
      title: "text-[#F07DE0]",
      iconBg: "bg-[#342050]",
      button: "bg-[#B954F5]",
      buttonText: "text-white",
    };
  }

  return {
    border: "border-[#2A2845]",
    title: "text-white",
    iconBg: "bg-[#211F3A]",
    button: "bg-transparent border border-[#2A2845]",
    buttonText: "text-[#7F7B9D]",
  };
};

const HighlightText = ({
  label,
  highlight,
  trailingText,
}: {
  label: string;
  highlight?: string;
  trailingText?: string;
}) => {
  if (!highlight || !label.includes(highlight)) {
    return (
      <Text className="text-[#BDBAD8] text-[16px] flex-1 leading-6">
        {label}
        {trailingText ? (
          <Text className="text-[#9B59F5] font-bold"> {trailingText}</Text>
        ) : null}
      </Text>
    );
  }

  const [before, after] = label.split(highlight);

  return (
    <Text className="text-[#BDBAD8] text-[16px] flex-1 leading-6">
      {before}
      <Text className="text-[#EDEAF8] font-bold">{highlight}</Text>
      {after}
      {trailingText ? (
        <Text className="text-[#9B59F5] font-bold"> {trailingText}</Text>
      ) : null}
    </Text>
  );
};

const PlanComparisonCard = ({
  variant,
  iconSource,
  title,
  subtitle,
  price,
  oldPrice,
  period,
  badge,
  features,
  buttonTitle,
  onPress,
}: PlanComparisonCardProps) => {
  const styles = getVariantStyle(variant);
  const isFree = variant === "free";

  return (
    <View
      className={`rounded-[28px] border-2 ${styles.border} bg-[#141325] px-5 py-6`}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center flex-1">
          <View
            className={`w-[54px] h-[54px] rounded-[18px] items-center justify-center ${styles.iconBg}`}
          >
            <Image
              source={iconSource}
              className="w-11 h-11"
              resizeMode="contain"
            />
          </View>

          <View className="ml-4 flex-1">
            <Text className={`text-[18px] font-bold ${styles.title}`}>
              {title}
            </Text>

            <Text className="text-[#7F7B9D] text-[12px] mt-1 leading-6">
              {subtitle}
            </Text>
          </View>
        </View>

        <View className="items-end max-w-[155px]">
          {badge ? (
            <View className="bg-[#C44CE0] px-4 py-2 rounded-full mb-2">
              <Text className="text-white text-[12px] font-bold">
                {badge}
              </Text>
            </View>
          ) : null}

          {oldPrice ? (
            <Text
              className="text-[#6A6880] text-sm font-bold"
              style={{ textDecorationLine: "line-through" }}
            >
              {oldPrice}
            </Text>
          ) : null}

          <Text className="text-white text-[22px] font-bold">{price}</Text>

          <Text className="text-[#7F7B9D] text-[14px] text-right leading-5">
            {period}
          </Text>
        </View>
      </View>

      <View className="h-[1px] bg-[#2A2845] my-6" />

      <View className="gap-4">
        {features.map((feature, index) => {
          const iconType =
            feature.iconType || (feature.available === false ? "x" : "check");

          const isDisabled = iconType === "x";
          const isStar = iconType === "star";

          return (
            <View key={index} className="flex-row items-center">
              <View
                className={`w-9 h-9 rounded-full items-center justify-center ${
                  isStar
                    ? "bg-[#3A3029]"
                    : isDisabled
                      ? "bg-[#1F1D35]"
                      : "bg-[#153C3A]"
                }`}
              >
                {isStar ? (
                  <FontAwesome name="star" size={16} color="#FFD84D" />
                ) : (
                  <Feather
                    name={isDisabled ? "x" : "check"}
                    size={18}
                    color={isDisabled ? "#4F4B6A" : "#45E0B8"}
                  />
                )}
              </View>

              <View className="ml-4 flex-1">
                <HighlightText
                  label={feature.label}
                  highlight={feature.highlight}
                  trailingText={feature.trailingText}
                />
              </View>
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        className={`h-[58px] rounded-[18px] items-center justify-center mt-8 flex-row gap-3 ${styles.button}`}
      >
        <Text className={`text-lg font-bold ${styles.buttonText}`}>
          {buttonTitle}
        </Text>

        {!isFree ? (
          <View className="w-9 h-9 rounded-[12px] bg-white/20 items-center justify-center">
            <FontAwesome name="long-arrow-right" color="#ffffff" size={18} />
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

export default PlanComparisonCard;