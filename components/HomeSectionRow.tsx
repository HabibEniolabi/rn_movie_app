import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import HomeMediaCard from "./HomeMediaCard";
import TrendingCard from "./TrendingCard";
import type { HomeSection } from "../services/homeSections";

type HomeSectionRowProps = {
  section: HomeSection;
};

const HomeSectionRow = ({ section }: HomeSectionRowProps) => {
  const { t } = useTranslation();

  const handlePressItem = (item: any) => {
    if (item.mediaType === "movie") {
      router.push({
        pathname: "/movie/[id]" as const,
        params: {
          id: String(item.id),
        },
      });

      return;
    }

    // Later you can create /show/[id]
    router.push({
      pathname: "/movie/[id]" as const,
      params: {
        id: String(item.id),
      },
    });
  };

  return (
    <View className="mt-8">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-white text-[20px] font-extrabold">
          {t(section.titleKey)}
        </Text>

        <TouchableOpacity
          onPress={() => {
            console.log("See all:", section.id);
          }}
        >
          <Text className="text-[#AB8BFF] font-bold">
            {t("home.seeAll", { defaultValue: "See all" })}
          </Text>
        </TouchableOpacity>
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
                poster_url: `https://image.tmdb.org/t/p/w500${item.posterPath}`,
              }}
              index={index}
            />
          ) : (
            <HomeMediaCard item={item} onPress={() => handlePressItem(item)} />
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