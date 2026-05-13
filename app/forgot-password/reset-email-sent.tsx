import {
  BackButton,
  EmailCard,
  FooterAction,
  GradientButton,
  HeadingWithEmail,
  IconCircle,
  ResendTimer,
} from "@/components/FPComponents";
import { COLORS, SPACING } from "@/services/themes";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

// ============================================================================
// CONSTANTS
// ============================================================================

const RESEND_TIMER_SECONDS = 45;
const EMAIL_PLACEHOLDER = "your email";

// ============================================================================
// TYPES
// ============================================================================

interface ResetEmailSentParams {
  email?: string;
}

// ============================================================================
// LOGIC: Timer Management Hook
// ============================================================================

const useResendTimer = (initialSeconds: number) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    secondsLeft,
    timeString: formatTime(secondsLeft),
    canResend: secondsLeft === 0,
    reset: () => setSecondsLeft(initialSeconds),
  };
};

// ============================================================================
// LOGIC: Navigation Handler
// ============================================================================

interface NavigationActions {
  handleContinue: () => void;
  handleGoBack: () => void;
  handleTryAgain: () => void;
}

const useNavigationActions = (email: string | undefined): NavigationActions => ({
  handleContinue: () => {
    router.push({
      pathname: "/forgot-password/verify",
      params: { email },
    });
  },
  handleGoBack: () => {
    router.back();
  },
  handleTryAgain: () => {
    router.back();
  },
});

// ============================================================================
// SCREEN COMPONENT
// ============================================================================

export const ResetEmailSent: React.FC = () => {
  // Extract params
  const { email } = useLocalSearchParams();
  const displayEmail = (typeof email === 'string' ? email : email?.[0]) || EMAIL_PLACEHOLDER;

  // Setup hooks
  const timer = useResendTimer(RESEND_TIMER_SECONDS);
  const navigation = useNavigationActions(displayEmail);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: COLORS.primary }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: COLORS.primary }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: SPACING.xxl,
          paddingTop: SPACING.xxxl,
          paddingBottom: SPACING.lg * 2 + SPACING.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: Back Button */}
        <BackButton onPress={navigation.handleGoBack} />

        {/* Main Content Section */}
        <View style={{ alignItems: "center" }}>
          {/* Icon Ring */}
          <IconCircle iconName="mail" />

          {/* Heading & Email Info */}
          <HeadingWithEmail
            mainText="Check your inbox!"
            labelText="We sent a reset link to"
            email={displayEmail}
          />
        </View>

        {/* Email Preview Card */}
        <EmailCard
          senderEmail="no-reply@moviestream.app"
          subject="Reset your password"
          preview="Tap the link to create a new password..."
          timestamp="Just now"
          iconName="film"
        />

        {/* Resend Timer */}
        <ResendTimer timeRemaining={timer.timeString} />

        {/* Spacer - Pushes footer to bottom */}
        <View style={{ flex: 1, minHeight: SPACING.lg }} />

        {/* Primary Action Button */}
        <GradientButton
          label="Continue"
          onPress={navigation.handleContinue}
          iconName="arrow-right"
        />

        {/* Footer Action - Try Again */}
        <FooterAction
          label="Wrong email?"
          actionText="Try again"
          onPress={navigation.handleTryAgain}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetEmailSent;