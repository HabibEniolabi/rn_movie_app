import GenreTabs from "@/components/GenreTabs";
import MyListToast from "@/components/MyListToast";
import SaveCard from "@/components/SaveCard";
import { useMyList } from "../context/MyListContext";
import { SavedMovie } from "@/services/appwrite";
import { fetchMovieDetails, fetchTVDetails } from "@/services/api";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Octicons from "react-native-vector-icons/Octicons";

type SavedFilter = "all" | "movie" | "tv";

const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

const Saved = () => {
  const { t, i18n } = useTranslation();
  const tabBarHeight = useBottomTabBarHeight();

  const {
    savedMovies,
    loading: myListLoading,
    refreshMyList,
    removeFromMyList,
  } = useMyList();

  const [localizedMovies, setLocalizedMovies] = useState<SavedMovie[]>([]);
  const [localizing, setLocalizing] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState<SavedFilter>("all");

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"added" | "removed">("removed");

  useFocusEffect(
    useCallback(() => {
      refreshMyList();
    }, [refreshMyList])
  );

  useEffect(() => {
    let isMounted = true;

    const localizeSavedMovies = async () => {
      if (!savedMovies.length) {
        setLocalizedMovies([]);
        return;
      }

      setLocalizing(true);

      try {
        const localized = await Promise.all(
          savedMovies.map(async (item) => {
            try {
              const mediaType = item.mediaType === "tv" ? "tv" : "movie";

              const details =
                mediaType === "tv"
                  ? await fetchTVDetails(String(item.movieId))
                  : await fetchMovieDetails(String(item.movieId));

              if (mediaType === "tv") {
                return {
                  ...item,
                  mediaType: "tv",
                  title: details.name || item.title,
                  posterPath: details.poster_path || item.posterPath,
                  backdropPath: details.backdrop_path || item.backdropPath,
                  releaseDate: details.first_air_date || item.releaseDate,
                  voteAverage: details.vote_average ?? item.voteAverage,
                  overview: details.overview || item.overview,
                  runtime: details.episode_run_time?.[0]
                    ? `${details.episode_run_time[0]} mins`
                    : item.runtime,
                  reviewCount: details.vote_count
                    ? `${details.vote_count} reviews`
                    : item.reviewCount,
                  genres: details.genres?.length
                    ? details.genres.map((genre: any) => genre.name).join(", ")
                    : item.genres,
                } as SavedMovie;
              }

              return {
                ...item,
                mediaType: "movie",
                title: details.title || item.title,
                posterPath: details.poster_path || item.posterPath,
                backdropPath: details.backdrop_path || item.backdropPath,
                releaseDate: details.release_date || item.releaseDate,
                voteAverage: details.vote_average ?? item.voteAverage,
                overview: details.overview || item.overview,
                runtime: details.runtime ? `${details.runtime} mins` : item.runtime,
                reviewCount: details.vote_count
                  ? `${details.vote_count} reviews`
                  : item.reviewCount,
                genres: details.genres?.length
                  ? details.genres.map((genre: any) => genre.name).join(", ")
                  : item.genres,
              } as SavedMovie;
            } catch (error) {
              return item;
            }
          })
        );

        if (isMounted) {
          setLocalizedMovies(localized);
        }
      } catch (error) {
        console.log("Failed to localize saved movies:", error);

        if (isMounted) {
          setLocalizedMovies(savedMovies);
        }
      } finally {
        if (isMounted) {
          setLocalizing(false);
        }
      }
    };

    localizeSavedMovies();

    return () => {
      isMounted = false;
    };
  }, [savedMovies, i18n.language]);

  const filteredMovies = useMemo(() => {
    if (selectedFilter === "all") return localizedMovies;

    return localizedMovies.filter((item) => {
      const mediaType = item.mediaType === "tv" ? "tv" : "movie";
      return mediaType === selectedFilter;
    });
  }, [localizedMovies, selectedFilter]);

  const recentMovies = useMemo(() => {
    const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_IN_MS);

    return filteredMovies.filter((movie) => {
      const createdDate = new Date(movie.$createdAt);
      return createdDate > sevenDaysAgo;
    });
  }, [filteredMovies]);

  const olderMovies = useMemo(() => {
    const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_IN_MS);

    return filteredMovies.filter((movie) => {
      const createdDate = new Date(movie.$createdAt);
      return createdDate <= sevenDaysAgo;
    });
  }, [filteredMovies]);

  const movieCount = localizedMovies.filter(
    (item) => item.mediaType !== "tv"
  ).length;

  const seriesCount = localizedMovies.filter(
    (item) => item.mediaType === "tv"
  ).length;

  const isLoading = myListLoading && !localizedMovies.length;

  const handleOpenDiscover = () => {
    router.push("/search");
  };

  const handleRemoveMovie = async (movie: SavedMovie) => {
    try {
      const mediaType = movie.mediaType === "tv" ? "tv" : "movie";

      await removeFromMyList(movie.movieId, mediaType);

      setToastType("removed");
      setToastMessage("Removed from My List");
      setToastVisible(true);
    } catch (error) {
      console.log("Remove saved item error:", error);
    }
  };

  const renderSection = (title: string, count: number, items: SavedMovie[]) => {
    if (!items.length) return null;

    return (
      <View className="mt-8">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-light-200 font-extrabold text-xs uppercase tracking-[1.5px]">
            {title}
          </Text>

          <Text className="text-dark-500 font-bold text-xs">
            {count} {count === 1 ? "title" : "titles"}
          </Text>
        </View>

        <View className="gap-4">
          {items.map((movie) => (
            <SaveCard
              key={movie.$id}
              movie={movie}
              onRemove={() => handleRemoveMovie(movie)}
            />
          ))}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="bg-primary flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#AB8BFF" />
      </View>
    );
  }

  return (
    <View className="bg-primary flex-1">
      <MyListToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 60,
          paddingBottom: tabBarHeight + 40,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white font-extrabold text-[32px]">
              {t("saved.title", { defaultValue: "My List" })}
            </Text>

            <Text className="text-light-200 text-sm font-semibold mt-1">
              {localizedMovies.length} saved{" "}
              {localizedMovies.length === 1 ? "title" : "titles"}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleOpenDiscover}
            className="w-12 h-12 rounded-2xl bg-[#AB8BFF] items-center justify-center"
          >
            <Octicons name="plus" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-3 mt-6">
          <StatCard label="All" value={localizedMovies.length} />
          <StatCard label="Movies" value={movieCount} />
          <StatCard label="Series" value={seriesCount} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-6"
          contentContainerStyle={{
            gap: 10,
            paddingRight: 20,
          }}
        >
          <FilterChip
            label="All"
            active={selectedFilter === "all"}
            onPress={() => setSelectedFilter("all")}
          />

          <FilterChip
            label="Movies"
            active={selectedFilter === "movie"}
            onPress={() => setSelectedFilter("movie")}
          />

          <FilterChip
            label="Series"
            active={selectedFilter === "tv"}
            onPress={() => setSelectedFilter("tv")}
          />
        </ScrollView>

        <View className="mt-5">
          <GenreTabs />
        </View>

        {localizing && localizedMovies.length > 0 && (
          <View className="mt-5 rounded-2xl bg-white/10 border border-white/10 px-4 py-3 flex-row items-center">
            <ActivityIndicator size="small" color="#AB8BFF" />

            <Text className="text-light-200 text-sm font-semibold ml-3">
              Updating saved titles...
            </Text>
          </View>
        )}

        {filteredMovies.length === 0 ? (
          <View className="items-center justify-center mt-24 px-6">
            <View className="w-20 h-20 rounded-full bg-white/10 items-center justify-center mb-5">
              <Feather name="bookmark" size={34} color="#AB8BFF" />
            </View>

            <Text className="text-white text-xl font-extrabold text-center">
              {selectedFilter === "all"
                ? t("saved.noSavedMovies", {
                    defaultValue: "No saved titles yet",
                  })
                : selectedFilter === "movie"
                ? "No saved movies yet"
                : "No saved series yet"}
            </Text>

            <Text className="text-light-200 text-sm text-center mt-2 leading-6">
              Save movies and series you want to watch later. They will appear
              here automatically.
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleOpenDiscover}
              className="mt-6 bg-[#AB8BFF] rounded-2xl px-6 py-4 flex-row items-center"
            >
              <Feather name="search" size={18} color="#fff" />

              <Text className="text-white font-extrabold ml-2">
                Discover titles
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {renderSection(
              t("saved.recentlyAdded", {
                count: recentMovies.length,
                defaultValue: "Recently Added",
              }),
              recentMovies.length,
              recentMovies
            )}

            {renderSection(
              t("saved.olderSaves", {
                count: olderMovies.length,
                defaultValue: "Older Saves",
              }),
              olderMovies.length,
              olderMovies
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => {
  return (
    <View className="flex-1 rounded-2xl bg-dark-300 border border-white/10 px-4 py-4">
      <Text className="text-white text-xl font-extrabold">{value}</Text>

      <Text className="text-light-200 text-xs font-semibold mt-1">
        {label}
      </Text>
    </View>
  );
};

const FilterChip = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className={`px-5 py-3 rounded-2xl border ${
        active
          ? "bg-[#AB8BFF] border-[#AB8BFF]"
          : "bg-white/10 border-white/10"
      }`}
    >
      <Text
        className={`font-extrabold text-sm ${
          active ? "text-white" : "text-light-200"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Saved;