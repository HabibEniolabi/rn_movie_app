import { Stack } from "expo-router";

export default function ForgetPasswordLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="forgot-password-reset" />
      <Stack.Screen name="reset-email-sent" />
      <Stack.Screen name="verify" />
    </Stack>
  );
}