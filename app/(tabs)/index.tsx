// import SearchBar from "@/components/SearchBar";
// import { icons } from "@/constants/icons";
// import { images } from "@/constants/images";
// import {
//   ActivityIndicator,
//   Image,
//   ScrollView,
//   View,
//   Text,
//   FlatList,
// } from "react-native";
// import { useRouter } from "expo-router";
// import useFetch from "@/services/useFetch";
// import { fetchMovies } from "@/services/api";
// import MovieCard from "@/components/MovieCard";
// import { getTrendingMovies } from "@/services/appwrite";
// import TrendingCard from "@/components/TrendingCard";
// import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
// import { useTranslation } from "react-i18next";
// import { useEffect } from "react";

// export default function Index() {
//   const { t, i18n } = useTranslation();
//   const router = useRouter();
//   const tabBarHeight = useBottomTabBarHeight();

//   const {
//     data: trendingMovies,
//     loading: trendingLoading,
//     error: trendingError,
//     refetch: refetchTrendingMovies,
//   } = useFetch(getTrendingMovies);

//   const {
//     data: movies,
//     loading: moviesLoading,
//     error: moviesError,
//     refetch: refetchMovies,
//   } = useFetch(() => fetchMovies({ query: "" }));

//   useEffect(() => {
//     refetchTrendingMovies();
//     refetchMovies()
//   }, [i18n.language]);

//   return (
//     <View className="flex-1 bg-primary">
//       <Image source={images.bg} className="absolute z-0 w-full" />
//       <ScrollView
//         className="flex-1 px-5"
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           minHeight: "100%",
//           paddingBlock: 10,
//           paddingBottom: tabBarHeight + 40,
//         }}
//       >
//         <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
//         {moviesLoading || trendingLoading ? (
//           <ActivityIndicator
//             size="large"
//             color="#0000ff"
//             className="mt-10 self-center"
//           />
//         ) : moviesError || trendingError ? (
//           <Text className="text-dark-500">
//             {t("common.error")}:{" "}
//             {moviesError?.message ||
//               trendingError?.message ||
//               t("errors.failedToLoadMovies")}
//           </Text>
//         ) : (
//           <View className="flex-1 mt-5">
//             <SearchBar
//               onPress={() => router.push("/search")}
//               placeholder={t("home.searchMovies")}
//             />
//             {trendingMovies && (
//               <View className="mt-10">
//                 <Text className="text-lg text-white font-bold mt-5 mb-3">
//                   {t("home.trendingMovies")}
//                 </Text>
//                 <FlatList
//                   className="mb-4 mt-3"
//                   horizontal
//                   showsHorizontalScrollIndicator={false}
//                   ItemSeparatorComponent={() => <View className="w-4" />}
//                   data={trendingMovies}
//                   renderItem={({ item, index }) => (
//                     <TrendingCard movie={item} index={index} />
//                   )}
//                   keyExtractor={(item) => item.movie_id.toString()}
//                 />
//               </View>
//             )}

//             <>
//               <Text className="text-lg text-white font-bold mt-5 mb-3">
//                 {t("home.latestMovies")}
//               </Text>
//               <FlatList
//                 data={movies}
//                 renderItem={({ item }) => <MovieCard {...item} />}
//                 keyExtractor={(item) => item.id.toString()}
//                 numColumns={3}
//                 columnWrapperStyle={{
//                   justifyContent: "flex-start",
//                   gap: 20,
//                   paddingRight: 5,
//                   marginBottom: 10,
//                 }}
//                 className="mt-2 pd-32"
//                 scrollEnabled={false}
//               />
//             </>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

import SearchBar from "@/components/SearchBar";
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
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies,
  } = useFetch(() => fetchMovies({ query: "" }));

  useEffect(() => {
    refetchTrendingMovies();
    refetchMovies();
  }, [i18n.language]);

  const heroMovie = useMemo(() => {
    if (!movies?.length) return null;

    const movieWithPoster =
      movies.find((movie: any) => movie.poster_path && movie.backdrop_path) ||
      movies.find((movie: any) => movie.poster_path) ||
      movies[0];

    return movieWithPoster;
  }, [movies]);

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

  const isLoading = moviesLoading || trendingLoading;
  const hasError = moviesError || trendingError;

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

          {/* Search button instead of download button */}
          <View className="flex gap-[5px]">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/search")}
            // className="w-11 h-11 rounded-full items-center justify-center"
          >
            <Feather name="search" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/")}
            // className="w-11 h-11 rounded-full items-center justify-center"
          >
            <Feather name="search" size={24} color="#fff" />
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
            {/* Hero card */}
            {heroMovie && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  router.push({
                    pathname: "/movie/[id]" as const,
                    params: {
                      id: String(heroMovie.id),
                    },
                  })
                }
                className="w-full h-[520px] rounded-[26px] overflow-hidden bg-dark-100 border border-white/15"
              >
                <Image
                  source={{
                    uri: getPosterUrl(heroMovie.poster_path),
                  }}
                  className="w-full h-full"
                  resizeMode="cover"
                />

                <LinearGradient
                  colors={[
                    "rgba(0,0,0,0.05)",
                    "rgba(0,0,0,0.35)",
                    "rgba(0,0,0,0.95)",
                  ]}
                  locations={[0, 0.55, 1]}
                  className="absolute inset-0 justify-end px-6 pb-7"
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
                      defaultValue:
                        "Trending • Popular • New on MovieFlix",
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
                    >
                      <Feather name="play" size={28} color="#000" />

                      <Text className="text-black text-lg font-extrabold ml-2">
                        {t("movie.playMovie", { defaultValue: "Play" })}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      className="flex-1 h-[56px] rounded-md bg-white/25 flex-row items-center justify-center"
                    >
                      <Feather name="plus" size={30} color="#fff" />

                      <Text className="text-white text-lg font-extrabold ml-2">
                        {t("home.myList", { defaultValue: "My List" })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Search bar still available below hero */}
            {/* <View className="mt-8">
              <SearchBar
                onPress={() => router.push("/search")}
                placeholder={t("home.searchMovies")}
              />
            </View> */}

            {/* Trending */}
            {trendingMovies && (
              <View className="mt-8">
                <Text className="text-lg text-white font-bold mt-5 mb-3">
                  {t("home.trendingMovies")}
                </Text>

                <FlatList
                  className="mb-4 mt-3"
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={trendingMovies}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                  contentContainerStyle={{
                    paddingRight: 20,
                  }}
                />
              </View>
            )}

            {/* Latest Movies */}
            <View className="mt-4">
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                {t("home.latestMovies")}
              </Text>

              <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2"
                scrollEnabled={false}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}