import "./globals.css";

import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { onAuthStateChanged, User } from "firebase/auth";

import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { MyListProvider } from "./context/MyListContext";
import AppLoadingScreen from "@/components/SplashLoadingScreen";
import { loadSavedLanguage } from "../interfaces/i18n";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const [languageReady, setLanguageReady] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(FIREBASE_AUTH.currentUser);

  const appReady = languageReady && authReady;

  useEffect(() => {
    const setupLanguage = async () => {
      try {
        await loadSavedLanguage();
      } catch (error) {
        console.log("Error loading saved language:", error);
      } finally {
        setLanguageReady(true);
      }
    };

    setupLanguage();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!appReady) return;

    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.log("Error hiding splash screen:", error);
      }
    };

    hideSplash();
  }, [appReady]);

  const isAuthScreen = useMemo(() => {
    const firstSegment = segments[0];

    return (
      firstSegment === "(auth)" ||
      firstSegment === "login" ||
      firstSegment === "signup" ||
      firstSegment === "forgot-password" ||
      firstSegment === "onboarding"
    );
  }, [segments]);

  useEffect(() => {
    if (!appReady) return;

    if (!user && !isAuthScreen) {
      router.replace("/(auth)/login");
      return;
    }

    if (user && isAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [appReady, user, isAuthScreen, router]);

  if (!appReady) {
    return (
      <View className="flex-1 bg-primary">
        <AppLoadingScreen />
      </View>
    );
  }

  return (
    <MyListProvider>
      <View className="flex-1 bg-primary">
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "none",
            contentStyle: {
              backgroundColor: "#030014",
            },
            orientation: "portrait",
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
          <Stack.Screen name="show/[id]" />
          <Stack.Screen name="trailers/[id]" />

          <Stack.Screen
            name="watch/[id]"
            options={{
              orientation: "landscape",
            }}
          />

          <Stack.Screen name="account" />
          <Stack.Screen name="notifications" />
        </Stack>
      </View>
    </MyListProvider>
  );
}