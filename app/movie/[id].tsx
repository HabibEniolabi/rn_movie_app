import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useMemo, useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import MyListToast from "@/components/MyListToast";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails } from "@/services/api";
import {
  saveFavorite,
  removeFavorite,
  getExistingFavorite,
} from "@/services/appwrite";

const getImageUrl = (path?: string | null, size = "w500") => {
  if (!path) return "https://placehold.co/500x750/1a1a1a/ffffff.png";
  if (path.startsWith("http")) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

const formatRuntime = (runtime?: number | null) => {
  if (!runtime) return "N/A";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (!hours) return `${minutes}m`;

  return `${hours}h ${minutes}m`;
};

const formatMoney = (amount?: number) => {
  if (!amount) return "N/A";

  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }

  return `$${amount.toLocaleString()}`;
};

const MovieDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();

  const [localFavorite, setLocalFavorite] = useState<any | null>(null);
  const [myListLoading, setMyListLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"added" | "removed">("added");

  const {
    data: movie,
    loading,
    error,
  } = useFetch(() => fetchMovieDetails(String(id)));

  const { data: existingFavorite, refetch: refetchExistingFavorite } = useFetch(
    () => getExistingFavorite(String(id))
  );

  useEffect(() => {
    setLocalFavorite(existingFavorite || null);
  }, [existingFavorite]);

  const isSaved = !!localFavorite;

  const trailer = useMemo(() => {
    const videos = (movie as any)?.videos?.results || [];

    return videos.find(
      (video: any) => video.site === "YouTube" && video.type === "Trailer"
    );
  }, [movie]);

  const genres = useMemo(() => {
    return movie?.genres?.map((genre) => genre.name).join(" • ");
  }, [movie]);

  const countries = useMemo(() => {
    return movie?.production_countries
      ?.map((country) => country.name)
      .join(" • ");
  }, [movie]);

  const director = useMemo(() => {
    const crew = (movie as any)?.credits?.crew || [];

    return crew.find((person: any) => person.job === "Director");
  }, [movie]);

  const cast = useMemo(() => {
    return (movie as any)?.credits?.cast || [];
  }, [movie]);

  const handleToggleMyList = async () => {
    if (!movie || myListLoading) return;

    setMyListLoading(true);

    try {
      if (isSaved && localFavorite) {
        await removeFavorite(localFavorite.$id);

        setLocalFavorite(null);
        setToastType("removed");
        setToastMessage("Removed from My List");
        setToastVisible(true);

        await refetchExistingFavorite();
        return;
      }

      const savedFavorite = await saveFavorite({
        ...movie,
        mediaType: "movie",
      });

      setLocalFavorite(savedFavorite);
      setToastType("added");
      setToastMessage("Added to My List");
      setToastVisible(true);

      await refetchExistingFavorite();
    } catch (error) {
      console.log("Toggle movie favorite error:", error);

      Alert.alert(
        t("movie.error", { defaultValue: "Error" }),
        t("movie.unableToUpdateMyList", {
          defaultValue: "Unable to update My List.",
        })
      );
    } finally {
      setMyListLoading(false);
    }
  };

  const handlePlayTrailer = () => {
    if (!trailer?.key) {
      Alert.alert(
        t("movie.noTrailerTitle", { defaultValue: "No trailer found" }),
        t("movie.noTrailerMessage", {
          defaultValue: "No trailer is available for this movie yet.",
        })
      );
      return;
    }

    Alert.alert(
      t("movie.trailer", { defaultValue: "Trailer" }),
      `YouTube trailer key: ${trailer.key}`
    );
  };

  const handlePlayMovie = () => {
    Alert.alert(
      t("movie.fullMovieComingSoon", {
        defaultValue: "Full movie playback coming soon",
      }),
      t("movie.fullMovieComingSoonMessage", {
        defaultValue:
          "We currently do not have a licensed streaming URL for this movie. Trailers and official clips are available below.",
      })
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <ActivityIndicator size="large" color="#AB8BFF" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <SafeAreaView className="flex-1 bg-primary px-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 rounded-full bg-white/10 items-center justify-center mt-4"
        >
          <Feather name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>

        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-xl font-bold text-center">
            {t("movie.unableToLoadMovie", {
              defaultValue: "Unable to load movie details.",
            })}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <MyListToast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="w-full h-[520px]">
          <Image
            source={{
              uri: getImageUrl(
                movie.backdrop_path || movie.poster_path,
                "w780"
              ),
            }}
            className="w-full h-full"
            resizeMode="cover"
          />

          <LinearGradient
            colors={[
              "rgba(0,0,0,0.15)",
              "rgba(0,0,0,0.45)",
              "rgba(3,0,20,0.95)",
              "#030014",
            ]}
            locations={[0, 0.45, 0.78, 1]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              justifyContent: "flex-end",
              paddingHorizontal: 24,
              paddingBottom: 32,
            }}
          >
            <SafeAreaView className="absolute top-0 left-0 right-0 px-5">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-11 h-11 rounded-full bg-black/45 items-center justify-center mt-3"
              >
                <Feather name="arrow-left" size={26} color="#fff" />
              </TouchableOpacity>
            </SafeAreaView>

            <View className="bg-[#AB8BFF] self-start px-3 py-1 rounded-full mb-3">
              <Text className="text-white text-xs font-extrabold uppercase">
                {t("movie.movie", { defaultValue: "Movie" })}
              </Text>
            </View>

            <Text className="text-white text-[34px] font-extrabold leading-[40px]">
              {movie.title ||
                movie.original_title ||
                t("movie.noTitleAvailable", {
                  defaultValue: "No title available",
                })}
            </Text>

            {!!movie.tagline && (
              <Text className="text-light-200 text-sm italic mt-2">
                “{movie.tagline}”
              </Text>
            )}

            <Text className="text-light-200 text-sm font-semibold mt-3">
              {movie.release_date?.slice(0, 4) ||
                t("movie.unknownYear", { defaultValue: "Unknown year" })}{" "}
              • {formatRuntime(movie.runtime)} •{" "}
              {movie.vote_average?.toFixed?.(1) || "0.0"} ★
            </Text>

            {!!genres && (
              <Text className="text-[#AB8BFF] text-sm font-bold mt-2">
                {genres}
              </Text>
            )}

            <View className="flex-row mt-6 gap-3">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handlePlayMovie}
                className="flex-1 h-[52px] rounded-xl bg-white flex-row items-center justify-center"
              >
                <Feather name="play" size={20} color="#030014" />

                <Text className="text-primary font-extrabold text-base ml-2">
                  {t("movie.play", { defaultValue: "Play" })}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleToggleMyList}
                disabled={myListLoading}
                className={`flex-1 h-[52px] rounded-xl border flex-row items-center justify-center ${
                  isSaved
                    ? "bg-[#AB8BFF] border-[#AB8BFF]"
                    : "bg-white/15 border-white/20"
                }`}
              >
                <Feather
                  name={isSaved ? "check" : "plus"}
                  size={20}
                  color="#fff"
                />

                <Text className="text-white font-extrabold text-base ml-2">
                  {t("movie.myList", { defaultValue: "My List" })}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View className="px-6 pb-12">
          <Text className="text-white text-xl font-extrabold mb-3">
            {t("movie.overview", { defaultValue: "Overview" })}
          </Text>

          <Text className="text-light-200 text-base leading-7">
            {movie.overview ||
              t("movie.noOverviewAvailable", {
                defaultValue: "No overview available.",
              })}
          </Text>

          <View className="mt-8">
            <Text className="text-white text-xl font-extrabold mb-4">
              {t("movie.movieInfo", { defaultValue: "Movie Info" })}
            </Text>

            <InfoRow
              label={t("movie.releaseDate", { defaultValue: "Release date" })}
              value={
                movie.release_date ||
                t("movie.notAvailable", { defaultValue: "N/A" })
              }
            />

            <InfoRow
              label={t("movie.status", { defaultValue: "Status" })}
              value={
                movie.status || t("movie.notAvailable", { defaultValue: "N/A" })
              }
            />

            <InfoRow
              label={t("movie.runtime", { defaultValue: "Runtime" })}
              value={formatRuntime(movie.runtime)}
            />

            <InfoRow
              label={t("movie.rating", { defaultValue: "Rating" })}
              value={`${movie.vote_average?.toFixed?.(1) || "0.0"} / 10`}
            />

            <InfoRow
              label={t("movie.votes", { defaultValue: "Votes" })}
              value={String(movie.vote_count || 0)}
            />

            {!!director?.name && (
              <InfoRow
                label={t("movie.director", { defaultValue: "Director" })}
                value={director.name}
              />
            )}

            {!!genres && (
              <InfoRow
                label={t("movie.genres", { defaultValue: "Genres" })}
                value={genres}
              />
            )}

            {!!countries && (
              <InfoRow
                label={t("movie.countries", { defaultValue: "Countries" })}
                value={countries}
              />
            )}

            <InfoRow
              label={t("movie.budget", { defaultValue: "Budget" })}
              value={formatMoney(movie.budget)}
            />

            <InfoRow
              label={t("movie.revenue", { defaultValue: "Revenue" })}
              value={formatMoney(movie.revenue)}
            />
          </View>

          <View className="mt-8">
            <Text className="text-white text-xl font-extrabold mb-4">
              {t("movie.trailersMore", { defaultValue: "Trailers & More" })}
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handlePlayTrailer}
              className="rounded-2xl bg-dark-300 border border-white/10 p-4 flex-row items-center"
            >
              <View className="w-12 h-12 rounded-full bg-[#AB8BFF] items-center justify-center">
                <Feather name="play" size={22} color="#fff" />
              </View>

              <View className="flex-1 ml-4">
                <Text className="text-white font-extrabold text-base">
                  {t("movie.watchTrailer", { defaultValue: "Watch trailer" })}
                </Text>

                <Text className="text-light-200 text-sm mt-1">
                  {trailer?.name ||
                    t("movie.noTrailerTitle", {
                      defaultValue: "No trailer found",
                    })}
                </Text>
              </View>

              <Feather name="chevron-right" size={24} color="#6A6880" />
            </TouchableOpacity>
          </View>

          {!!cast?.length && (
            <View className="mt-8">
              <Text className="text-white text-xl font-extrabold mb-4">
                {t("movie.starring", { defaultValue: "Starring" })}
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {cast.slice(0, 12).map((person: any) => (
                  <View key={person.id} className="w-[92px] mr-4">
                    <Image
                      source={{
                        uri: getImageUrl(person.profile_path, "w185"),
                      }}
                      className="w-[92px] h-[122px] rounded-xl bg-dark-100"
                      resizeMode="cover"
                    />

                    <Text
                      className="text-white text-xs font-bold mt-2"
                      numberOfLines={2}
                    >
                      {person.name}
                    </Text>

                    <Text
                      className="text-light-200 text-[11px] mt-1"
                      numberOfLines={1}
                    >
                      {person.character}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <View className="flex-row justify-between border-b border-white/10 py-3">
      <Text className="text-light-200 font-semibold">{label}</Text>

      <Text className="text-white font-bold max-w-[60%] text-right">
        {value}
      </Text>
    </View>
  );
};

export default MovieDetailsScreen;
