import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { useTranslation } from "react-i18next";
import { playClickedMovies, type TMDBVideo } from "@/services/api";

const getYoutubeThumbnail = (videoKey: string) => {
  return `https://img.youtube.com/vi/${videoKey}/hqdefault.jpg`;
};

const getVideoTypeLabel = (type?: string) => {
  if (!type) return "Video";

  return type;
};

const sortVideos = (videos: TMDBVideo[]) => {
  const priority: Record<string, number> = {
    Trailer: 1,
    Teaser: 2,
    Clip: 3,
    Featurette: 4,
    "Behind the Scenes": 5,
    Bloopers: 6,
  };

  return [...videos].sort((a, b) => {
    const aPriority = priority[a.type] || 99;
    const bPriority = priority[b.type] || 99;

    if (aPriority !== bPriority) return aPriority - bPriority;

    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });
};

const TrailersScreen = () => {
  const { t, i18n } = useTranslation();

  const { id, title } = useLocalSearchParams<{
    id: string;
    title?: string;
  }>();

  const [videos, setVideos] = useState<TMDBVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const trailerVideos = useMemo(() => {
    const youtubeVideos = videos.filter(
      (video) =>
        video.key &&
        video.site?.toLowerCase() === "youtube"
    );

    return sortVideos(youtubeVideos);
  }, [videos]);

  useEffect(() => {
    const fetchTrailers = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const videoData = await playClickedMovies(String(id));

        let results = videoData.results || [];

        // Fallback to English if current language has no videos
        if (!results.length && i18n.language.split("-")[0] !== "en") {
          const englishVideoData = await playClickedMovies(String(id), "en-US");
          results = englishVideoData.results || [];
        }

        setVideos(results);
      } catch (error) {
        console.log("Fetch trailers error:", error);

        Alert.alert(
          t("movie.trailerErrorTitle"),
          t("movie.trailerErrorMessage")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrailers();
  }, [id, i18n.language]);

  const handlePlayTrailer = (video: TMDBVideo) => {
    router.push({
      pathname: "/watch/[id]" as const,
      params: {
        id: String(id),
        videoId: video.key,
        title: video.name || title || t("movie.watchTrailer"),
      },
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#B954F5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="pt-14 px-5 pb-4 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center"
        >
          <Feather name="arrow-left" size={32} color="#fff" />
        </TouchableOpacity>

        <Text
          className="text-white text-xl font-bold flex-1 text-center mx-4"
          numberOfLines={1}
        >
          {title || t("movie.watchTrailer")}
        </Text>

        <View className="w-11 h-11" />
      </View>

      <View className="border-b border-[#252525]">
        <View className="flex-row px-5">
          <TouchableOpacity className="pb-3 mr-8 border-b-[3px] border-[#E50914]">
            <Text className="text-white font-bold text-base">
              {t("movie.trailersMore", {
                defaultValue: "Trailers & More",
              })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {trailerVideos.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-white text-lg font-bold text-center">
            {t("movie.noTrailerTitle")}
          </Text>

          <Text className="text-light-200 text-center mt-2">
            {t("movie.noTrailerMessage")}
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 18,
            paddingBottom: 40,
          }}
        >
          {trailerVideos.map((video) => (
            <TouchableOpacity
              key={video.id}
              activeOpacity={0.85}
              onPress={() => handlePlayTrailer(video)}
              className="mb-8"
            >
              <View className="w-full h-[190px] rounded-xl overflow-hidden bg-[#111]">
                <Image
                  source={{
                    uri: getYoutubeThumbnail(video.key),
                  }}
                  className="w-full h-full"
                  resizeMode="cover"
                />

                <View className="absolute inset-0 bg-black/20 items-center justify-center">
                  <View className="w-[74px] h-[74px] rounded-full border-2 border-white items-center justify-center bg-black/20">
                    <Feather name="play" size={34} color="#fff" />
                  </View>
                </View>

                <View className="absolute top-3 left-3 bg-black/70 px-3 py-1 rounded-full">
                  <Text className="text-white text-xs font-bold">
                    {getVideoTypeLabel(video.type)}
                  </Text>
                </View>
              </View>

              <Text
                className="text-white text-base font-semibold mt-3"
                numberOfLines={2}
              >
                {video.name || t("movie.watchTrailer")}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default TrailersScreen;