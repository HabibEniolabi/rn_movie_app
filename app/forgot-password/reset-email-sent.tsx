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
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

const RESEND_TIMER_SECONDS = 45;

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

const useNavigationActions = (email: string) => ({
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

export const ResetEmailSent: React.FC = () => {
  const { t } = useTranslation();

  const { email } = useLocalSearchParams();

  const displayEmail =
    (typeof email === "string" ? email : email?.[0]) ||
    t("auth.emailPlaceholder");

  const timer = useResendTimer(RESEND_TIMER_SECONDS);
  const navigation = useNavigationActions(displayEmail);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: COLORS.primary }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient
        colors={["#030014", "#10071F", "#21103D", "#030014"]}
        locations={[0, 0.38, 0.75, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View
          className="absolute w-[280px] h-[280px] rounded-full -top-24 -right-24"
          style={{ backgroundColor: "rgba(217, 70, 196, 0.14)" }}
        />

        <View
          className="absolute w-[260px] h-[260px] rounded-full bottom-10 -left-28"
          style={{ backgroundColor: "rgba(155, 77, 255, 0.16)" }}
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: SPACING.xxl,
            paddingTop: SPACING.xxxl,
            paddingBottom: SPACING.lg * 2 + SPACING.md,
          }}
          showsVerticalScrollIndicator={false}
        >
          <BackButton onPress={navigation.handleGoBack} />

          <View style={{ alignItems: "center", marginTop: SPACING.xxl }}>
            <IconCircle iconName="mail" />

            <HeadingWithEmail
              mainText={t("auth.resetEmailSentTitle")}
              labelText={t("auth.resetEmailSentLabel")}
              email={displayEmail}
            />

            <Text className="text-[#8B88A8] text-center text-base leading-7 mt-5 px-3">
              {t("auth.resetEmailSentHint")}
            </Text>
          </View>

          <View className="mt-8">
            <EmailCard
              senderEmail="no-reply@moviestream.app"
              subject={t("auth.resetEmailSubject")}
              preview={t("auth.resetEmailPreview")}
              timestamp={t("auth.justNow")}
              iconName="film"
            />
          </View>

          <ResendTimer timeRemaining={timer.timeString} />

          <View style={{ flex: 1, minHeight: SPACING.lg }} />

          <GradientButton
            label={t("common.continue")}
            onPress={navigation.handleContinue}
            iconName="arrow-right"
          />

          <FooterAction
            label={t("auth.wrongEmail")}
            actionText={t("auth.tryAgain")}
            onPress={navigation.handleTryAgain}
          />
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default ResetEmailSent;