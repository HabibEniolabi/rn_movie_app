import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router/build/hooks";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails, playClickedMovies } from "@/services/api";
import { icons } from "@/constants/icons";
import { router } from "expo-router";
import { getMovieCertification } from "@/utils/helpers";
import { saveFavorite, removeFavorite } from "@/services/appwrite";
import Entypo from "react-native-vector-icons/Entypo";
import { getExistingFavorite } from "@/services/appwrite";
import { useTranslation } from "react-i18next";
import { images } from "@/constants/images";

interface MovieInfoProps {
  label: string;
  value?: React.ReactNode;
  notAvailable: string;
}

export const MovieInfo = ({ label, value, notAvailable }: MovieInfoProps) => {
  const content = value || notAvailable;

  return (
    <View className="flex-col items-start justify-center mt-5">
      <Text className="text-light-200 font-normal text-sm">{label}</Text>

      {React.isValidElement(content) ? (
        <View className="mt-2">{content}</View>
      ) : (
        <Text className="text-light-100 font-bold gap-x-2 text-sm mt-2">
          {content}
        </Text>
      )}
    </View>
  );
};

const getPosterUrl = (posterPath?: string | null) => {
  if (!posterPath) {
    return "https://placehold.co/600x400/1a1a1a/ffffff.png";
  }

  if (posterPath.startsWith("http")) {
    return posterPath;
  }

  return `https://image.tmdb.org/t/p/w500${posterPath}`;
};

const MovieDetails = () => {
  const { t, i18n } = useTranslation();

  const { id } = useLocalSearchParams();
  const [isClicked, setIsClicked] = useState(false);
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  const {
    data: movie,
    loading,
    refetch,
  } = useFetch(() => fetchMovieDetails(id as string));

  useEffect(() => {
    refetch();
  }, [i18n.language]);

  const handleToggleSave = async () => {
    if (!movie) return;
    try {
      if (isClicked) {
        await removeFavorite(movie?.id);
        setIsClicked(false);
      } else {
        await saveFavorite(movie);
        setIsClicked(true);
      }
    } catch (error) {
      console.log("Favorite error:", error);
    }
  };

  useEffect(() => {
    const checkIfFavorited = async () => {
      try {
        if (movie?.id) {
          const existing = await getExistingFavorite(movie.id);
          if (existing) {
            setIsClicked(true); // Heart is red if already saved
          } else {
            setIsClicked(false);
          }
        }
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };

    checkIfFavorited();
  }, [movie?.id]);

  const notAvailable = t("movie.notAvailable");

  const findBestTrailer = (
    videos: {
      key: string;
      site: string;
      type: string;
      official?: boolean;
      name?: string;
    }[] = []
  ) => {
    return (
      videos.find(
        (item) =>
          item.site === "YouTube" && item.type === "Trailer" && item.official
      ) ||
      videos.find(
        (item) => item.site === "YouTube" && item.type === "Trailer"
      ) ||
      videos.find((item) => item.site === "YouTube")
    );
  };

  const handlePress = async () => {
    if (!id || !movie) return;

    try {
      setLoadingTrailer(true);

      const videoData = await playClickedMovies(id as string);

      let trailer = findBestTrailer(videoData.results);

      // Some movies do not have Arabic/localized trailers.
      // So fallback to English if current language returns nothing useful.
      if (!trailer && i18n.language.split("-")[0] !== "en") {
        const englishVideoData = await playClickedMovies(id as string, "en-US");
        trailer = findBestTrailer(englishVideoData.results);
      }

      if (!trailer?.key) {
        Alert.alert(t("movie.noTrailerTitle"), t("movie.noTrailerMessage"));
        return;
      }
      
      router.push({
        pathname: "/watch/[id]",
        params: {
          id: String(movie.id),
          videoId: trailer.key,
          title: movie.title || trailer.name || t("movie.watchTrailer"),
        },
      });
    } catch (error) {
      console.log("Play trailer error:", error);

      Alert.alert(t("movie.trailerErrorTitle"), t("movie.trailerErrorMessage"));
    } finally {
      setLoadingTrailer(false);
    }
  };

  const formattedDate = movie?.release_date
    ? `${new Date(movie.release_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })} (${t("movie.worldwide")})`
    : notAvailable;

  const runtimeLabel = movie?.runtime
    ? `${Math.floor(movie.runtime / 60)}h${
        movie.runtime % 60 ? ` ${movie.runtime % 60}m` : ""
      }`
    : notAvailable;

  const formatMoney = (amount?: number) => {
    if (!amount || amount <= 0) {
      return notAvailable;
    }

    return `$${(amount / 1_000_000).toFixed(1)} ${t("movie.million")}`;
  };

  if (loading) {
    return (
      <View className="bg-primary flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#B954F5" />
      </View>
    );
  }

  return (
    <View className="bg-primary flex-1 ">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      >
        <View className="relative w-full h-[550px]">
          <Image
            source={{
              uri: getPosterUrl(movie?.poster_path),
            }}
            className="w-full h-full"
            resizeMode="stretch"
          />
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handlePress}
            disabled={loadingTrailer}
            className="absolute -bottom-10 right-7 w-[64px] h-[64px] rounded-full bg-white items-center justify-center"
          >
            {loadingTrailer ? (
              <ActivityIndicator size="small" color="#B954F5" />
            ) : (
              <Image
                source={images.pause}
                className="w-8 h-8"
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>
        <View className="flex-col item-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">
            {movie?.title || t("movie.noTitleAvailable")}
          </Text>
          <View className="flex-row item-center mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0] || t("movie.unknownYear")}
            </Text>
            <Text className="text-light-200 text-sm mx-2">•</Text>
            <Text className="text-light-200 text-sm">
              {movie ? getMovieCertification(movie, "US") : notAvailable}
            </Text>
            <Text className="text-light-200 text-sm mx-2">•</Text>
            <Text className="text-light-200 text-sm">{runtimeLabel}</Text>
          </View>
          <View className="flex-row gap-4 items-center">
            <View className="flex-row item-center bg-dark-100 rounded-md px-2 py-1 gap-x-1 mt-2">
              <Image source={icons.star} className="size-4" />
              <Text className="text-white font-bold text-sm">
                {Math.round(movie?.vote_average ?? 0)}/10
              </Text>
              <Text className="text-light-200 text-sm">
                {t("movie.voteCount", {
                  count: movie?.vote_count ?? 0,
                })}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleToggleSave}
              disabled={!movie}
              className="active:bg-dark-300 mt-2"
            >
              <Entypo
                name={isClicked ? "heart" : "heart-outlined"}
                size={24}
                color={isClicked ? "#EF4444" : "#DC2626"}
              />
            </TouchableOpacity>
          </View>
          <MovieInfo
            label={t("movie.overview")}
            value={movie?.overview || notAvailable}
            notAvailable={notAvailable}
          />
          <View className="flex flex-row gap-[50px]">
            <MovieInfo
              label={t("movie.releaseDate")}
              value={formattedDate}
              notAvailable={notAvailable}
            />

            <MovieInfo
              label={t("movie.status")}
              value={movie?.status || notAvailable}
              notAvailable={notAvailable}
            />
          </View>

          <MovieInfo
            label={t("movie.genres")}
            notAvailable={notAvailable}
            value={
              movie?.genres?.length ? (
                <View className="flex-row flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <View
                      className="bg-dark-100 px-3 py-1 rounded-md"
                      key={genre.id}
                    >
                      <Text className="text-light-100 font-bold">
                        {genre.name}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                notAvailable
              )
            }
          />
          <MovieInfo
            label={t("movie.countries")}
            value={
              movie?.production_countries
                ?.map((country) => country.name)
                .join(" • ") || notAvailable
            }
            notAvailable={notAvailable}
          />

          <MovieInfo
            label={t("movie.tagline")}
            value={movie?.tagline || t("movie.noTaglineAvailable")}
            notAvailable={notAvailable}
          />
          <View className="flex flex-row gap-[50px]">
            <MovieInfo
              label={t("movie.budget")}
              value={formatMoney(movie?.budget)}
              notAvailable={notAvailable}
            />

            <MovieInfo
              label={t("movie.revenue")}
              value={formatMoney(movie?.revenue)}
              notAvailable={notAvailable}
            />
          </View>
          <MovieInfo
            label={t("movie.productionCompanies")}
            value={
              movie?.production_companies
                ?.map((company) => company.name)
                .join(" • ") || notAvailable
            }
            notAvailable={notAvailable}
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        className="absolute bottom-5 rounded-lg right-0 mx-5 left-0 bg-accent py-3.5 flex-row items-center justify-center z-50"
        onPress={() => router.back()}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">
          {t("movie.goBack")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
