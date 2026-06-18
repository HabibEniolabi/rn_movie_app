import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";

interface ButtonProps {
  title: string;
  onPress: () => void;
  showArrow?: boolean;
  variant?: "primary" | "outline";
  disabled?: boolean;
}

const Button = ({
  title,
  onPress,
  showArrow = false,
  variant = "primary",
  disabled = false,
}: ButtonProps) => {
  const isPrimary = variant === "primary";
  const isOutline = variant === "outline";

  const borderColor = isOutline || disabled ? "#2A2845" : "transparent";

  const textColor = disabled
    ? "#8B88A8"
    : isPrimary
      ? "#FFFFFF"
      : "#6A6880";

  const content = (
    <>
      <Text
        style={[styles.title, { color: textColor }]}
        numberOfLines={1}
      >
        {title}
      </Text>

      {showArrow && !disabled && (
        <View style={styles.arrowBox}>
          <FontAwesome
            name="long-arrow-right"
            color="#ffffff"
            size={16}
          />
        </View>
      )}
    </>
  );

  return (
    <View
      style={[
        styles.wrapper,
        isPrimary && !disabled ? styles.primaryShadow : undefined,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.85}
        style={[
          styles.touchable,
          {
            borderWidth: isOutline || disabled ? 1 : 0,
            borderColor,
          },
        ]}
      >
        {isPrimary && !disabled ? (
          <LinearGradient
            colors={["#D946C4", "#9B4DFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            {content}
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.inner,
              {
                backgroundColor: disabled ? "#2A2845" : "transparent",
              },
            ]}
          >
            {content}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: 22,
  },
  primaryShadow: {
    shadowColor: "#9B59F5",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  touchable: {
    width: "100%",
    height: 64,
    borderRadius: 22,
    overflow: "hidden",
  },
  gradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 16,
  },
  inner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  arrowBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
});