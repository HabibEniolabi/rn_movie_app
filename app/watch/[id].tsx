import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import YoutubePlayer, {
  YoutubeIframeRef,
} from "react-native-youtube-iframe";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import Feather from "react-native-vector-icons/Feather";
import { useTranslation } from "react-i18next";
import { fetchMovieDetails, fetchTVDetails } from "@/services/api";

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const SUBTITLE_OPTIONS = [
  { label: "Off", value: "" },
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "Spanish", value: "es" },
  { label: "German", value: "de" },
  { label: "Portuguese", value: "pt" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Arabic", value: "ar" },
];

type MediaType = "movie" | "tv";

const getProgressKey = (videoId: string) => `youtube_clip_progress_${videoId}`;

const getParamValue = (value?: string | string[]) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

const formatTime = (seconds: number) => {
  if (!seconds || Number.isNaN(seconds)) return "0:00";

  const totalSeconds = Math.floor(seconds);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const getBestYouTubeVideo = (videos: any[] = []) => {
  const youtubeVideos = videos.filter((video) => video.site === "YouTube");

  return (
    youtubeVideos.find((video) => video.type === "Trailer") ||
    youtubeVideos.find((video) => video.type === "Teaser") ||
    youtubeVideos.find((video) => video.type === "Clip") ||
    youtubeVideos[0]
  );
};

const WatchScreen = () => {
  const { t, i18n } = useTranslation();
  const { width, height } = useWindowDimensions();

  const params = useLocalSearchParams<{
    id: string;
    mediaType?: MediaType;
    title?: string;
    videoId?: string;
  }>();

  const id = getParamValue(params.id);
  const routeVideoId = getParamValue(params.videoId);
  const routeTitle = getParamValue(params.title);
  const mediaType: MediaType = params.mediaType === "tv" ? "tv" : "movie";

  const playerRef = useRef<YoutubeIframeRef>(null);
  const hideControlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const [resolvedVideoId, setResolvedVideoId] = useState(routeVideoId || "");
  const [resolvedTitle, setResolvedTitle] = useState(routeTitle || "");
  const [contentLoading, setContentLoading] = useState(true);

  const [playing, setPlaying] = useState(true);
  const [ready, setReady] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [locked, setLocked] = useState(false);

  const [startTime, setStartTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(true);

  const [playbackRate, setPlaybackRate] = useState(1);
  const [captionLanguage, setCaptionLanguage] = useState(
    i18n.language?.split("-")[0] || "en"
  );

  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const [showSubtitleModal, setShowSubtitleModal] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);

  const activeVideoId = resolvedVideoId || routeVideoId || "";
  const displayTitle =
    resolvedTitle ||
    routeTitle ||
    t("movie.watchTrailer", { defaultValue: "Watch Trailer" });

  const videoHeight = height;

  const clearHideControlsTimer = () => {
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
  };

  const scheduleHideControls = useCallback(() => {
    clearHideControlsTimer();

    if (!playing || locked) return;

    hideControlsTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3500);
  }, [playing, locked]);

  const saveProgress = useCallback(async () => {
    if (!activeVideoId) return;

    try {
      const time = await playerRef.current?.getCurrentTime();

      if (typeof time === "number" && time > 0) {
        await AsyncStorage.setItem(
          getProgressKey(activeVideoId),
          String(Math.floor(time))
        );
      }
    } catch (error) {
      console.log("Save clip progress error:", error);
    }
  }, [activeVideoId]);

  useEffect(() => {
    let isMounted = true;

    const resolveVideo = async () => {
      setContentLoading(true);
      setReady(false);
      setPlaying(true);
      setControlsVisible(true);
      setStartTime(0);
      setCurrentTime(0);
      setDuration(0);

      try {
        if (routeVideoId) {
          if (!isMounted) return;

          setResolvedVideoId(routeVideoId);
          setResolvedTitle(routeTitle || "");
          setContentLoading(false);
          return;
        }

        if (!id) {
          if (!isMounted) return;

          setResolvedVideoId("");
          setResolvedTitle("");
          setContentLoading(false);
          return;
        }

        const details =
          mediaType === "tv"
            ? await fetchTVDetails(String(id))
            : await fetchMovieDetails(String(id));

        const selectedVideo = getBestYouTubeVideo(details?.videos?.results);

        if (!isMounted) return;

        setResolvedVideoId(selectedVideo?.key || "");
        setResolvedTitle(
          routeTitle ||
            details?.title ||
            details?.name ||
            details?.original_title ||
            details?.original_name ||
            ""
        );
      } catch (error) {
        console.log("Resolve watch video error:", error);

        if (isMounted) {
          setResolvedVideoId("");
          setResolvedTitle(routeTitle || "");
        }
      } finally {
        if (isMounted) {
          setContentLoading(false);
        }
      }
    };

    resolveVideo();

    return () => {
      isMounted = false;
    };
  }, [id, mediaType, routeVideoId, routeTitle]);

  useEffect(() => {
    const loadProgress = async () => {
      if (contentLoading) return;

      if (!activeVideoId) {
        setLoadingProgress(false);
        return;
      }

      setLoadingProgress(true);

      try {
        const savedTime = await AsyncStorage.getItem(
          getProgressKey(activeVideoId)
        );

        if (savedTime) {
          const parsedTime = Number(savedTime);

          if (!Number.isNaN(parsedTime) && parsedTime > 5) {
            setStartTime(parsedTime);
            setCurrentTime(parsedTime);
          }
        }
      } catch (error) {
        console.log("Load clip progress error:", error);
      } finally {
        setLoadingProgress(false);
      }
    };

    loadProgress();

    return () => {
      clearHideControlsTimer();
    };
  }, [activeVideoId, contentLoading]);

  useEffect(() => {
    if (!activeVideoId) return;

    const interval = setInterval(async () => {
      try {
        const time = await playerRef.current?.getCurrentTime();
        const videoDuration = await playerRef.current?.getDuration();

        if (typeof time === "number") {
          setCurrentTime(time);
        }

        if (typeof videoDuration === "number") {
          setDuration(videoDuration);
        }

        if (playing && typeof time === "number" && time > 0) {
          await AsyncStorage.setItem(
            getProgressKey(activeVideoId),
            String(Math.floor(time))
          );
        }
      } catch (error) {
        console.log("Track video progress error:", error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeVideoId, playing]);

  useEffect(() => {
    if (controlsVisible) {
      scheduleHideControls();
    }
  }, [controlsVisible, scheduleHideControls]);

  const handleScreenPress = () => {
    if (locked) {
      setControlsVisible(true);
      scheduleHideControls();
      return;
    }

    setControlsVisible((prev) => !prev);
  };

  const handleStateChange = async (state: string) => {
    if (state === "playing") {
      setPlaying(true);
      scheduleHideControls();
    }

    if (state === "paused") {
      setPlaying(false);
      setControlsVisible(true);
      await saveProgress();
    }

    if (state === "ended") {
      setPlaying(false);
      setControlsVisible(true);

      if (activeVideoId) {
        await AsyncStorage.removeItem(getProgressKey(activeVideoId));
      }
    }
  };

  const handleClose = async () => {
    await saveProgress();
    router.back();
  };

  const handlePlayPause = () => {
    setPlaying((prev) => !prev);
    setControlsVisible(true);
    scheduleHideControls();
  };

  const handleSeek = async (seconds: number) => {
    try {
      const time = await playerRef.current?.getCurrentTime();

      if (typeof time !== "number") return;

      const nextTime = Math.max(0, Math.min(duration || 0, time + seconds));

      playerRef.current?.seekTo(nextTime, true);
      setCurrentTime(nextTime);

      if (activeVideoId) {
        await AsyncStorage.setItem(
          getProgressKey(activeVideoId),
          String(Math.floor(nextTime))
        );
      }

      scheduleHideControls();
    } catch (error) {
      console.log("Seek error:", error);
    }
  };

  const handleSliderComplete = async (value: number) => {
    playerRef.current?.seekTo(value, true);
    setCurrentTime(value);

    if (activeVideoId) {
      await AsyncStorage.setItem(
        getProgressKey(activeVideoId),
        String(Math.floor(value))
      );
    }

    scheduleHideControls();
  };

  const handleChangeSubtitle = async (language: string) => {
    const time = await playerRef.current?.getCurrentTime();

    if (typeof time === "number") {
      setStartTime(Math.floor(time));
      setCurrentTime(time);
    }

    setCaptionLanguage(language);
    setShowSubtitleModal(false);
    setPlayerKey((prev) => prev + 1);
  };

  if (contentLoading || loadingProgress) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#AB8BFF" />

        <Text className="text-white font-bold mt-4">
          {t("movie.loadingVideo", { defaultValue: "Loading video..." })}
        </Text>
      </View>
    );
  }

  if (!activeVideoId) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-6">
        <View className="w-20 h-20 rounded-full bg-white/10 items-center justify-center mb-6">
          <Feather name="video-off" size={36} color="#AB8BFF" />
        </View>

        <Text className="text-white text-center text-xl font-extrabold">
          {t("movie.noTrailerTitle", { defaultValue: "No video found" })}
        </Text>

        <Text className="text-light-200 text-center text-sm leading-6 mt-3">
          {t("movie.noTrailerMessage", {
            defaultValue:
              "No trailer or official clip is available for this title yet.",
          })}
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-8 bg-white px-7 py-4 rounded-full"
        >
          <Text className="text-black font-extrabold">
            {t("movie.goBack", { defaultValue: "Go back" })}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 items-center justify-center bg-black">
        <YoutubePlayer
          key={`${activeVideoId}-${playerKey}`}
          ref={playerRef}
          height={videoHeight}
          width={width}
          play={playing}
          videoId={activeVideoId}
          playbackRate={playbackRate}
          onReady={() => {
            setReady(true);
            scheduleHideControls();
          }}
          onChangeState={handleStateChange}
          onError={(error: any) => {
            console.log("YouTube player error:", error);
          }}
          initialPlayerParams={{
            start: startTime,
            controls: false,
            rel: false,
            modestbranding: true,
            showClosedCaptions: !!captionLanguage,
            cc_lang_pref: captionLanguage || undefined,
            playerLang: captionLanguage || "en",
          }}
          webViewProps={{
            allowsFullscreenVideo: true,
          }}
        />

        {!ready && (
          <View className="absolute inset-0 bg-black items-center justify-center">
            <ActivityIndicator size="large" color="#AB8BFF" />
          </View>
        )}

        <Pressable onPress={handleScreenPress} className="absolute inset-0" />

        {controlsVisible && (
          <View className="absolute inset-0 bg-black/45">
            <View className="pt-12 px-5 flex-row items-center justify-between">
              <TouchableOpacity
                onPress={handleClose}
                className="w-11 h-11 rounded-full bg-black/30 items-center justify-center"
              >
                <Feather name="arrow-left" size={28} color="#fff" />
              </TouchableOpacity>

              <View className="flex-1 mx-5">
                <Text
                  className="text-white text-lg font-extrabold text-center"
                  numberOfLines={1}
                >
                  {displayTitle}
                </Text>

                <Text className="text-light-200 text-xs font-bold text-center mt-1">
                  {mediaType === "tv"
                    ? t("details.tvShow", { defaultValue: "TV Show" })
                    : t("movie.movie", { defaultValue: "Movie" })}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setLocked((prev) => !prev);
                  setControlsVisible(true);
                }}
                className="w-11 h-11 rounded-full bg-black/30 items-center justify-center"
              >
                <Feather
                  name={locked ? "lock" : "unlock"}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            {!locked && (
              <>
                <View className="flex-1 flex-row items-center justify-center gap-16">
                  <TouchableOpacity
                    onPress={() => handleSeek(-10)}
                    className="w-20 h-20 rounded-full bg-black/40 items-center justify-center"
                  >
                    <Text className="text-white text-xl font-extrabold">
                      ↺10
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handlePlayPause}
                    className="w-24 h-24 rounded-full bg-white/20 items-center justify-center"
                  >
                    <Feather
                      name={playing ? "pause" : "play"}
                      size={58}
                      color="#fff"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleSeek(10)}
                    className="w-20 h-20 rounded-full bg-black/40 items-center justify-center"
                  >
                    <Text className="text-white text-xl font-extrabold">
                      10↻
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="px-8 pb-8">
                  <View className="flex-row items-center">
                    <Text className="text-white text-sm font-bold w-[50px]">
                      {formatTime(currentTime)}
                    </Text>

                    <Slider
                      style={{ flex: 1, height: 36 }}
                      minimumValue={0}
                      maximumValue={duration || 1}
                      value={currentTime}
                      minimumTrackTintColor="#AB8BFF"
                      maximumTrackTintColor="rgba(255,255,255,0.35)"
                      thumbTintColor="#AB8BFF"
                      onSlidingComplete={handleSliderComplete}
                    />

                    <Text className="text-white text-sm font-bold w-[50px] text-right">
                      {formatTime(duration)}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-center gap-10 mt-4">
                    <TouchableOpacity
                      onPress={() => setShowSpeedModal(true)}
                      className="flex-row items-center gap-2"
                    >
                      <Feather name="sliders" size={21} color="#fff" />

                      <Text className="text-white font-bold">
                        {t("movie.speed", { defaultValue: "Speed" })}{" "}
                        {playbackRate}x
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setShowSubtitleModal(true)}
                      className="flex-row items-center gap-2"
                    >
                      <Feather name="message-square" size={21} color="#fff" />

                      <Text className="text-white font-bold">
                        {t("movie.subtitles", { defaultValue: "Subtitles" })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        )}
      </View>

      <Modal
        visible={showSpeedModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSpeedModal(false)}
      >
        <Pressable
          onPress={() => setShowSpeedModal(false)}
          className="flex-1 bg-black/70 items-center justify-center px-6"
        >
          <Pressable className="w-full max-w-[360px] bg-[#151515] rounded-3xl p-5">
            <Text className="text-white text-xl font-extrabold mb-5">
              {t("movie.playbackSpeed", {
                defaultValue: "Playback Speed",
              })}
            </Text>

            {SPEED_OPTIONS.map((speed) => (
              <TouchableOpacity
                key={speed}
                onPress={() => {
                  setPlaybackRate(speed);
                  setShowSpeedModal(false);
                }}
                className="flex-row items-center justify-between py-4"
              >
                <Text className="text-white text-base font-semibold">
                  {speed}x
                </Text>

                {playbackRate === speed && (
                  <Feather name="check" size={22} color="#AB8BFF" />
                )}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showSubtitleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSubtitleModal(false)}
      >
        <Pressable
          onPress={() => setShowSubtitleModal(false)}
          className="flex-1 bg-black/70 items-center justify-center px-6"
        >
          <Pressable className="w-full max-w-[380px] bg-[#151515] rounded-3xl p-5">
            <Text className="text-white text-xl font-extrabold mb-5">
              {t("movie.audioSubtitles", {
                defaultValue: "Audio & Subtitles",
              })}
            </Text>

            <Text className="text-light-200 font-bold mb-2">
              {t("movie.subtitles", { defaultValue: "Subtitles" })}
            </Text>

            {SUBTITLE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value || "off"}
                onPress={() => handleChangeSubtitle(option.value)}
                className="flex-row items-center justify-between py-4"
              >
                <Text className="text-white text-base font-semibold">
                  {option.label}
                </Text>

                {captionLanguage === option.value && (
                  <Feather name="check" size={22} color="#AB8BFF" />
                )}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default WatchScreen;