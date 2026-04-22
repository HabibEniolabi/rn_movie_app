import { View, Text } from "react-native";
import React from "react";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails } from "@/services/api";

const Genre = () => {
  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );
  return( 
    <View className="flex-1 gap-5">
        {movie.map}
    </View>
);
};

export default Genre;
