import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { confirmPasswordReset } from "firebase/auth";

const Verify = () => {
  const { oobCode, email } = useLocalSearchParams<{ 
    oobCode?: string;
    email?: string;
  }>();
  const auth = FIREBASE_AUTH;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [customAlert, setCustomAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type?: "error" | "success" | "info";
  }>({
    visible: false,
    title: "",
    message: "",
    type: "error",
  });

  const passwordRequirements = {
    minLength: newPassword.length >= 8,
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasNumberOrSymbol: /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      newPassword
    ),
    passwordsMatch: newPassword && confirmPassword && newPassword === confirmPassword,
  };

  const allRequirementsMet =
    passwordRequirements.minLength &&
    passwordRequirements.hasUpperCase &&
    passwordRequirements.hasNumberOrSymbol &&
    passwordRequirements.passwordsMatch;

  const getPasswordStrength = () => {
    let strength = 0;
    if (newPassword.length >= 8) strength += 25;
    if (newPassword.length >= 12) strength += 10;
    if (/[A-Z]/.test(newPassword)) strength += 20;
    if (/[a-z]/.test(newPassword)) strength += 15;
    if (/[0-9]/.test(newPassword)) strength += 15;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) strength += 15;
    return Math.min(strength, 100);
  };

  const getStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength < 50) return "#FF6B6B";
    if (strength < 75) return "#FFA500";
    return "#10B981";
  };

  const getStrengthLabel = () => {
    const strength = getPasswordStrength();
    if (strength < 50) return "Weak password";
    if (strength < 75) return "Medium password";
    return "Strong password";
  };

  const handleResetPassword = async () => {
    if (!oobCode) {
      setCustomAlert({
        visible: true,
        title: "Invalid Code",
        message: "The reset code is invalid or has expired. Please request a new one.",
        type: "error",
      });
      return;
    }

    if (!newPassword.trim()) {
      setCustomAlert({
        visible: true,
        title: "Missing Password",
        message: "Please enter your new password.",
        type: "error",
      });
      return;
    }

    if (!confirmPassword.trim()) {
      setCustomAlert({
        visible: true,
        title: "Confirm Password",
        message: "Please confirm your new password.",
        type: "error",
      });
      return;
    }

    if (!allRequirementsMet) {
      setCustomAlert({
        visible: true,
        title: "Weak Password",
        message: "Your password doesn't meet all requirements. Please check the criteria below.",
        type: "error",
      });
      return;
    }

    try {
      setIsResetting(true);
      
      await confirmPasswordReset(auth, oobCode, newPassword.trim());

      setCustomAlert({
        visible: true,
        title: "Success!",
        message: "Your password has been reset successfully. You can now sign in with your new password.",
        type: "success",
      });

      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    } catch (error: any) {
      let errorMessage = "Failed to reset password. Please try again.";

      if (error?.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error?.code === "auth/invalid-action-code") {
        errorMessage = "This reset code has expired. Please request a new password reset.";
      } else if (error?.code === "auth/operation-not-allowed") {
        errorMessage = "Password reset is not enabled for this account.";
      } else if (error?.code === "auth/expired-action-code") {
        errorMessage = "The reset code has expired. Please try again.";
      }

      setCustomAlert({
        visible: true,
        title: "Reset Failed",
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="bg-primary flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          className="flex-1 bg-primary"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 32, paddingTop: 20, paddingBottom: 40 }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.back()}
            className="p-2 rounded-[12px] border border-[#2A2845] bg-dark-300 items-center justify-center self-start"
          >
            <Feather name="chevron-left" size={24} color="#8B88A8" />
          </TouchableOpacity>

          <View className="flex-col items-center justify-center mt-12 gap-6">
            <View className="bg-[#2A2845] rounded-full px-4 py-2 justify-start">
              <Text className="text-[#10B981] font-bold text-sm">
                ✓ Code verified
              </Text>
            </View>

            <View className="flex-col gap-6 items-center">
              <Text className="text-white text-3xl text-center font-bold">
                Create new password 🔒
              </Text>
              <Text className="text-dark-500 text-base leading-6 text-center">
                Your new password must be different from previously used passwords.
              </Text>
            </View>
          </View>

          {/* New Password Field */}
          <View className="flex flex-col gap-2 mt-8">
            <Text className="text-md text-[#6A6880] font-bold">
              New password
            </Text>
            <View className="flex-row items-center rounded-[14px] border border-[#2A2845] bg-[#141325] px-6 h-[52px]">
              <Feather name="lock" size={18} color="#3A3858" />
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#3A3858"
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
                className="ml-5 flex-1 text-[#EDEAF8] text-lg font-semibold"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                activeOpacity={0.7}
              >
                <Feather
                  name={showNewPassword ? "eye" : "eye-off"}
                  size={18}
                  color="#3A3858"
                />
              </TouchableOpacity>
            </View>

            {/* Password Strength Indicator */}
            {newPassword.length > 0 && (
              <View className="gap-2 mt-3">
                <View className="flex-row items-center gap-2">
                  <View className="flex-1 h-1 bg-[#2A2845] rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${getPasswordStrength()}%`,
                        backgroundColor: getStrengthColor(),
                      }}
                    />
                  </View>
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: getStrengthColor() }}
                  >
                    {getPasswordStrength()}%
                  </Text>
                </View>
                <Text
                  className="text-xs font-semibold"
                  style={{ color: getStrengthColor() }}
                >
                  {getStrengthLabel()}
                </Text>
              </View>
            )}
          </View>

          {/* Confirm Password Field */}
          <View className="flex flex-col gap-2 mt-6">
            <Text className="text-md text-[#6A6880] font-bold">
              Confirm new password
            </Text>
            <View className="flex-row items-center rounded-[14px] border border-[#2A2845] bg-[#141325] px-6 h-[52px]">
              <Feather name="lock" size={18} color="#3A3858" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor="#3A3858"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                className="ml-5 flex-1 text-[#EDEAF8] text-lg font-semibold"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                activeOpacity={0.7}
              >
                <Feather
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={18}
                  color="#3A3858"
                />
              </TouchableOpacity>
              {passwordRequirements.passwordsMatch && confirmPassword.length > 0 && (
                <View className="bg-[#E040A0] rounded-full p-2 ml-2">
                  <Feather name="check" size={18} color="#ffffff" />
                </View>
              )}
            </View>
          </View>

          {/* Password Requirements */}
          {newPassword.length > 0 && (
            <View className="flex-col gap-3 bg-[#9B59F5]/10 border border-[#3A2878] rounded-[16px] px-5 py-5 mt-6">
              <RequirementItem
                met={passwordRequirements.minLength}
                text="At least 8 characters"
              />
              <RequirementItem
                met={passwordRequirements.hasUpperCase}
                text="One uppercase letter"
              />
              <RequirementItem
                met={passwordRequirements.hasNumberOrSymbol}
                text="One number or symbol"
              />
              <RequirementItem
                met={passwordRequirements.passwordsMatch}
                text="Passwords match"
              />
            </View>
          )}

          {/* Reset Button */}
          <View className="mt-8">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleResetPassword}
              disabled={isResetting || !allRequirementsMet}
              className={`h-[56px] rounded-[16px] items-center justify-center flex-row gap-3 ${
                allRequirementsMet && !isResetting
                  ? "bg-[#E040A0]"
                  : "bg-[#E040A0]/40"
              }`}
            >
              {isResetting ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Text className="text-white font-bold text-lg">
                    Reset Password
                  </Text>
                  <Feather name="arrow-right" size={20} color="#ffffff" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Custom Alert Modal */}
      <Modal
        visible={customAlert.visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setCustomAlert((prev) => ({ ...prev, visible: false }))
        }
      >
        <View className="flex-1 bg-black/60 items-center justify-center px-6">
          <View className="w-full rounded-[28px] bg-[#141325] border border-[#2A2845] px-6 py-6">
            <View className="flex-row items-center gap-3 mb-2">
              {customAlert.type === "error" && (
                <View className="w-8 h-8 rounded-full bg-[#FF6B6B]/20 items-center justify-center">
                  <Feather name="alert-circle" size={20} color="#FF6B6B" />
                </View>
              )}
              {customAlert.type === "success" && (
                <View className="w-8 h-8 rounded-full bg-[#10B981]/20 items-center justify-center">
                  <Feather name="check-circle" size={20} color="#10B981" />
                </View>
              )}
              {customAlert.type === "info" && (
                <View className="w-8 h-8 rounded-full bg-[#9B59F5]/20 items-center justify-center">
                  <Feather name="info" size={20} color="#9B59F5" />
                </View>
              )}
              <Text className="text-white text-2xl font-bold flex-1">
                {customAlert.title}
              </Text>
            </View>

            <Text className="text-[#8B88A8] text-base text-center leading-6 mt-4">
              {customAlert.message}
            </Text>

            <Pressable
              onPress={() =>
                setCustomAlert((prev) => ({ ...prev, visible: false }))
              }
              className={`h-[52px] rounded-[16px] items-center justify-center mt-6 ${
                customAlert.type === "success"
                  ? "bg-[#10B981]"
                  : customAlert.type === "error"
                    ? "bg-[#FF6B6B]"
                    : "bg-[#9B59F5]"
              }`}
            >
              <Text className="text-white font-bold text-lg">
                {customAlert.type === "success" ? "Continue" : "Okay"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
  <View className="flex-row items-center gap-3">
    <View
      className={`w-5 h-5 rounded-full items-center justify-center ${
        met ? "bg-[#10B981]" : "bg-[#3A3858]"
      }`}
    >
      <Feather
        name="check"
        size={14}
        color={met ? "#ffffff" : "#2A2845"}
        strokeWidth={3}
      />
    </View>
    <Text
      className={`text-sm font-medium ${
        met ? "text-[#10B981]" : "text-[#6A6880]"
      }`}
    >
      {text}
    </Text>
  </View>
);

export default Verify;