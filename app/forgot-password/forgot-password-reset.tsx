import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { images } from "@/constants/images";
import Button from "@/components/Button";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTranslation } from "react-i18next";

type AlertType = "error" | "success" | "info";

const ForgotPassword = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const auth = FIREBASE_AUTH;
  const cleanEmail = email.trim().toLowerCase();

  const [customAlert, setCustomAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type?: AlertType;
  }>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const getResetError = (errorCode?: string) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return {
          title: t("auth.emailNotFoundTitle"),
          message: t("auth.emailNotFoundMessage", { email: cleanEmail }),
        };

      case "auth/invalid-email":
        return {
          title: t("auth.invalidEmailTitle"),
          message: t("auth.invalidEmail"),
        };

      case "auth/too-many-requests":
        return {
          title: t("auth.tooManyAttemptsTitle"),
          message: t("auth.tooManyAttempts"),
        };

      default:
        return {
          title: t("auth.resetFailed"),
          message: t("auth.resetFailedMessage"),
        };
    }
  };

  const handleSendResetLink = async () => {
    if (!cleanEmail) {
      setCustomAlert({
        visible: true,
        title: t("auth.missingEmail"),
        message: t("auth.enterRegisteredEmail"),
        type: "error",
      });
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setCustomAlert({
        visible: true,
        title: t("auth.invalidEmailTitle"),
        message: t("auth.invalidEmail"),
        type: "error",
      });
      return;
    }

    try {
      setIsSending(true);

      await sendPasswordResetEmail(auth, cleanEmail);

      router.push({
        pathname: "/forgot-password/reset-email-sent",
        params: { email: cleanEmail },
      });
    } catch (error: any) {
      const resetError = getResetError(error?.code);

      setCustomAlert({
        visible: true,
        title: resetError.title,
        message: resetError.message,
        type: "error",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getAlertIcon = () => {
    if (customAlert.type === "error") {
      return {
        name: "alert-circle" as const,
        color: "#FF6B6B",
        bg: "rgba(255, 107, 107, 0.16)",
      };
    }

    if (customAlert.type === "success") {
      return {
        name: "check-circle" as const,
        color: "#10B981",
        bg: "rgba(16, 185, 129, 0.16)",
      };
    }

    return {
      name: "info" as const,
      color: "#9B59F5",
      bg: "rgba(155, 89, 245, 0.16)",
    };
  };

  const alertIcon = getAlertIcon();

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient
        colors={["#030014", "#10071F", "#21103D", "#030014"]}
        locations={[0, 0.35, 0.72, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View
          className="absolute w-[280px] h-[280px] rounded-full -top-24 -right-24"
          style={{ backgroundColor: "rgba(217, 70, 196, 0.16)" }}
        />

        <View
          className="absolute w-[260px] h-[260px] rounded-full bottom-10 -left-28"
          style={{ backgroundColor: "rgba(155, 77, 255, 0.18)" }}
        />

        <KeyboardAwareScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          enableAutomaticScroll
          extraScrollHeight={Platform.OS === "ios" ? 40 : 110}
          extraHeight={Platform.OS === "ios" ? 80 : 160}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 32,
            paddingTop: 58,
            paddingBottom: 150,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.back()}
            className="w-11 h-11 rounded-[14px] border border-[#2A2845] bg-[#141325]/80 items-center justify-center self-start"
          >
            <Feather name="chevron-left" size={24} color="#8B88A8" />
          </TouchableOpacity>

          <View className="items-center justify-center mt-12">
            <View className="w-[132px] h-[132px] rounded-[44px] overflow-hidden mb-7">
              <LinearGradient
                colors={["#D946C4", "#9B4DFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.2)",
                }}
              >
                <View className="w-[102px] h-[102px] rounded-[34px] bg-white/10 items-center justify-center">
                  <Image
                    source={images.lock}
                    resizeMode="contain"
                    className="w-[68px] h-[68px]"
                  />
                </View>
              </LinearGradient>
            </View>

            <Text className="text-white text-[34px] text-center font-extrabold">
              {t("auth.forgotPasswordTitle")}
            </Text>

            <Text className="text-[#8B88A8] text-base leading-7 text-center mt-4 px-3">
              {t("auth.forgotPasswordSubtitle")}
            </Text>
          </View>

          <View className="mt-10 rounded-[28px] bg-[#141325]/90 border border-[#2A2845] px-5 py-6">
            <View className="flex flex-col gap-2">
              <Text className="text-md text-[#8B88A8] font-bold">
                {t("auth.emailAddress")}
              </Text>

              <View className="flex-row items-center rounded-[18px] border border-[#2A2845] bg-[#0F0E1E] px-5 h-[60px]">
                <Feather name="mail" size={19} color="#6A6880" />

                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t("auth.emailPlaceholder")}
                  placeholderTextColor="#3A3858"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isSending}
                  returnKeyType="done"
                  blurOnSubmit
                  className="ml-4 flex-1 text-[#EDEAF8] text-lg font-semibold"
                />

                {isValidEmail(email) && (
                  <LinearGradient
                    colors={["#D946C4", "#9B4DFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 999,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Feather name="check" size={18} color="#FFFFFF" />
                  </LinearGradient>
                )}
              </View>
            </View>

            {email.length > 0 && (
              <View className="flex-row gap-3 bg-[#9B59F5]/15 border border-[#3A2878] rounded-[22px] px-5 py-5 mt-5">
                <Text className="text-[30px]">💡</Text>

                <Text className="text-[#8B88A8] text-base flex-1 leading-7">
                  {t("auth.resetInfoPrefix")}{" "}
                  <Text className="text-[#C084FC] font-bold">
                    {cleanEmail || t("auth.emailPlaceholder")}
                  </Text>
                  . {t("auth.resetInfoSuffix")}
                </Text>
              </View>
            )}

            <View className="mt-7">
              <Button
                title={
                  isSending ? t("auth.sending") : t("auth.sendResetLink")
                }
                onPress={handleSendResetLink}
                disabled={isSending || !isValidEmail(email)}
                showArrow={!isSending}
              />
            </View>

            {isSending && (
              <View className="flex-row items-center justify-center gap-3 mt-5">
                <ActivityIndicator size="small" color="#D946C4" />

                <Text className="text-[#8B88A8] font-semibold">
                  {t("auth.sendingResetLink")}
                </Text>
              </View>
            )}
          </View>

          <View className="flex-row gap-2 items-center justify-center mt-8">
            <Text className="font-bold text-[#6A6880] text-md">
              {t("auth.rememberedPassword")}
            </Text>

            <TouchableOpacity
              onPress={() => router.replace("/login")}
              activeOpacity={0.85}
            >
              <Text className="text-[#E040A0] font-bold text-[20px]">
                {t("auth.backToSignIn")}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>

      <Modal
        visible={customAlert.visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setCustomAlert((prev) => ({ ...prev, visible: false }))
        }
      >
        <View className="flex-1 bg-black/70 items-center justify-center px-6">
          <View className="w-full rounded-[32px] bg-[#141325] border border-[#2A2845] px-6 py-7">
            <View className="items-center">
              <View
                className="w-16 h-16 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: alertIcon.bg }}
              >
                <Feather
                  name={alertIcon.name}
                  size={30}
                  color={alertIcon.color}
                />
              </View>

              <Text className="text-white text-2xl font-bold text-center">
                {customAlert.title}
              </Text>

              <Text className="text-[#8B88A8] text-base text-center leading-6 mt-4">
                {customAlert.message}
              </Text>
            </View>

            <Pressable
              onPress={() =>
                setCustomAlert((prev) => ({ ...prev, visible: false }))
              }
              className="h-[54px] rounded-[18px] bg-[#B954F5] items-center justify-center mt-7"
            >
              <Text className="text-white font-bold text-lg">
                {t("common.okay")}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;