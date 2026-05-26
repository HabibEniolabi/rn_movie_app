import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import MaskedView from "@react-native-masked-view/masked-view";
import { images } from "@/constants/images";
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

  return (
    <Link href={`/movie/${movie_id}`} asChild>
      <TouchableOpacity
        className="w-32 relative"
        style={{
          paddingLeft: isRTL ? 0 : 20,
          paddingRight: isRTL ? 20 : 0,
        }}
      >
        <Image
          source={{ uri: poster_url }}
          className="w-32 h-48 rounded-lg"
          resizeMode="cover"
        />

        <View
          className="absolute bottom-9 px-2 py-1 rounded-full"
          style={{
            left: isRTL ? undefined : -14,
            right: isRTL ? -14 : undefined,
          }}
        >
          <MaskedView
            maskElement={
              <Text
                className="font-bold text-white text-6xl"
                style={{
                  writingDirection: isRTL ? "rtl" : "ltr",
                  textAlign: "center",
                }}
              >
                {rank}
              </Text>
            }
          >
            <Image
              source={images.rankingGradient}
              className="w-20 h-16"
              resizeMode="cover"
            />
          </MaskedView>
        </View>

        <Text
          className="text-sm font-bold text-light-200 mt-2"
          numberOfLines={1}
          style={{
            textAlign: isRTL ? "right" : "left",
            writingDirection: isRTL ? "rtl" : "ltr",
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default TrendingCard;
