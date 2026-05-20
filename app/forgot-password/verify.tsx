import {
  BackButton,
  Description,
  FooterAction,
  GradientButton,
  HeadingWithEmail,
  IconCircle,
} from "@/components/FPComponents";
import { COLORS, SPACING } from "@/services/themes";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

const useNavigationActions = () => ({
  handleBackToSignIn: () => {
    router.replace("/login");
  },
  handleGoBack: () => {
    router.back();
  },
  handleSendAgain: () => {
    router.replace("/forgot-password");
  },
});

export const Verify: React.FC = () => {
  const { t } = useTranslation();

  const { email } = useLocalSearchParams();

  const displayEmail =
    (typeof email === "string" ? email : email?.[0]) ||
    t("auth.emailPlaceholder");

  const navigation = useNavigationActions();

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: COLORS.primary }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            className="flex-1 mt-16"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: SPACING.xxl,
              paddingTop: SPACING.md,
              paddingBottom: SPACING.lg * 2 + SPACING.md,
            }}
          >
            <BackButton onPress={navigation.handleGoBack} />

            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: SPACING.xxxl,
                gap: SPACING.xl,
              }}
            >
              <IconCircle
                iconName="mail"
                iconSize={56}
                iconColor={COLORS.text.primary}
              />

              <HeadingWithEmail
                mainText={t("auth.almostDoneTitle")}
                labelText={t("auth.resetLinkSentTo")}
                email={displayEmail}
                emailColor="#9B59F5"
              />

              <Description
                text={t("auth.resetInstructions")}
                color={COLORS.text.muted}
                style={{ marginTop: SPACING.md }}
              />
            </View>

            <View style={{ flex: 1, minHeight: SPACING.xxxl }} />

            <View style={{ marginTop: SPACING.lg }}>
              <GradientButton
                label={t("auth.backToSignIn")}
                onPress={navigation.handleBackToSignIn}
                colors={["#E040A0", "#D946C4"]}
              />

              <FooterAction
                label={t("auth.didNotReceiveIt")}
                actionText={t("auth.sendAgain")}
                onPress={navigation.handleSendAgain}
                actionColor="#E040A0"
              />
            </View>
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Verify;