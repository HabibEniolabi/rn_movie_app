import React, { useState } from "react";
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
import { movieGenres } from "@/services/genres";
import Button from "@/components/Button";

const MINIMUM_SELECTION = 3;
const MAX_DOTS = 6;

const Genres = () => {
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

  const handleStartWatching = async () => {
    if (selectedGenres.length < 3) {
      setCustomAlert({
        visible: true,
        title: "Select more genres",
        message: "Please select at least 3 genres.",
      });
      return;
    }

    const user = FIREBASE_AUTH.currentUser;

    if (!user) {
      setCustomAlert({
        visible: true,
        title: "Auth error",
        message: "No logged-in user found.",
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
        title: "Error",
        message:
          error?.message || "Could not save your genres. Please try again.",
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
            title={"What do you love? ❤️"}
            subtitle={"Pick at least 3 genres so we can personalise your feed."}
          />
          <View className="flex-row items-center justify-between mt-8">
            <Text className="text-[#8B88A8] font-semibold text-base">
              {selectedGenres.length} of {MINIMUM_SELECTION} minimum selected
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
                      ? "border-[#8B5CF6] bg-[#21102F]"
                      : "border-[#2A2845] bg-[#141325]"
                  }`}
                >
                  {isSelected && (
                    <View className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#C44CE0] items-center justify-center">
                      <Feather name="check" size={22} color="#FFFFFF" />
                    </View>
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
          {selectedGenres.length >= 3 && (
            <View className="flex-row items-center justify-center mt-4 border border-[#1D9E75] bg-[#10201F] rounded-[18px] px-4 py-4">
              <Text className="text-[#4DCFA0] text-md font-bold">
                🎉 Great picks! Your feed is almost ready.
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
                  ? "Start Watching"
                  : `Select ${MINIMUM_SELECTION} genres`
              }
              onPress={handleStartWatching}
              showArrow={canStartWatching}
              disabled={!canStartWatching}
            />
          </TouchableOpacity>

          <View className="flex-row items-center justify-center mt-8">
            <Text className="text-[#6A6880] text-lg font-semibold">
              Not sure yet?{" "}
            </Text>

            <TouchableOpacity activeOpacity={0.85} onPress={handleSkipGenres}>
              <Text className="text-[#9B59F5] text-xl font-bold">
                Skip for now
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
              <Text className="text-white font-bold text-lg">Okay</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Genres;
