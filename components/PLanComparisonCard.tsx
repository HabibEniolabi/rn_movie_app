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
import { LinearGradient } from "expo-linear-gradient";

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
      borderColors: ["#C8A94A", "#8B5CF6"] as const,
      title: "#FFC857",
      iconBg: "#2D2541",
      iconCircleBg: "#342D2B",
      iconColor: "#FFD84D",
      buttonColors: ["#F6C85F", "#E653B8", "#9B4DFF"] as const,
      badgeColors: ["#E14ECF", "#9B4DFF"] as const,
    };
  }

  if (variant === "pro") {
    return {
      borderColors: ["#D946C4", "#8B5CF6"] as const,
      title: "#F07DE0",
      iconBg: "#342050",
      iconCircleBg: "#153C3A",
      iconColor: "#45E0B8",
      buttonColors: ["#D946C4", "#9B4DFF"] as const,
      badgeColors: ["#D946C4", "#9B4DFF"] as const,
    };
  }

  return {
    borderColors: ["#2A2845", "#2A2845"] as const,
    title: "#FFFFFF",
    iconBg: "#211F3A",
    iconCircleBg: "#153C3A",
    iconColor: "#45E0B8",
    buttonColors: ["#141325", "#141325"] as const,
    badgeColors: ["#2A2845", "#2A2845"] as const,
  };
};

const PriceText = ({ price }: { price: string }) => {
  const match = price.match(/^(\$?)(\d+)(\.\d+)$/);

  if (!match) {
    return (
      <Text className="text-white text-[32px] font-extrabold">{price}</Text>
    );
  }

  const [, currency, amount, cents] = match;

  return (
    <View className="flex-row items-start justify-end">
      <Text className="text-white text-[15px] font-bold mt-[4px]">
        {currency}
      </Text>

      <Text className="text-white text-[40px] font-extrabold leading-[42px]">
        {amount}
      </Text>

      <Text className="text-white text-[20px] font-extrabold mt-[15px]">
        {cents}
      </Text>
    </View>
  );
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
      <Text className="text-[#A9A6C2] text-[15px] leading-[22px] flex-1">
        {label}
        {trailingText ? (
          <Text className="text-[#C778FF] font-extrabold"> {trailingText}</Text>
        ) : null}
      </Text>
    );
  }

  const [before, after] = label.split(highlight);

  return (
    <Text className="text-[#A9A6C2] text-[15px] leading-[22px] flex-1">
      {before}
      <Text className="text-[#EDEAF8] font-extrabold">{highlight}</Text>
      {after}
      {trailingText ? (
        <Text className="text-[#C778FF] font-extrabold"> {trailingText}</Text>
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
  const isUltra = variant === "ultra";

  return (
    <LinearGradient
      colors={styles.borderColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 30,
        padding: 2,
      }}
    >
      <View className="rounded-[28px] bg-[#111022] px-5 py-6 overflow-hidden">
        {/* Badge */}
        {badge ? (
          <LinearGradient
            colors={styles.badgeColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              position: "absolute",
              top: 24,
              right: 20,
              borderRadius: 999,
              paddingHorizontal: 18,
              paddingVertical: 7,
              zIndex: 2,
            }}
          >
            <Text className="text-white text-[12px] font-extrabold uppercase tracking-[1.5px]">
              {badge}
            </Text>
          </LinearGradient>
        ) : null}

        {/* Header */}
        <View className="flex-row items-start">
          <View className="flex-row items-start flex-1 min-w-0 pr-2">
            <View
              className="w-[68px] h-[68px] rounded-[22px] items-center justify-center"
              style={{ backgroundColor: styles.iconBg }}
            >
              <Image
                source={iconSource}
                className="w-[44px] h-[44px]"
                resizeMode="contain"
              />
            </View>

            <View className="ml-4 flex-1 min-w-0">
              <Text
                className="text-[20px] font-extrabold"
                style={{ color: styles.title }}
                numberOfLines={1}
              >
                {title}
              </Text>

              <Text
                className="text-[#7F7B9D] text-[14px] mt-1 leading-[20px]"
                numberOfLines={2}
              >
                {subtitle}
              </Text>
            </View>
          </View>

          <View
            className="items-end"
            style={{
              width: 118,
              paddingTop: badge ? 38 : 0,
            }}
          >
            {oldPrice ? (
              <Text
                className="text-[#5F5C77] text-[12px] font-bold"
                style={{ textDecorationLine: "line-through" }}
              >
                {oldPrice}
              </Text>
            ) : null}

            <PriceText price={price} />

            <Text className="text-[#7F7B9D] text-[13px] text-right leading-[18px]">
              {period}
            </Text>
          </View>
        </View>

        <View className="h-[1px] bg-[#2A2845] my-6" />

        {/* Features */}
        <View className="gap-4">
          {features.map((feature, index) => {
            const iconType =
              feature.iconType || (feature.available === false ? "x" : "check");

            const isDisabled = iconType === "x";
            const isStar = iconType === "star" || isUltra;

            return (
              <View key={index} className="flex-row items-center">
                <View
                  className="w-[38px] h-[38px] rounded-full items-center justify-center"
                  style={{
                    backgroundColor: isStar
                      ? "#342D2B"
                      : isDisabled
                        ? "#1F1D35"
                        : styles.iconCircleBg,
                  }}
                >
                  {isStar ? (
                    <FontAwesome name="star" size={17} color="#FFD84D" />
                  ) : (
                    <Feather
                      name={isDisabled ? "x" : "check"}
                      size={20}
                      color={isDisabled ? "#4F4B6A" : styles.iconColor}
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

        {/* CTA */}
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.88}
          className="mt-8 rounded-[20px] overflow-hidden"
        >
          <LinearGradient
            colors={styles.buttonColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 58,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <Text
              className={`text-[16px] font-extrabold ${
                isFree ? "text-[#7F7B9D]" : "text-white"
              }`}
            >
              {buttonTitle}
            </Text>

            {!isFree ? (
              <View className="ml-3 w-[34px] h-[34px] rounded-[12px] bg-white/15 items-center justify-center">
                <FontAwesome name="long-arrow-right" color="#ffffff" size={18} />
              </View>
            ) : null}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default PlanComparisonCard;