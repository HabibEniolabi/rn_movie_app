import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import MyListToast from "@/components/MyListToast";
import { router, useLocalSearchParams } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import useFetch from "@/services/useFetch";
import { fetchTVDetails } from "@/services/api";
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

const ShowDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();

  const [localFavorite, setLocalFavorite] = useState<any | null>(null);
  const [myListLoading, setMyListLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"added" | "removed">("added");

  const {
    data: show,
    loading,
    error,
  } = useFetch(() => fetchTVDetails(String(id)));

  const { data: existingFavorite, refetch: refetchExistingFavorite } = useFetch(
    () => getExistingFavorite(String(id))
  );

  useEffect(() => {
    setLocalFavorite(existingFavorite || null);
  }, [existingFavorite]);

  const isSaved = !!localFavorite;

  const trailer = useMemo(() => {
    return show?.videos?.results?.find(
      (video: any) => video.site === "YouTube" && video.type === "Trailer"
    );
  }, [show]);

  const genres = useMemo(() => {
    return show?.genres?.map((genre: any) => genre.name).join(" • ");
  }, [show]);

  const handleToggleMyList = async () => {
    if (!show || myListLoading) return;

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
        id: show.id,
        title: show.name,
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        release_date: show.first_air_date,
        vote_average: show.vote_average,
        overview: show.overview,
        runtime: show.episode_run_time?.[0] || 0,
        vote_count: show.vote_count || 0,
        genres: show.genres || [],
        mediaType: "tv",
      });

      setLocalFavorite(savedFavorite);
      setToastType("added");
      setToastMessage("Added to My List");
      setToastVisible(true);

      await refetchExistingFavorite();
    } catch (error) {
      console.log("Toggle show favorite error:", error);

      Alert.alert(
        t("details.error", { defaultValue: "Error" }),
        t("details.unableToUpdateMyList", {
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
        t("details.trailerNotAvailable"),
        t("details.noTrailerAvailable")
      );
      return;
    }

    Alert.alert(t("details.trailer"), `YouTube trailer key: ${trailer.key}`);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <ActivityIndicator size="large" color="#AB8BFF" />
      </View>
    );
  }

  if (error || !show) {
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
            {t("details.unableToLoadShow")}
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
              uri: getImageUrl(show.backdrop_path || show.poster_path, "w780"),
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
              <Text className="text-white text-xs font-extrabold">
                {t("details.tvShow")}
              </Text>
            </View>

            <Text className="text-white text-[34px] font-extrabold leading-[40px]">
              {show.name}
            </Text>

            <Text className="text-light-200 text-sm font-semibold mt-2">
              {show.first_air_date?.slice(0, 4) || t("details.notAvailable")} •{" "}
              {show.number_of_seasons || 0} {t("details.seasons")} •{" "}
              {show.vote_average?.toFixed?.(1) || "0.0"} ★
            </Text>

            {!!genres && (
              <Text className="text-[#AB8BFF] text-sm font-bold mt-2">
                {genres}
              </Text>
            )}

            <View className="flex-row mt-6 gap-3">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handlePlayTrailer}
                className="flex-1 h-[52px] rounded-xl bg-white flex-row items-center justify-center"
              >
                <Feather name="play" size={20} color="#030014" />

                <Text className="text-primary font-extrabold text-base ml-2">
                  {t("details.play")}
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
                  {t("details.myList", { defaultValue: "My List" })}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View className="px-6 pb-12">
          <Text className="text-white text-xl font-extrabold mb-3">
            {t("details.overview")}
          </Text>

          <Text className="text-light-200 text-base leading-7">
            {show.overview || t("details.noOverviewAvailable")}
          </Text>

          <View className="mt-8">
            <Text className="text-white text-xl font-extrabold mb-4">
              {t("details.showInfo")}
            </Text>

            <InfoRow
              label={t("details.status")}
              value={show.status || t("details.notAvailable")}
            />

            <InfoRow
              label={t("details.firstAired", { defaultValue: "First aired" })}
              value={show.first_air_date || t("details.notAvailable")}
            />

            <InfoRow
              label={t("details.lastAired")}
              value={show.last_air_date || t("details.notAvailable")}
            />

            <InfoRow
              label={t("details.episodes")}
              value={String(show.number_of_episodes || 0)}
            />

            <InfoRow
              label={t("details.seasons")}
              value={String(show.number_of_seasons || 0)}
            />
          </View>

          {!!show?.credits?.cast?.length && (
            <View className="mt-8">
              <Text className="text-white text-xl font-extrabold mb-4">
                {t("details.cast")}
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {show.credits.cast.slice(0, 12).map((person: any) => (
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

export default ShowDetails;
