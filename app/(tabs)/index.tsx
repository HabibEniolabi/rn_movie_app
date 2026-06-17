import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "react-native-vector-icons/Feather";
import Fontisto from "react-native-vector-icons/Fontisto";
import HomeSectionRow from "@/components/HomeSectionRow";
import { getMyListMovies } from "@/services/appwrite";
import { fetchHomeSections, type HomeSection } from "@/services/homeSections";

const getPosterUrl = (posterPath?: string | null) => {
  if (!posterPath) {
    return "https://placehold.co/600x900/1a1a1a/ffffff.png";
  }

  if (posterPath.startsWith("http")) {
    return posterPath;
  }

  return `https://image.tmdb.org/t/p/w500${posterPath}`;
};

export default function Index() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();

  const [selectedChip, setSelectedChip] = useState("movies");

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
    refetch: refetchTrendingMovies,
  } = useFetch(getTrendingMovies);

  const {
    data: homeSections,
    loading: sectionsLoading,
    error: sectionsError,
    refetch: refetchHomeSections,
  } = useFetch(fetchHomeSections);

  const {
    data: myListMovies,
    loading: myListLoading,
    error: myListError,
    refetch: refetchMyList,
  } = useFetch(getMyListMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies,
  } = useFetch(() => fetchMovies({ query: "" }));

  useEffect(() => {
    refetchTrendingMovies();
    refetchMovies();
    refetchHomeSections();
    refetchMyList();
  }, [i18n.language]);

  /**
   * heroMovie comes from your fetched movies list.
   * It selects one movie with a poster/backdrop and displays it as the big top card.
   */
  const heroMovie = useMemo(() => {
    if (!movies?.length) return null;

    return (
      movies.find((movie: any) => movie.poster_path && movie.backdrop_path) ||
      movies.find((movie: any) => movie.poster_path) ||
      movies[0]
    );
  }, [movies]);

  const finalHomeSections = useMemo(() => {
    const sections: HomeSection[] = [];

    if (myListMovies?.length) {
      sections.push({
        id: "my_list",
        titleKey: "home.myList",
        type: "movie",
        items: myListMovies,
        variant: "normal",
        showSeeAll: true,
      });
    }

    if (homeSections?.length) {
      sections.push(...homeSections);
    }

    return sections;
  }, [myListMovies, homeSections]);

  const categoryChips = [
    {
      id: "shows",
      label: t("home.shows", { defaultValue: "Shows" }),
    },
    {
      id: "movies",
      label: t("home.movies", { defaultValue: "Movies" }),
    },
    {
      id: "comedies",
      label: t("home.comedies", { defaultValue: "Comedies" }),
    },
    {
      id: "new_hot",
      label: t("home.newAndHot", { defaultValue: "New & Hot" }),
    },
  ];

  const isLoading =
    moviesLoading || trendingLoading || sectionsLoading || myListLoading;

  const hasError = moviesError || trendingError || sectionsError || myListError;

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute z-0 w-full" />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingTop: 60,
          paddingBottom: tabBarHeight + 40,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image source={icons.logo} className="w-12 h-10" />

            <Text className="text-white text-[28px] font-extrabold ml-3">
              {t("home.title", { defaultValue: "Home" })}
            </Text>
          </View>

          <View className="flex-row items-center gap-3">
            {/* Search button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/search")}
              className="w-11 h-11 rounded-full bg-white/10 items-center justify-center"
            >
              <Feather name="search" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Notification button */}
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-11 h-11 rounded-full bg-white/10 items-center justify-center relative"
            >
              <Fontisto name="bell" size={23} color="#fff" />

              <View className="absolute -top-1 -right-1 min-w-[20px] h-[20px] rounded-full bg-red-600 items-center justify-center px-1">
                <Text className="text-white text-[11px] font-extrabold">7</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-6"
          contentContainerStyle={{
            gap: 10,
            paddingRight: 20,
          }}
        >
          {categoryChips.map((chip) => {
            const isActive = selectedChip === chip.id;

            return (
              <TouchableOpacity
                key={chip.id}
                activeOpacity={0.85}
                onPress={() => setSelectedChip(chip.id)}
                className={`px-6 py-4 rounded-2xl border ${
                  isActive
                    ? "bg-white/25 border-white/35"
                    : "bg-white/10 border-white/15"
                }`}
              >
                <Text className="text-white font-bold text-base">
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#AB8BFF"
            className="mt-20 self-center"
          />
        ) : hasError ? (
          <Text className="text-dark-500 mt-10">
            {t("common.error")}:{" "}
            {moviesError?.message ||
              trendingError?.message ||
              t("errors.failedToLoadMovies")}
          </Text>
        ) : (
          <View className="flex-1 mt-6">
            {heroMovie && (
              <View className="w-full h-[520px] rounded-[26px] overflow-hidden bg-dark-100 border border-white/15">
                <Image
                  source={{
                    uri: getPosterUrl(heroMovie.poster_path),
                  }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={[
                    "rgba(0,0,0,0)",
                    "rgba(0,0,0,0.25)",
                    "rgba(0,0,0,0.85)",
                    "#030014",
                  ]}
                  locations={[0, 0.45, 0.78, 1]}
                  pointerEvents="box-none"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    justifyContent: "flex-end",
                    paddingHorizontal: 24,
                    paddingBottom: 28,
                    zIndex: 20,
                  }}
                >
                  <Text
                    className="text-white text-[38px] font-extrabold text-center"
                    numberOfLines={2}
                  >
                    {heroMovie.title || heroMovie.original_title}
                  </Text>

                  <Text
                    className="text-light-200 text-sm text-center mt-3"
                    numberOfLines={1}
                  >
                    {t("home.heroTags", {
                      defaultValue: "Trending • Popular • New on MovieFlix",
                    })}
                  </Text>

                  <View className="flex-row gap-4 mt-6">
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() =>
                        router.push({
                          pathname: "/media/[id]" as const,
                          params: {
                            id: String(heroMovie.id),
                            title: heroMovie.title || heroMovie.original_title,
                          },
                        })
                      }
                      className="flex-1 h-[56px] rounded-md bg-white flex-row items-center justify-center"
                      style={{
                        zIndex: 30,
                        elevation: 30,
                      }}
                    >
                      <Feather name="play" size={28} color="#000" />

                      <Text className="text-black text-lg font-extrabold ml-2">
                        {t("movie.playMovie", { defaultValue: "Play" })}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => router.push("/(tabs)/saved")}
                      className="flex-1 h-[56px] rounded-md bg-white/25 flex-row items-center justify-center"
                      style={{
                        zIndex: 30,
                        elevation: 30,
                      }}
                    >
                      <Feather name="plus" size={30} color="#fff" />

                      <Text className="text-white text-lg font-extrabold ml-2">
                        {t("home.myList", { defaultValue: "My List" })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            )}
            {finalHomeSections.map((section) => (
              <HomeSectionRow key={section.id} section={section} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
