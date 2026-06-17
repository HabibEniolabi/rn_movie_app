import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import type { HomeMediaItem } from "@/services/homeSections";

type HomeMediaCardProps = {
  item: HomeMediaItem;
  onPress: () => void;
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

const HomeMediaCard = ({ item, onPress }: HomeMediaCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="w-[145px] mr-4"
    >
      <View className="w-[145px] h-[215px] rounded-xl overflow-hidden bg-dark-100">
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
        >
          <Text className="text-white text-sm font-extrabold" numberOfLines={2}>
            {item.title}
          </Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

export default HomeMediaCard;