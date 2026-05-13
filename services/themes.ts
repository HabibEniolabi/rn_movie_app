/**
 * Design System - Theme Constants
 * Centralized styling tokens for consistent UI across the app
 */

export const COLORS = {
  // Primary
  primary: "#0A0814",
  primaryLight: "#12101F",
  primaryLighter: "#1A1629",

  // Backgrounds
  background: {
    dark: "#0A0814",
    card: "#0F0D1B",
    hover: "#141221",
    elevated: "#151329",
  },

  // Gradients
  gradient: {
    purple: ["#4C2D7F", "#2A1B4D"] as const,
    iconBg: ["#5C3E9C", "#3D2466"] as const,
    button: ["#D946C4", "#A855F7"] as const,
    accentCircle: ["#E040FB", "#A855F7"] as const,
    buttonHover: ["#E040FB", "#B566FF"] as const,
  },

  // Text
  text: {
    primary: "#F5F3FF",
    secondary: "#B8B3D8",
    tertiary: "#9B96B8",
    muted: "#8A859C",
    hint: "#76718A",
  },

  // Accents
  accent: {
    purple: "#B566FF",
    pink: "#E040FB",
    brightPink: "#F54FB0",
    neon: "#A855F7",
  },

  // Borders
  border: {
    subtle: "#1F1B33",
    medium: "#3B2E5C",
    highlight: "#6B4FA0",
  },

  // Semantic
  error: "#FF6B9D",
  success: "#00D084",
  warning: "#FFB347",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 64,
};

export const RADIUS = {
  sm: 12,
  md: 14,
  lg: 18,
  xl: 22,
};

export const TYPOGRAPHY = {
  heading: {
    size: 30,
    weight: "700" as const,
    lineHeight: 36,
  },
  subheading: {
    size: 18,
    weight: "700" as const,
    lineHeight: 22,
  },
  body: {
    size: 17,
    weight: "400" as const,
    lineHeight: 24,
  },
  small: {
    size: 14,
    weight: "400" as const,
    lineHeight: 20,
  },
  tiny: {
    size: 13,
    weight: "400" as const,
    lineHeight: 18,
  },
};

export const SIZES = {
  icon: {
    xs: 22,
    sm: 26,
    md: 30,
    lg: 34,
    xl: 56,
  },
  button: {
    height: 62,
    iconSize: 22,
  },
  backButton: {
    size: 56,
    radius: 18,
  },
  iconCircle: {
    outer: 150,
    middle: 122,
    inner: 76,
  },
  card: {
    height: 68,
    radius: 18,
  },
};

export const ANIMATIONS = {
  touchOpacity: 0.88,
  touchOpacitySubtle: 0.9,
};