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

    Alert.alert("TV show details coming soon");
  };

  const handleSeeAll = () => {
    if (section.id !== "my_list") return;

    // Later you can create /my-list screen.
    Alert.alert(
      t("home.myList", { defaultValue: "My List" }),
      t("home.myListSeeAllComingSoon", {
        defaultValue: "Full My List screen is coming soon.",
      })
    );
  };

  return (
    <View className="mt-8">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-white text-[20px] font-extrabold">
          {t(section.titleKey)}
        </Text>

        {section.showSeeAll && (
          <TouchableOpacity onPress={handleSeeAll}>
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
