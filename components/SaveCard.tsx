import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SavedMovie } from "@/services/appwrite";
import { removeFavorite } from "@/services/appwrite";
import { icons } from "@/constants/icons";

interface SaveCardProps {
  movie: SavedMovie;
  onRemove: () => void;
}

const formatReviewCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  } else {
    return count.toString();
  }
};

const SaveCard = ({ movie, onRemove }: SaveCardProps) => {
  const handleRemove = async () => {
    try {
      await removeFavorite(movie.movieId);
      onRemove();
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };
  // Split genres string and get only first 2
  const genreList = movie.genres
    ? movie.genres
        .split(",")
        .map((g) => g.trim())
        .slice(0, 2)
    : [];

  // Parse runtime: extract number from "120 mins" string
  const runtimeMinutes = movie.runtime
    ? parseInt(movie.runtime.replace(/[^0-9]/g, "")) || 0
    : 0;

  // Parse reviewCount: extract number from "1500 reviews" string
  const reviewCountNumber = movie.reviewCount
    ? parseInt(movie.reviewCount.replace(/[^0-9]/g, "")) || 0
    : 0;

  return (
    <View className="flex-row gap-2 bg-dark-300 rounded-[22px] p-3 mb-4 items-center justify-center">
      
        <Image
          source={{ uri: movie.posterPath }}
          className="w-16 h-16 rounded-md"
          resizeMode="contain"
        />
      <View className="flex-1">
        <Text className="font-bold text-lg text-white">{movie.title}</Text>
        <View className="flex-row item-center mt-2">
          <Text className="text-light-200 text-sm">
            {movie?.releaseDate?.split("-")[0]}
          </Text>
          <Text className="text-light-200 text-sm mx-2">•</Text>
          <Text className="text-light-200 text-sm">
            {runtimeMinutes > 0
              ? `${Math.floor(runtimeMinutes/ 60)}h${
                  runtimeMinutes% 60 ? ` ${runtimeMinutes% 60}m` : ""
                }`
              : "N/A"}
          </Text>
        </View>
        <View className="flex-row item-center gap-x-1 mt-2">
          <Image source={icons.star} className="size-4" />
          <Text className="text-white font-bold text-sm">
            {(movie?.voteAverage ?? 0).toFixed(1)}/10
          </Text>
          <Text className="text-light-200 text-sm">
            ({formatReviewCount(reviewCountNumber)} reviews)
          </Text>
        </View>
        {genreList.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-2">
            {genreList.map((genre) => (
              <View
                className="bg-dark-100 px-3 py-1 rounded-full border border-dark-500"
                key={genre}
              >
                <Text className="text-light-100 font-bold text-sm">
                  {genre}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={handleRemove}
        className="bg-dark-300 border border-dark-300 rounded-[14px] p-8"
      >
        <Text className="text-lg">🔖</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SaveCard;
