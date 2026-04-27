import { Stack } from "expo-router";
import "./globals.css";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true} />
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
      </Stack>
    </>
  );
}
