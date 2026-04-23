import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails } from "@/services/api";

const genreThemes = [
  {
    bg: "rgba(139, 92, 246, 0.15)", // purple tint
    border: "rgba(139, 92, 246, 0.5)",
    text: "#B794F4",
  },
  {
    bg: "rgba(236, 72, 153, 0.15)", // pink tint
    border: "#ec4899",
    text: "#F472B6",
  },
  {
    bg: "rgba(245, 158, 11, 0.15)", // yellow tint
    border: "rgba(245, 158, 11, 0.5)",
    text: "#FACC15",
  },
  {
    bg: "rgba(16, 185, 129, 0.15)", // green tint
    border: "rgba(16, 185, 129, 0.5)",
    text: "#34D399",
  },
  {
    bg: "rgba(249, 115, 22, 0.15)", // orange tint
    border: "rgba(249, 115, 22, 0.5)",
    text: "#FB923C",
  },
  {
    bg: "rgba(168, 85, 247, 0.15)", // violet tint
    border: "rgba(168, 85, 247, 0.5)",
    text: "#C084FC",
  },
];

type GenreItem = {
  id: number;
  name: string;
};

interface GenreProps {
  genres: GenreItem[];
}

const Genre = ({ genres }: GenreProps) => {
  return (
    <View className="flex-row flex-wrap gap-3 mt-4">
      {genres.map((genre, index) => {
        const theme = genreThemes[index % genreThemes.length];

        return (
          <TouchableOpacity key={index}>
            <View
              key={genre.id}
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: theme.bg,
                borderWidth: 1.5,
                borderColor: theme.border,
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: theme.text }}
              >
                {genre.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Genre;
