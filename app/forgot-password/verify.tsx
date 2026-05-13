/**
 * Verify Screen
 * Confirmation screen after reset email is sent
 *
 * Separation:
 * - UI: Imported reusable components only
 * - Logic: Navigation handlers
 * - Style: All styling via theme tokens
 */

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
  View
} from "react-native";

// ============================================================================
// CONSTANTS
// ============================================================================

const EMAIL_PLACEHOLDER = "your email";
const INSTRUCTIONS = "Click the link in your email to create a new password. After that, come back and sign in with your new password.";

// ============================================================================
// LOGIC: Navigation Handler
// ============================================================================

interface NavigationActions {
  handleBackToSignIn: () => void;
  handleGoBack: () => void;
  handleSendAgain: () => void;
}

const useNavigationActions = (): NavigationActions => ({
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

// ============================================================================
// SCREEN COMPONENT
// ============================================================================

export const Verify: React.FC = () => {
  // Extract params
  const { email } = useLocalSearchParams();
  const displayEmail = (email as string) || EMAIL_PLACEHOLDER;

  // Setup hooks
  const navigation = useNavigationActions();

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: COLORS.primary }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 mt-16"
          style={{ backgroundColor: COLORS.primary }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: SPACING.xxl,
            paddingTop: SPACING.md,
            paddingBottom: SPACING.lg * 2 + SPACING.md,
          }}
        >
          {/* Header: Back Button */}
          <BackButton onPress={navigation.handleGoBack} />

          {/* Main Content - Centered */}
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginTop: SPACING.xxxl,
              gap: SPACING.xl,
            }}
          >
            {/* Icon Circle */}
            <IconCircle 
              iconName="mail" 
              iconSize={56}
              iconColor={COLORS.text.primary}
            />

            {/* Heading with Email */}
            <HeadingWithEmail
              mainText="Almost done 📩"
              labelText="We sent the reset link to"
              email={displayEmail}
              emailColor="#9B59F5"
            />

            {/* Instructions */}
            <Description
              text={INSTRUCTIONS}
              color={COLORS.text.muted}
              style={{ marginTop: SPACING.md }}
            />
          </View>

          {/* Actions - Bottom */}
          <View style={{ marginTop: SPACING.lg }}>
            {/* Primary Button */}
            <GradientButton
              label="Back to Sign In"
              onPress={navigation.handleBackToSignIn}
              colors={["#E040A0", "#D946C4"]}
            />

            {/* Secondary Action */}
            <FooterAction
              label="Didn't receive it?"
              actionText="Send again"
              onPress={navigation.handleSendAgain}
              actionColor="#E040A0"
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Verify;