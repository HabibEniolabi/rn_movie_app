import GenreTabs from "@/components/GenreTabs";
import { icons } from "@/constants/icons";
import { getSavedMovies, SavedMovie } from "@/services/appwrite";
import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Octicons from "react-native-vector-icons/Octicons";
import SaveCard from "@/components/SaveCard";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import i18n from "@/interfaces/i18n";
import { useFocusEffect } from "expo-router";
import { fetchMovieDetails } from "@/services/api";

const Saved = () => {
  const { t } = useTranslation();

  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [recentMovies, setRecentMovies] = useState<SavedMovie[]>([]);
  const [olderMovies, setOlderMovies] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(true);

  const tabBarHeight = useBottomTabBarHeight();

  // useEffect(() => {
  //   fetchSavedMovies();
  // }, [i18n.language]);
  useFocusEffect(
    useCallback(() => {
      fetchSavedMovies();
    }, [i18n.language])
  );

  const fetchSavedMovies = async () => {
    try {
      setLoading(true);

      const saved = await getSavedMovies();

      const localizedMovies = await Promise.all(
        saved.map(async (movie) => {
          try {
            const details = await fetchMovieDetails(movie.movieId);

            return {
              ...movie,
              title: details.title || movie.title,
              posterPath: details.poster_path || movie.posterPath,
              releaseDate: details.release_date || movie.releaseDate,
              voteAverage: details.vote_average ?? movie.voteAverage,
              overview: details.overview || movie.overview,
              runtime: details.runtime
                ? `${details.runtime} mins`
                : movie.runtime,
              reviewCount: details.vote_count
                ? `${details.vote_count} reviews`
                : movie.reviewCount,
              genres: details.genres?.length
                ? details.genres.map((genre) => genre.name).join(",")
                : movie.genres,
            };
          } catch (error) {
            return movie;
          }
        })
      );

      setSavedMovies(localizedMovies);

      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const recent = localizedMovies.filter((movie) => {
        const createdDate = new Date(movie.$createdAt);
        return createdDate > sevenDaysAgo;
      });

      const older = localizedMovies.filter((movie) => {
        const createdDate = new Date(movie.$createdAt);
        return createdDate <= sevenDaysAgo;
      });

      setRecentMovies(recent);
      setOlderMovies(older);
    } catch (error) {
      console.log("Failed to fetch saved movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMovie = (movieId: string) => {
    setSavedMovies(savedMovies.filter((m) => m.$id !== movieId));
    setRecentMovies(recentMovies.filter((m) => m.$id !== movieId));
    setOlderMovies(olderMovies.filter((m) => m.$id !== movieId));
  };

  if (loading) {
    return (
      <View className="bg-primary flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#B954F5" />
      </View>
    );
  }

  return (
    <View className="bg-primary flex-1 px-5">
      <View className="flex justify-between mt-16 items-center flex-row">
        <Text className="text-white font-bold text-[24px]">
          {t("saved.title")}
        </Text>
        <View className="flex items-center bg-dark-300 border-dark-400 border p-3 rounded-md">
          <TouchableOpacity>
            <Octicons name={"plus"} size={18} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex flex-col gap-1 gap-4">
        <Text className="text-dark-500">
          {t("saved.movieCount", { count: savedMovies.length })}
        </Text>
        <GenreTabs />
      </View>
      <ScrollView
        className="flex-1 bg-primary"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBlock: 10,
          paddingBottom: tabBarHeight + 40,
        }}
      >
        {/* Recently Added Section */}
        {recentMovies.length > 0 && (
          <View className="flex flex-col mt-6">
            <Text className="text-dark-500 font-bold uppercase mb-4">
              {t("saved.recentlyAdded", { count: recentMovies.length })}
            </Text>
            {recentMovies.map((movie) => (
              <SaveCard
                key={movie.$id}
                movie={movie}
                onRemove={() => handleRemoveMovie(movie.$id)}
              />
            ))}
          </View>
        )}

        {/* Older Saves Section */}
        {olderMovies.length > 0 && (
          <View className="flex flex-col mt-6">
            <Text className="text-dark-500 font-bold uppercase mb-4">
              {t("saved.olderSaves", { count: olderMovies.length })}
            </Text>
            {olderMovies.map((movie) => (
              <SaveCard
                key={movie.$id}
                movie={movie}
                onRemove={() => handleRemoveMovie(movie.$id)}
              />
            ))}
          </View>
        )}

        {/* Empty State */}
        {savedMovies.length === 0 && (
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="text-light-200 text-lg">
              {t("saved.noSavedMovies")}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Saved;
