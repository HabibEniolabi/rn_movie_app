import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="plan" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="genres" />
      <Stack.Screen name="plan-comparison" />
    </Stack>
  );
}