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
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import MyListToast from "@/components/MyListToast";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "react-native-vector-icons/Feather";
import HomeSectionRow from "@/components/HomeSectionRow";
import { getMyListMovies } from "@/services/appwrite";
import { fetchHomeSections, type HomeSection } from "@/services/homeSections";
import NotificationBell from "@/components/NotificationBell";
import {
  getContentNotifications,
  type ContentNotification,
} from "@/services/appwrite";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { subscribeToMyListChanges } from "@/services/appwrite";
import {
  saveFavorite,
  removeFavorite,
  getExistingFavorite,
} from "@/services/appwrite";

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
  const [authUserId, setAuthUserId] = useState(
    FIREBASE_AUTH.currentUser?.uid || null
  );

  const [heroFavorite, setHeroFavorite] = useState<any | null>(null);
  const [heroMyListLoading, setHeroMyListLoading] = useState(false);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"added" | "removed">("added");

  const isHeroSaved = !!heroFavorite;

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

  const { data: notifications, refetch: refetchNotifications } = useFetch(
    getContentNotifications
  );

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
    refetchNotifications();
  }, [i18n.language]);

  /**
   * heroMovie comes from your fetched movies list.
   * It selects one movie with a poster/backdrop and displays it as the big top card.
   */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setAuthUserId(user?.uid || null);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authUserId) return;

    console.log("✅ Subscribing to My List realtime:", authUserId);

    const unsubscribe = subscribeToMyListChanges(authUserId, () => {
      refetchMyList();
    });

    return () => {
      console.log("🛑 Unsubscribing from My List realtime");
      unsubscribe();
    };
  }, [authUserId]);

  const getHeroShuffleSlot = () => {
    const now = new Date();

    const day = now.toISOString().split("T")[0];

    // 6 changes per day = every 4 hours
    const slot = Math.floor(now.getHours() / 4);

    return `${day}-${slot}`;
  };

  const getSeedNumber = (value: string) => {
    let hash = 0;

    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }

    return Math.abs(hash);
  };

  const heroMovie = useMemo(() => {
    const allSectionItems =
      homeSections?.flatMap((section) => section.items) || [];

    const validItems = allSectionItems.filter(
      (item) =>
        item.posterPath && item.backdropPath && item.mediaType === "movie"
    );

    if (!validItems.length) {
      if (!movies?.length) return null;

      return (
        movies.find((movie: any) => movie.poster_path && movie.backdrop_path) ||
        movies.find((movie: any) => movie.poster_path) ||
        movies[0]
      );
    }

    const slot = getHeroShuffleSlot();
    const seed = getSeedNumber(slot);
    const index = seed % validItems.length;

    const selected = validItems[index];

    return {
      id: selected.id,
      title: selected.title,
      original_title: selected.title,
      poster_path: selected.posterPath,
      backdrop_path: selected.backdropPath,
      overview: selected.overview,
    };
  }, [homeSections, movies]);

  useEffect(() => {
    let isMounted = true;

    const checkHeroFavorite = async () => {
      if (!heroMovie?.id) {
        setHeroFavorite(null);
        return;
      }

      try {
        const favorite = await getExistingFavorite(String(heroMovie.id));

        if (isMounted) {
          setHeroFavorite(favorite || null);
        }
      } catch (error) {
        console.log("Check hero favorite error:", error);

        if (isMounted) {
          setHeroFavorite(null);
        }
      }
    };

    checkHeroFavorite();

    return () => {
      isMounted = false;
    };
  }, [heroMovie?.id]);

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

  const handleToggleHeroMyList = async () => {
    if (!heroMovie || heroMyListLoading) return;

    setHeroMyListLoading(true);

    try {
      if (isHeroSaved && heroFavorite) {
        await removeFavorite(heroFavorite.$id);

        setHeroFavorite(null);
        setToastType("removed");
        setToastMessage("Removed from My List");
        setToastVisible(true);

        refetchMyList?.();

        return;
      }

      const savedFavorite = await saveFavorite({
        id: heroMovie.id,
        title: heroMovie.title || heroMovie.original_title || "Untitled",
        poster_path: heroMovie.poster_path,
        backdrop_path: heroMovie.backdrop_path,
        release_date: heroMovie.release_date || "",
        vote_average: heroMovie.vote_average || 0,
        overview: heroMovie.overview || "",
        vote_count: heroMovie.vote_count || 0,
        genres: heroMovie.genres || [],
        mediaType: "movie",
      });

      setHeroFavorite(savedFavorite);
      setToastType("added");
      setToastMessage("Added to My List");
      setToastVisible(true);

      refetchMyList?.();
    } catch (error) {
      console.log("Toggle hero favorite error:", error);

      Alert.alert(
        t("movie.error", { defaultValue: "Error" }),
        t("movie.unableToUpdateMyList", {
          defaultValue: "Unable to update My List.",
        })
      );
    } finally {
      setHeroMyListLoading(false);
    }
  };

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
      <MyListToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
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
            <NotificationBell count={notifications?.length || 0} />
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
                      <Feather name="play" size={24} color="#000" />

                      <Text className="text-black text-lg font-extrabold ml-2">
                        {t("movie.playMovie", { defaultValue: "Play" })}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={handleToggleHeroMyList}
                      disabled={heroMyListLoading}
                      className={`h-[56px]flex-1 px-6 rounded-xl border flex-row items-center justify-center ${
                        isHeroSaved
                          ? "bg-[#AB8BFF] border-[#AB8BFF]"
                          : "bg-white/15 border-white/20"
                      }`}
                    >
                      <Feather
                        name={isHeroSaved ? "check" : "plus"}
                        size={24}
                        color="#fff"
                      />

                      <Text className="text-white font-extrabold text-base ml-2">
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
