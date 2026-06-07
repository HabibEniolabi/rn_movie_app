import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { useTranslation } from "react-i18next";
import YoutubePlayer from "react-native-youtube-iframe";

import {
  fetchMovieDetails,
  fetchMovieVideos,
  fetchSimilarMovies,
  type TMDBVideo,
} from "@/services/api";
import { fetchKinoCheckTrailers } from "@/services/kinocheck";

type TrailerVideo = TMDBVideo & {
  thumbnail?: string;
  source?: "tmdb" | "kinocheck";
};

const getBackdropUrl = (
  backdropPath?: string | null,
  posterPath?: string | null
) => {
  const imagePath = backdropPath || posterPath;

  if (!imagePath) {
    return "https://placehold.co/900x500/1a1a1a/ffffff.png";
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `https://image.tmdb.org/t/p/w780${imagePath}`;
};

const getMoviePosterUrl = (posterPath?: string | null) => {
  if (!posterPath) {
    return "https://placehold.co/500x750/1a1a1a/ffffff.png";
  }

  if (posterPath.startsWith("http")) {
    return posterPath;
  }

  return `https://image.tmdb.org/t/p/w500${posterPath}`;
};

const getTrailerThumbnail = (video: TrailerVideo) => {
  return (
    video.thumbnail || `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`
  );
};

const sortVideos = (videos: TrailerVideo[]) => {
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

    return (
      new Date(b.published_at || 0).getTime() -
      new Date(a.published_at || 0).getTime()
    );
  });
};

const MediaScreen = () => {
  const { t, i18n } = useTranslation();
  const { width } = useWindowDimensions();

  const { id, title } = useLocalSearchParams<{
    id: string;
    title?: string;
  }>();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [videos, setVideos] = useState<TrailerVideo[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTab, setSelectedTab] = useState<
    "watch" | "trailers" | "similar"
  >("watch");

  const trailerVideos = useMemo(() => {
    return sortVideos(videos);
  }, [videos]);

  const previewVideo = trailerVideos[0];

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const [movieData, similarMoviesData] = await Promise.all([
          fetchMovieDetails(String(id)),
          fetchSimilarMovies(String(id)),
        ]);

        let trailerResults = (await fetchKinoCheckTrailers(
          String(id)
        )) as TrailerVideo[];

        if (!trailerResults.length) {
          trailerResults = (await fetchMovieVideos(
            String(id)
          )) as TrailerVideo[];
        }

        setMovie(movieData);
        setVideos(trailerResults);
        setSimilarMovies(similarMoviesData);
      } catch (error) {
        console.log("Fetch media page error:", error);

        Alert.alert(
          t("movie.trailerErrorTitle"),
          t("movie.trailerErrorMessage")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, i18n.language]);

  const handlePlayFullMovie = () => {
    Alert.alert(
      t("movie.streamingUnderwayTitle"),
      t("movie.streamingUnderwayMessage")
    );
  };

  const handlePlayTrailer = (video: TrailerVideo) => {
    router.push({
      pathname: "/watch/[id]" as const,
      params: {
        id: String(id),
        videoId: video.key,
        title: video.name || movie?.title || title || t("movie.watchTrailer"),
      },
    });
  };

  const releaseYear = movie?.release_date?.split("-")[0];

  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#B954F5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 90,
        }}
      >
        <View className="bg-black pt-12 px-5 pb-3">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            className="w-11 h-11 items-center justify-center"
          >
            <Feather name="arrow-left" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        <View className="relative w-full h-[300px] bg-black overflow-hidden">
          {previewVideo?.key ? (
            <YoutubePlayer
              height={300}
              width={width}
              play
              mute
              videoId={previewVideo.key}
              initialPlayerParams={{
                controls: false,
                rel: false,
                modestbranding: true,
                loop: true,
              }}
              webViewProps={{
                mediaPlaybackRequiresUserAction: false,
              }}
              onError={(error: any) => {
                console.log("Preview video error:", error);
              }}
            />
          ) : (
            <Image
              source={{
                uri: getBackdropUrl(movie?.backdrop_path, movie?.poster_path),
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          )}

          <View className="absolute inset-0 bg-black/25" />

          <View className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">
              {previewVideo?.key ? "Preview" : "Backdrop"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handlePlayFullMovie}
            activeOpacity={0.85}
            className="absolute inset-0 items-center justify-center"
          >
            <View className="w-[76px] h-[76px] rounded-full border-2 border-white items-center justify-center bg-black/25">
              <Feather name="play" size={36} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="px-5 pt-5">
          <Text className="text-[#AB8BFF] text-base font-extrabold tracking-widest">
            MOVIEFLIX
          </Text>

          <Text className="text-white text-[34px] font-extrabold mt-1">
            {movie?.title || title || t("movie.noTitleAvailable")}
          </Text>

          <View className="flex-row items-center flex-wrap mt-3">
            {!!releaseYear && (
              <Text className="text-light-200 text-sm mr-3">{releaseYear}</Text>
            )}

            <View className="bg-[#333] px-2 py-1 rounded mr-3">
              <Text className="text-white text-xs font-bold">HD</Text>
            </View>

            <Text className="text-light-200 text-sm mr-3">
              {trailerVideos.length} {t("movie.videos")}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handlePlayFullMovie}
            activeOpacity={0.85}
            className="h-[54px] rounded-md bg-white mt-6 flex-row items-center justify-center"
          >
            <Feather name="play" size={26} color="#000" />

            <Text className="text-black text-lg font-extrabold ml-2">
              {t("movie.playMovie")}
            </Text>
          </TouchableOpacity>

          <View className="bg-[#151515] rounded-md px-4 py-4 mt-4">
            <Text className="text-white font-bold text-base">
              {t("movie.streamingUnderwayTitle")}
            </Text>

            <Text className="text-light-200 mt-2 leading-6">
              {t("movie.streamingUnderwayMessage")}
            </Text>
          </View>

          {!!movie?.overview && (
            <Text className="text-white text-base leading-7 mt-5">
              {movie.overview}
            </Text>
          )}
        </View>

        <View className="mt-7 border-b border-[#252525]">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => setSelectedTab("watch")}
              className={`pb-3 mr-8 ${
                selectedTab === "watch" ? "border-b-[3px] border-[#AB8BFF]" : ""
              }`}
            >
              <Text className="text-white font-bold text-base">
                {t("movie.watch")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedTab("trailers")}
              className={`pb-3 mr-8 ${
                selectedTab === "trailers"
                  ? "border-b-[3px] border-[#AB8BFF]"
                  : ""
              }`}
            >
              <Text className="text-white font-bold text-base">
                {t("movie.trailersMore")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedTab("similar")}
              className={`pb-3 mr-8 ${
                selectedTab === "similar"
                  ? "border-b-[3px] border-[#AB8BFF]"
                  : ""
              }`}
            >
              <Text className="text-white font-bold text-base">
                {t("movie.moreLikeThis")}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {selectedTab === "watch" && (
          <View className="px-5 pt-6">
            <View className="rounded-xl border border-[#2A2A2A] bg-[#111] p-5">
              <Text className="text-white text-xl font-extrabold">
                {t("movie.fullMovieComingSoon")}
              </Text>

              <Text className="text-light-200 mt-3 leading-6">
                {t("movie.fullMovieComingSoonMessage")}
              </Text>

              <TouchableOpacity
                onPress={() => setSelectedTab("trailers")}
                className="bg-[#AB8BFF] rounded-md py-4 mt-5 items-center"
              >
                <Text className="text-white font-extrabold text-base">
                  {t("movie.watchTrailersInstead")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {selectedTab === "trailers" && (
          <View className="px-5 pt-6">
            {trailerVideos.length === 0 ? (
              <View className="items-center justify-center py-14">
                <Text className="text-white text-lg font-bold">
                  {t("movie.noTrailerTitle")}
                </Text>

                <Text className="text-light-200 text-center mt-2">
                  {t("movie.noTrailerMessage")}
                </Text>
              </View>
            ) : (
              trailerVideos.map((video) => (
                <TouchableOpacity
                  key={video.id}
                  activeOpacity={0.85}
                  onPress={() => handlePlayTrailer(video)}
                  className="mb-8"
                >
                  <View className="w-full h-[190px] rounded-xl overflow-hidden bg-[#111]">
                    <Image
                      source={{
                        uri: getTrailerThumbnail(video),
                      }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />

                    <View className="absolute inset-0 bg-black/25 items-center justify-center">
                      <View className="w-[72px] h-[72px] rounded-full border-2 border-white items-center justify-center bg-black/25">
                        <Feather name="play" size={34} color="#fff" />
                      </View>
                    </View>

                    <View className="absolute top-3 left-3 bg-black/75 px-3 py-1 rounded-full">
                      <Text className="text-white text-xs font-bold">
                        {video.type || t("movie.video")}
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
              ))
            )}
          </View>
        )}

        {selectedTab === "similar" && (
          <View className="px-5 pt-6">
            {similarMovies.length === 0 ? (
              <View className="rounded-xl border border-[#2A2A2A] bg-[#111] p-5">
                <Text className="text-white text-xl font-extrabold">
                  {t("movie.moreLikeThis")}
                </Text>

                <Text className="text-light-200 mt-3 leading-6">
                  {t("movie.noSimilarMovies", {
                    defaultValue: "No similar movies found yet.",
                  })}
                </Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap justify-between">
                {similarMovies.map((similarMovie) => (
                  <TouchableOpacity
                    key={similarMovie.id}
                    activeOpacity={0.85}
                    onPress={() => {
                      router.push({
                        pathname: "/movie/[id]" as const,
                        params: {
                          id: String(similarMovie.id),
                        },
                      });
                    }}
                    className="w-[48%] mb-6"
                  >
                    <Image
                      source={{
                        uri: getMoviePosterUrl(similarMovie.poster_path),
                      }}
                      className="w-full h-[240px] rounded-xl bg-[#111]"
                      resizeMode="cover"
                    />

                    <Text
                      className="text-white text-sm font-bold mt-2"
                      numberOfLines={2}
                    >
                      {similarMovie.title || similarMovie.original_title}
                    </Text>

                    <Text className="text-light-200 text-xs mt-1">
                      {similarMovie.release_date?.split("-")[0] ||
                        t("movie.unknownYear")}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MediaScreen;
