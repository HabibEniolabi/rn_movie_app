import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { router } from "expo-router";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import OnboardingHeader from "@/components/OnboardingHeader";
import OnboardingHeaderInfo from "@/components/OnboardingHeaderInfo";
import { getMovieGenres, MovieGenre } from "@/services/genres";
import Button from "@/components/Button";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native";

const MINIMUM_SELECTION = 3;
const MAX_DOTS = 6;

const Genres = () => {
  const { t, i18n } = useTranslation();

  const [movieGenres, setMovieGenres] = useState<MovieGenre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const [customAlert, setCustomAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoadingGenres(true);

        const genres = await getMovieGenres(i18n.language);

        setMovieGenres(genres);
      } catch (error) {
        console.log("Fetch genres error:", error);

        setCustomAlert({
          visible: true,
          title: t("common.error"),
          message: t("onboarding.genres.fetchError", {
            defaultValue: "Could not load genres. Please try again.",
          }),
        });
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchGenres();
  }, [i18n.language, t]);

  const handleStartWatching = async () => {
    if (selectedGenres.length < MINIMUM_SELECTION) {
      setCustomAlert({
        visible: true,
        title: t("onboarding.genres.selectMoreTitle"),
        message: t("onboarding.genres.selectMoreMessage", {
          count: MINIMUM_SELECTION,
        }),
      });
      return;
    }

    const user = FIREBASE_AUTH.currentUser;

    if (!user) {
      setCustomAlert({
        visible: true,
        title: t("auth.authError"),
        message: t("auth.noLoggedInUser"),
      });
      return;
    }

    try {
      await setDoc(
        doc(FIREBASE_DB, "users", user.uid),
        {
          favouriteGenres: selectedGenres,
          onboardingCompleted: true,
          skippedGenres: false,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("Save genres error:", error);

      setCustomAlert({
        visible: true,
        title: t("common.error"),
        message: error?.message || t("onboarding.genres.saveError"),
      });
    }
  };

  const handleSkipGenres = async () => {
    const user = FIREBASE_AUTH.currentUser;

    if (!user) {
      router.replace("/(tabs)");
      return;
    }

    try {
      await setDoc(
        doc(FIREBASE_DB, "users", user.uid),
        {
          favouriteGenres: [],
          onboardingCompleted: true,
          skippedGenres: true,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("Skip genres error:", error);
      router.replace("/(tabs)");
    }
  };

  const canStartWatching = selectedGenres.length >= MINIMUM_SELECTION;

  const toggleGenre = (genreId: string) => {
    setSelectedGenres((current) => {
      if (current.includes(genreId)) {
        return current.filter((id) => id !== genreId);
      }

      return [...current, genreId];
    });
  };

  return (
    <View className="bg-primary flex-1 px-8">
      <View className="flex mt-16 flex-col">
        <OnboardingHeader step={3} />
        <ScrollView
          className="mt-8"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <OnboardingHeaderInfo
            title={t("onboarding.genres.title")}
            subtitle={t("onboarding.genres.subtitle", {
              count: MINIMUM_SELECTION,
            })}
          />
          <View className="flex-row items-center justify-between mt-8">
            <Text className="text-[#8B88A8] font-semibold text-base">
              {t("onboarding.genres.minimumSelected", {
                selected: selectedGenres.length,
                count: MINIMUM_SELECTION,
              })}
            </Text>

            <View className="flex-row items-center gap-2">
              {Array.from({ length: MAX_DOTS }).map((_, index) => {
                const isActive =
                  index < Math.min(selectedGenres.length, MAX_DOTS);

                return (
                  <View
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      isActive ? "bg-[#C44CE0]" : "bg-[#2A2845]"
                    }`}
                  />
                );
              })}
            </View>
          </View>
          {loadingGenres ? (
            <View className="items-center justify-center mt-14">
              <ActivityIndicator size="large" color="#B954F5" />

              <Text className="text-[#8B88A8] font-semibold mt-4">
                {t("onboarding.genres.loading", {
                  defaultValue: "Loading genres...",
                })}
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between mt-6">
              {movieGenres.map((genre) => {
                const isSelected = selectedGenres.includes(genre.id);

                return (
                  <TouchableOpacity
                    key={genre.id}
                    activeOpacity={0.85}
                    onPress={() => toggleGenre(genre.id)}
                    className={`w-[48%] h-[132px] rounded-[22px] border mb-5 items-center justify-center relative ${
                      isSelected
                        ? "border-[#A855F7] bg-[#21102F]"
                        : "border-[#2A2845] bg-[#141325]"
                    }`}
                  >
                    {isSelected && (
                      <LinearGradient
                        colors={["#D946C4", "#9B4DFF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          width: 36,
                          height: 36,
                          borderRadius: 999,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Feather name="check" size={22} color="#FFFFFF" />
                      </LinearGradient>
                    )}

                    <Text className="text-[34px] mb-4">{genre.icon}</Text>

                    <Text
                      className={`text-lg font-bold ${
                        isSelected ? "text-[#EDEAF8]" : "text-[#8B88A8]"
                      }`}
                    >
                      {genre.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          {selectedGenres.length >= 3 && (
            <View className="flex-row items-center justify-center mt-4 border border-[#1D9E75] bg-[#10201F] rounded-[18px] px-4 py-4">
              <Text className="text-[#4DCFA0] text-md font-bold">
                {t("onboarding.genres.greatPicks")}
              </Text>
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            className={`h-[64px] rounded-[22px] items-center justify-center flex-row gap-4 mt-8 ${
              selectedGenres.length >= 3 ? "bg-[#B954F5]" : "bg-[#2A2845]"
            }`}
          >
            <Button
              title={
                canStartWatching
                  ? t("onboarding.genres.startWatching")
                  : t("onboarding.genres.selectGenres", {
                      count: MINIMUM_SELECTION,
                    })
              }
              onPress={handleStartWatching}
              showArrow={canStartWatching}
              disabled={!canStartWatching}
            />
          </TouchableOpacity>

          <View className="flex-row items-center justify-center mt-8">
            <Text className="text-[#6A6880] text-lg font-semibold">
              {t("onboarding.genres.notSureYet")}{" "}
            </Text>

            <TouchableOpacity activeOpacity={0.85} onPress={handleSkipGenres}>
              <Text className="text-[#9B59F5] text-xl font-bold">
                {t("onboarding.genres.skipForNow")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <Modal
        visible={customAlert.visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setCustomAlert((prev) => ({ ...prev, visible: false }))
        }
      >
        <View className="flex-1 bg-black/60 items-center justify-center px-6">
          <View className="w-full rounded-[28px] bg-[#141325] border border-[#2A2845] px-6 py-6">
            <Text className="text-white text-2xl font-bold text-center">
              {customAlert.title}
            </Text>

            <Text className="text-[#8B88A8] text-base text-center leading-6 mt-4">
              {customAlert.message}
            </Text>

            <Pressable
              onPress={() =>
                setCustomAlert((prev) => ({ ...prev, visible: false }))
              }
              className="h-[52px] rounded-[16px] bg-[#B954F5] items-center justify-center mt-6"
            >
              <Text className="text-white font-bold text-lg">
                {t("common.okay")}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Genres;
