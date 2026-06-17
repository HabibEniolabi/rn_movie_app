import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import Svg, { Text as SvgText } from "react-native-svg";
import { formatNumber } from "@/services/formatNumber";
import { useTranslation } from "react-i18next";
import { I18nManager } from "react-native";

const TrendingCard = ({
  movie: { movie_id, title, poster_url },
  index,
}: TrendingCardProps) => {
  const { i18n } = useTranslation();

  const rank = formatNumber(index + 1, i18n.language);
  const isRTL = I18nManager.isRTL;
  const isDoubleDigit = index + 1 >= 10;

  return (
    <Link href={`/movie/${movie_id}`} asChild>
      <TouchableOpacity activeOpacity={0.85} className="mr-8">
        <View className="relative w-[235px] h-[235px]">
          {/* Big outline rank behind poster */}
          <View
            className="absolute z-0"
            style={{
              bottom: 30,
              left: isRTL ? undefined : 0,
              right: isRTL ? 0 : undefined,
              width: isDoubleDigit ? 190 : 130,
              height: 140,
            }}
          >
            <Svg
              width={isDoubleDigit ? 190 : 130}
              height={145}
              viewBox={`0 0 ${isDoubleDigit ? 190 : 130} 145`}
            >
              <SvgText
                x={isDoubleDigit ? 95 : 65}
                y={112}
                textAnchor="middle"
                fontSize={isDoubleDigit ? 112 : 132}
                fontWeight="900"
                stroke="#FFFFFF"
                strokeWidth={2.5}
                fill="transparent"
              >
                {rank}
              </SvgText>
            </Svg>
          </View>

          {/* Poster stays the same size */}
          <View
            className="absolute top-0 z-10 w-32 h-48 rounded-lg overflow-hidden bg-dark-100"
            style={{
              left: isRTL ? 0 : 72,
              right: isRTL ? 72 : undefined,
            }}
          >
            <Image
              source={{ uri: poster_url }}
              className="w-32 h-48"
              resizeMode="cover"
            />

            {/* Optional red badge like Netflix */}
            {index < 2 && (
              <View className="absolute bottom-0 left-0 right-0 items-center">
                <View className="bg-red-600 px-3 py-1">
                  <Text className="text-white text-[11px] font-extrabold">
                    {index === 0 ? "New Episode" : "Recently Added"}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Title */}
          <Text
            className="absolute bottom-0 text-sm font-bold text-light-200"
            numberOfLines={1}
            style={{
              left: isRTL ? 0 : 72,
              right: isRTL ? 72 : 0,
              textAlign: isRTL ? "right" : "left",
              writingDirection: isRTL ? "rtl" : "ltr",
            }}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default TrendingCard;
