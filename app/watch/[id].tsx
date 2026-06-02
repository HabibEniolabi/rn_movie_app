import React, { useCallback, useEffect, useRef, useState } from "react";
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

const getProgressKey = (videoId: string) => `youtube_clip_progress_${videoId}`;

const formatTime = (seconds: number) => {
  if (!seconds || Number.isNaN(seconds)) return "0:00";

  const totalSeconds = Math.floor(seconds);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const WatchClipScreen = () => {
  const { t, i18n } = useTranslation();
  const { width, height } = useWindowDimensions();

  const { videoId, title } = useLocalSearchParams<{
    id: string;
    videoId: string;
    title: string;
  }>();

  const playerRef = useRef<YoutubeIframeRef>(null);
  const hideControlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

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
    if (!videoId) return;

    try {
      const time = await playerRef.current?.getCurrentTime();

      if (typeof time === "number" && time > 0) {
        await AsyncStorage.setItem(
          getProgressKey(videoId),
          String(Math.floor(time))
        );
      }
    } catch (error) {
      console.log("Save clip progress error:", error);
    }
  }, [videoId]);

  useEffect(() => {
    const loadProgress = async () => {
      if (!videoId) {
        setLoadingProgress(false);
        return;
      }

      try {
        const savedTime = await AsyncStorage.getItem(getProgressKey(videoId));

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
  }, [videoId]);

  useEffect(() => {
    if (!videoId) return;

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
            getProgressKey(videoId),
            String(Math.floor(time))
          );
        }
      } catch (error) {
        console.log("Track video progress error:", error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [videoId, playing]);

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

      if (videoId) {
        await AsyncStorage.removeItem(getProgressKey(videoId));
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

      if (videoId) {
        await AsyncStorage.setItem(
          getProgressKey(videoId),
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

    if (videoId) {
      await AsyncStorage.setItem(
        getProgressKey(videoId),
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

    // YouTube captions are applied from initialPlayerParams,
    // so remount the player to apply the selected caption language.
    setPlayerKey((prev) => prev + 1);
  };

  if (!videoId) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-6">
        <Text className="text-white text-center text-lg font-bold">
          {t("movie.noTrailerMessage")}
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-white px-6 py-3 rounded-full"
        >
          <Text className="text-black font-bold">{t("movie.goBack")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loadingProgress) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#B954F5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 items-center justify-center bg-black">
        <YoutubePlayer
          key={`${videoId}-${playerKey}`}
          ref={playerRef}
          height={videoHeight}
          width={width}
          play={playing}
          videoId={videoId}
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
            <ActivityIndicator size="large" color="#B954F5" />
          </View>
        )}

        <Pressable onPress={handleScreenPress} className="absolute inset-0" />

        {controlsVisible && (
          <View className="absolute inset-0 bg-black/45">
            <View className="pt-12 px-5 flex-row items-center justify-between">
              <TouchableOpacity
                onPress={handleClose}
                className="w-11 h-11 items-center justify-center"
              >
                <Feather name="arrow-left" size={34} color="#fff" />
              </TouchableOpacity>

              <Text
                className="text-white text-lg font-bold flex-1 text-center mx-5"
                numberOfLines={1}
              >
                {title || t("movie.watchTrailer")}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setLocked((prev) => !prev);
                  setControlsVisible(true);
                }}
                className="w-11 h-11 items-center justify-center"
              >
                <Feather
                  name={locked ? "lock" : "unlock"}
                  size={30}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            {!locked && (
              <>
                <View className="flex-1 flex-row items-center justify-center gap-20">
                  <TouchableOpacity
                    onPress={() => handleSeek(-10)}
                    className="w-20 h-20 rounded-full bg-black/30 items-center justify-center"
                  >
                    <Text className="text-white text-xl font-bold">↺10</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handlePlayPause}
                    className="w-24 h-24 rounded-full bg-white/15 items-center justify-center"
                  >
                    <Feather
                      name={playing ? "pause" : "play"}
                      size={58}
                      color="#fff"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleSeek(10)}
                    className="w-20 h-20 rounded-full bg-black/30 items-center justify-center"
                  >
                    <Text className="text-white text-xl font-bold">10↻</Text>
                  </TouchableOpacity>
                </View>

                <View className="px-8 pb-8">
                  <View className="flex-row items-center">
                    <Text className="text-white text-sm w-[48px]">
                      {formatTime(currentTime)}
                    </Text>

                    <Slider
                      style={{ flex: 1, height: 36 }}
                      minimumValue={0}
                      maximumValue={duration || 1}
                      value={currentTime}
                      minimumTrackTintColor="#E50914"
                      maximumTrackTintColor="rgba(255,255,255,0.35)"
                      thumbTintColor="#E50914"
                      onSlidingComplete={handleSliderComplete}
                    />

                    <Text className="text-white text-sm w-[48px] text-right">
                      {formatTime(duration)}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-center gap-12 mt-4">
                    <TouchableOpacity
                      onPress={() => setShowSpeedModal(true)}
                      className="flex-row items-center gap-2"
                    >
                      <Feather name="sliders" size={22} color="#fff" />
                      <Text className="text-white font-bold">
                        {t("movie.speed", { defaultValue: "Speed" })} (
                        {playbackRate}x)
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setShowSubtitleModal(true)}
                      className="flex-row items-center gap-2"
                    >
                      <Feather name="message-square" size={22} color="#fff" />
                      <Text className="text-white font-bold">
                        {t("movie.audioSubtitles", {
                          defaultValue: "Audio & Subtitles",
                        })}
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
            <Text className="text-white text-xl font-bold mb-5">
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
                  <Feather name="check" size={22} color="#E50914" />
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
            <Text className="text-white text-xl font-bold mb-5">
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
                  <Feather name="check" size={22} color="#E50914" />
                )}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default WatchClipScreen;