import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { router } from "expo-router";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import OnboardingHeader from "@/components/OnboardingHeader";
import OnboardingHeaderInfo from "@/components/OnboardingHeaderInfo";
import { movieGenres } from "@/services/genres";

const MINIMUM_SELECTION = 3;
const MAX_DOTS = 6;

const Genres = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const handleStartWatching = async () => {
    if (selectedGenres.length < 3) {
      Alert.alert("Select more genres", "Please select at least 3 genres.");
      return;
    }

    const user = FIREBASE_AUTH.currentUser;

    if (!user) {
      Alert.alert("Auth error", "No logged-in user found.");
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

      Alert.alert(
        "Error",
        error?.message || "Could not save your genres. Please try again."
      );
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

  const canContinue = selectedGenres.length >= MINIMUM_SELECTION;

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
        </ScrollView>
      </View>
    </View>
  );
};

export default Genres;
