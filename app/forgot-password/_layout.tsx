import { Stack } from "expo-router";

export default function ForgetPasswordLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="old-password" />
      <Stack.Screen name="new-password" />
      <Stack.Screen name="verify" />
    </Stack>
  );
}