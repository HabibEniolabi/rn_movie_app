/**
 * Reusable UI Components
 * Pure presentation components with no business logic
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "react-native-vector-icons/Feather";
import { COLORS, RADIUS, SIZES, SPACING, TYPOGRAPHY, ANIMATIONS } from "@/services/themes";

// ============================================================================
// BACK BUTTON
// ============================================================================

interface BackButtonProps {
  onPress: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress }) => (
  <TouchableOpacity
    activeOpacity={ANIMATIONS.touchOpacitySubtle}
    onPress={onPress}
    className="self-start"
    style={{
      width: SIZES.backButton.size,
      height: SIZES.backButton.size,
      borderRadius: RADIUS.lg,
      overflow: "hidden",
      shadowColor: "#A855F7",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    }}
  >
    <LinearGradient
      colors={COLORS.gradient.purple}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
        padding: 1.4,
        borderRadius: RADIUS.lg,
      }}
    >
      <View
        style={{
          flex: 1,
          borderRadius: RADIUS.lg - 1,
          backgroundColor: COLORS.background.dark,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather name="chevron-left" size={SIZES.icon.sm} color={COLORS.text.secondary} />
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

// ============================================================================
// ICON CIRCLE (Nested gradient rings)
// ============================================================================

interface IconCircleProps {
  iconName: string;
  iconSize?: number;
  iconColor?: string;
}

export const IconCircle: React.FC<IconCircleProps> = ({
  iconName,
  iconSize = SIZES.icon.lg,
  iconColor = COLORS.text.primary,
}) => (
  <View
    style={{
      shadowColor: "#E040FB",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 12,
    }}
  >
    <View
      style={{
        width: SIZES.iconCircle.outer,
        height: SIZES.iconCircle.outer,
        borderRadius: SIZES.iconCircle.outer / 2,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: COLORS.border.highlight,
        borderStyle: "dashed",
      }}
    >
      <LinearGradient
        colors={COLORS.gradient.iconBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: SIZES.iconCircle.middle,
          height: SIZES.iconCircle.middle,
          borderRadius: SIZES.iconCircle.middle / 2,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor: COLORS.border.medium,
        }}
      >
        <LinearGradient
          colors={COLORS.gradient.accentCircle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: SIZES.iconCircle.inner,
            height: SIZES.iconCircle.inner,
            borderRadius: SIZES.iconCircle.inner / 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name={iconName} size={iconSize} color={iconColor} />
        </LinearGradient>
      </LinearGradient>
    </View>
  </View>
);

// ============================================================================
// GRADIENT BUTTON
// ============================================================================

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  iconName?: string;
  colors?: readonly [string, string, ...string[]];
  fullWidth?: boolean;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  label,
  onPress,
  iconName,
  colors,
  fullWidth = true,
}) => {
  const gradientColors = colors || (["#D946C4", "#A855F7"] as const);
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={ANIMATIONS.touchOpacity}
      style={{
        borderRadius: RADIUS.xl,
        overflow: "hidden",
        alignSelf: fullWidth ? "stretch" : "auto",
        shadowColor: "#D946C4",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 10,
      }}
    >
      <LinearGradient
        colors={gradientColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          height: SIZES.button.height,
          borderRadius: RADIUS.xl,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          paddingHorizontal: SPACING.lg,
        }}
      >
        <Text
          style={{
            color: COLORS.text.primary,
            fontWeight: "700",
            fontSize: TYPOGRAPHY.subheading.size,
            textAlignVertical: "center",
            letterSpacing: 0.5,
          }}
        >
          {label}
        </Text>
 
        {iconName && (
          <View
            style={{
              marginLeft: SPACING.md,
              width: 38,
              height: 38,
              borderRadius: RADIUS.md,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name={iconName} size={SIZES.button.iconSize} color={COLORS.text.primary} />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};
 

// ============================================================================
// HEADING WITH EMAIL
// ============================================================================

interface HeadingWithEmailProps {
  mainText: string;
  labelText: string;
  email: string;
  labelColor?: string;
  emailColor?: string;
}

export const HeadingWithEmail: React.FC<HeadingWithEmailProps> = ({
  mainText,
  labelText,
  email,
  labelColor = COLORS.text.muted,
  emailColor = COLORS.accent.purple,
}) => (
  <View style={{ alignItems: "center" }}>
    <Text
      style={{
        color: COLORS.text.primary,
        fontSize: TYPOGRAPHY.heading.size,
        fontWeight: "700",
        textAlign: "center",
        marginTop: SPACING.xl,
        letterSpacing: 0.4,
        lineHeight: 38,
      }}
    >
      {mainText}
    </Text>

    <View style={{ marginTop: SPACING.md }}>
      <Text
        style={{
          color: labelColor,
          fontSize: TYPOGRAPHY.body.size,
          textAlign: "center",
          lineHeight: TYPOGRAPHY.body.lineHeight,
          fontWeight: "400",
        }}
      >
        {labelText}
      </Text>

      <Text
        style={{
          color: emailColor,
          fontSize: TYPOGRAPHY.subheading.size,
          fontWeight: "700",
          textAlign: "center",
          marginTop: SPACING.sm,
          letterSpacing: 0.3,
        }}
      >
        {email}
      </Text>
    </View>
  </View>
);

// ============================================================================
// EMAIL PREVIEW CARD
// ============================================================================

interface EmailCardProps {
  senderEmail: string;
  subject: string;
  preview: string;
  timestamp: string;
  iconName?: string;
}

export const EmailCard: React.FC<EmailCardProps> = ({
  senderEmail,
  subject,
  preview,
  timestamp,
  iconName = "film",
}) => (
  <View
    style={{
      marginTop: SPACING.xxl,
      borderRadius: RADIUS.xl,
      borderWidth: 1,
      borderColor: COLORS.border.medium,
      backgroundColor: COLORS.background.elevated,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.md,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <LinearGradient
        colors={COLORS.gradient.iconBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: SIZES.card.height,
          height: SIZES.card.height,
          borderRadius: RADIUS.md,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#A855F7",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Feather name={iconName} size={30} color="#D7C9FF" />
      </LinearGradient>

      <View style={{ marginLeft: SPACING.md, flex: 1 }}>
        <Text
          style={{
            color: COLORS.text.muted,
            fontSize: TYPOGRAPHY.small.size,
            lineHeight: TYPOGRAPHY.small.lineHeight,
            fontWeight: "500",
          }}
        >
          From: {senderEmail}
        </Text>

        <Text
          style={{
            color: COLORS.text.primary,
            fontSize: TYPOGRAPHY.subheading.size,
            fontWeight: "700",
            marginTop: SPACING.sm,
            letterSpacing: 0.3,
          }}
        >
          {subject}
        </Text>

        <Text
          style={{
            color: COLORS.text.hint,
            fontSize: TYPOGRAPHY.small.size,
            lineHeight: TYPOGRAPHY.small.lineHeight,
            marginTop: SPACING.sm,
            fontWeight: "400",
          }}
        >
          {preview}
        </Text>
      </View>

      <Text
        style={{
          color: COLORS.text.hint,
          fontSize: TYPOGRAPHY.tiny.size,
          marginLeft: SPACING.md,
          fontWeight: "500",
        }}
      >
        {timestamp}
      </Text>
    </View>
  </View>
);

// ============================================================================
// RESEND TIMER
// ============================================================================

interface ResendTimerProps {
  timeRemaining: string;
}

export const ResendTimer: React.FC<ResendTimerProps> = ({ timeRemaining }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: SPACING.lg,
    }}
  >
    <Text
      style={{
        color: COLORS.text.muted,
        fontSize: TYPOGRAPHY.body.size,
        fontWeight: "600",
        letterSpacing: 0.3,
      }}
    >
      Didn&apos;t receive it? Resend in
    </Text>

    <View
      style={{
        marginLeft: SPACING.md,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.sm,
        borderWidth: 1.5,
        borderColor: COLORS.border.medium,
        backgroundColor: COLORS.background.elevated,
        shadowColor: "#A855F7",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Text
        style={{
          color: COLORS.accent.purple,
          fontSize: TYPOGRAPHY.subheading.size,
          fontWeight: "700",
          letterSpacing: 0.3,
          minWidth: 40,
          textAlign: "center",
        }}
      >
        {timeRemaining}
      </Text>
    </View>
  </View>
);

// ============================================================================
// FOOTER TEXT WITH ACTION
// ============================================================================

interface FooterActionProps {
  label: string;
  actionText: string;
  onPress: () => void;
  labelColor?: string;
  actionColor?: string;
}

export const FooterAction: React.FC<FooterActionProps> = ({
  label,
  actionText,
  onPress,
  labelColor = COLORS.text.muted,
  actionColor = COLORS.accent.brightPink,
}) => (
  <View
    style={{
      flexDirection: "row",
      gap: SPACING.sm,
      alignItems: "center",
      justifyContent: "center",
      marginTop: SPACING.lg,
    }}
  >
    <Text
      style={{
        fontWeight: "700",
        color: labelColor,
        fontSize: TYPOGRAPHY.body.size,
        letterSpacing: 0.2,
      }}
    >
      {label}
    </Text>

    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Text
        style={{
          color: actionColor,
          fontWeight: "700",
          fontSize: TYPOGRAPHY.subheading.size,
          letterSpacing: 0.3,
        }}
      >
        {actionText}
      </Text>
    </TouchableOpacity>
  </View>
);

// ============================================================================
// DESCRIPTION TEXT
// ============================================================================

interface DescriptionProps {
  text: string;
  color?: string;
  style?: TextStyle;
}

export const Description: React.FC<DescriptionProps> = ({
  text,
  color = COLORS.text.muted,
  style,
}) => (
  <Text
    style={[
      {
        color,
        fontSize: TYPOGRAPHY.body.size,
        lineHeight: TYPOGRAPHY.body.lineHeight,
        textAlign: "center",
        fontWeight: "400",
        letterSpacing: 0.2,
      },
      style,
    ]}
  >
    {text}
  </Text>
);