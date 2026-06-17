import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import type { HomeMediaItem } from "@/services/homeSections";

type HomeMediaCardProps = {
  item: HomeMediaItem;
  onPress: () => void;
  variant: "normal" | "large";
};

const getPosterUrl = (posterPath?: string | null) => {
  if (!posterPath) {
    return "https://placehold.co/500x750/1a1a1a/ffffff.png";
  }

  if (posterPath.startsWith("http")) {
    return posterPath;
  }

  return `https://image.tmdb.org/t/p/w500${posterPath}`;
};

const HomeMediaCard = ({
  item,
  onPress,
  variant = "normal",
}: HomeMediaCardProps) => {
  const isLarge = variant === "large";
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className={isLarge ? "w-[185px] mr-4" : "w-[145px] mr-4"}
    >
      <View
        className={`rounded-xl overflow-hidden bg-dark-100 ${
          isLarge ? "w-[185px] h-[265px]" : "w-[145px] h-[215px]"
        }`}
      >
        <Image
          source={{
            uri: getPosterUrl(item.posterPath),
          }}
          className="w-full h-full"
          resizeMode="cover"
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.92)"]}
          className="absolute bottom-0 left-0 right-0 h-[95px] justify-end px-3 pb-3"
          style={{
            height: isLarge ? 115 : 95,
          }}
        >
          {isLarge && (
            <View className="self-start bg-[#AB8BFF] px-2 py-1 rounded mb-2">
              <Text className="text-white text-[10px] font-extrabold">
                MOVIEFLIX
              </Text>
            </View>
          )}

          <Text
            className={`text-white font-extrabold ${
              isLarge ? "text-base" : "text-sm"
            }`}
            numberOfLines={2}
          >
            {item.title}
          </Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

export default HomeMediaCard;
