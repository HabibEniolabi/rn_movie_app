import "./globals.css";

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View } from "react-native";

import { loadSavedLanguage } from "../interfaces/i18n";
import AppLoadingScreen from "@/components/ApploadingScreen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [languageReady, setLanguageReady] = useState(false);

  useEffect(() => {
    const setupApp = async () => {
      try {
        await loadSavedLanguage();
      } catch (error) {
        console.log("Error loading saved language:", error);
      } finally {
        setLanguageReady(true);
        await SplashScreen.hideAsync();
      }
    };

    setupApp();
  }, []);

  if (!languageReady) {
    return (
      <View className="flex-1 bg-primary">
        <AppLoadingScreen />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
          contentStyle: {
            backgroundColor: "#030014",
          },
        }}
      >
        <Stack.Screen name="index" />

        <Stack.Screen name="(auth)/login" />

        <Stack.Screen name="(auth)/signup" />

        <Stack.Screen name="onboarding" />

        <Stack.Screen name="(auth)/forgot-password" />

        <Stack.Screen name="forgot-password" />

        <Stack.Screen name="(tabs)" />

        <Stack.Screen name="movie/[id]" />

        <Stack.Screen name="watch/[id]" />

        <Stack.Screen name="account" />
      </Stack>
    </View>
  );
}