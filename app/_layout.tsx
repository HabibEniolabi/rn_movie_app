import { Stack } from "expo-router";
import "./globals.css";
import { loadSavedLanguage } from "../interfaces/i18n";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [languageReady, setLanguageReady] = useState(false);
  
  useEffect(() => {
    const setupLanguage = async () => {
      await loadSavedLanguage();
      setLanguageReady(true);
    };

    setupLanguage();
  }, []);

  if (!languageReady) {
    return null;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="(auth)/login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(auth)/signup"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(auth)/forgot-password"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="movie/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="account"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
