import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import HomeMediaCard from "./HomeMediaCard";
import TrendingCard from "./TrendingCard";
import type { HomeMediaItem, HomeSection } from "../services/homeSections";

type HomeSectionRowProps = {
  section: HomeSection;
};

const HomeSectionRow = ({ section }: HomeSectionRowProps) => {
  const { t } = useTranslation();

  const handlePressItem = (item: HomeMediaItem) => {
    if (item.mediaType === "movie") {
      router.push({
        pathname: "/movie/[id]" as const,
        params: {
          id: String(item.id),
        },
      });

      return;
    }

    router.push({
      pathname: "/show/[id]" as const,
      params: { id: String(item.id)}
    })
  };

  const handleSeeAll = () => {
    if (section.id !== "my_list"){
      router.push("/(tabs)/saved")
    }
  };

  return (
    <View className="mt-8">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-white text-[20px] font-extrabold">
          {section.title || t(section.titleKey, section.titleParams)}
        </Text>

        {section.showSeeAll && section.id === "my_list" && (
          <TouchableOpacity activeOpacity={0.8} onPress={handleSeeAll}>
            <Text className="text-[#AB8BFF] font-bold">
              {t("home.seeAll", { defaultValue: "See all" })}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={section.items}
        keyExtractor={(item) => `${section.id}-${item.id}`}
        renderItem={({ item, index }) =>
          section.variant === "top10" ? (
            <TrendingCard
              movie={{
                movie_id: item.id,
                title: item.title,
                mediaType: item.mediaType,
                poster_url: item.posterPath?.startsWith("http")
                  ? item.posterPath
                  : `https://image.tmdb.org/t/p/w500${item.posterPath}`,
              }}
              index={index}
            />
          ) : (
            <HomeMediaCard
              item={item}
              variant={section.variant === "large" ? "large" : "normal"}
              onPress={() => handlePressItem(item)}
            />
          )
        }
        contentContainerStyle={{
          paddingRight: 20,
        }}
      />
    </View>
  );
};

export default HomeSectionRow;
