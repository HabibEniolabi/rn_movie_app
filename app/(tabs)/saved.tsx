import GenreTabs from "@/components/GenreTabs";
import { icons } from "@/constants/icons";
import { getSavedMovies, SavedMovie } from "@/services/appwrite";
import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import Octicons from "react-native-vector-icons/Octicons";
import SaveCard from "@/components/SaveCard";

const Saved = () => {
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [recentMovies, setRecentMovies] = useState<SavedMovie[]>([]);
  const [olderMovies, setOlderMovies] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedMovies();
  }, []);

  const fetchSavedMovies = async () => {
    try {
      console.log("🟡 Fetching saved movies...");
      const movies = await getSavedMovies();
      console.log("✅ Fetched movies:", movies);
      setSavedMovies(movies);
      
      // Split into recent (last 7 days) and older
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const recent = movies.filter((movie) => {
        const createdDate = new Date(movie.$createdAt);
        return createdDate > sevenDaysAgo;
      });

      const older = movies.filter((movie) => {
        const createdDate = new Date(movie.$createdAt);
        return createdDate <= sevenDaysAgo;
      });

      setRecentMovies(recent);
      setOlderMovies(older);
    } catch (error) {
      console.error("❌ Error fetching saved movies:", error);
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
        <Text className="text-white font-bold text-[24px]">My Watchlist</Text>
        <View className="flex items-center bg-dark-300 border-dark-400 border p-3 rounded-md">
          <TouchableOpacity>
            <Octicons name={"plus"} size={18} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex flex-col gap-1 gap-4">
        <Text className="text-dark-500">
          {savedMovies.length} movie{savedMovies.length !== 1 ? "s" : ""} saved
        </Text>
        <GenreTabs />
      </View>
      <ScrollView
        className="flex-1 bg-primary"
        showsVerticalScrollIndicator={false}
      >
        {/* Recently Added Section */}
        {recentMovies.length > 0 && (
          <View className="flex flex-col mt-6">
            <Text className="text-dark-500 font-bold uppercase mb-4">
              Recently Added ({recentMovies.length})
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
              Older Saves ({olderMovies.length})
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
            <Text className="text-light-200 text-lg">No saved movies yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Saved;