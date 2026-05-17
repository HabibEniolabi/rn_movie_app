import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import OnboardingHeader from "@/components/OnboardingHeader";
import OnboardingHeaderInfo from "@/components/OnboardingHeaderInfo";
import Feather from "react-native-vector-icons/Feather";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { images } from "@/constants/images";
import SocialButton from "@/components/SocialButton";
import { router } from "expo-router";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Button from "@/components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

const socialButton = [
  {
    title: "Google",
    imageSource: images.google,
  },
  {
    title: "Apple",
    imageSource: images.apple,
  },
];

const Profile = () => {
  const { t } = useTranslation();

  const auth = FIREBASE_AUTH;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPasswordStrength = (value: string) => {
    let score = 0;

    if (value.length >= 6) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;

    if (!value) {
      return {
        score: 0,
        label: "",
        message: "",
        color: "#2A2845",
      };
    }

    if (score <= 1) {
      return {
        score,
        label: t("auth.passwordStrength.weak"),
        message: t("auth.passwordStrength.addMoreCharacters"),
        color: "#E040A0",
      };
    }

    if (score === 2) {
      return {
        score,
        label: t("auth.passwordStrength.fair"),
        message: t("auth.passwordStrength.addNumbers"),
        color: "#FFD84D",
      };
    }

    if (score === 3) {
      return {
        score,
        label: t("auth.passwordStrength.good"),
        message: t("auth.passwordStrength.almostThere"),
        color: "#9B59F5",
      };
    }

    return {
      score,
      label: t("auth.passwordStrength.strong"),
      message: t("auth.passwordStrength.passwordLooksGood"),
      color: "#45E0B8",
    };
  };
  const strength = getPasswordStrength(password);

  const getSignupErrorMessage = (errorCode?: string) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return t("auth.emailAlreadyRegistered");

      case "auth/invalid-email":
        return t("auth.invalidEmail");

      case "auth/weak-password":
        return t("auth.passwordAtLeast6");

      case "auth/operation-not-allowed":
        return t("auth.signupNotEnabled");

      case "permission-denied":
        return t("auth.firestorePermissionDenied");

      default:
        return t("common.somethingWentWrong");
    }
  };

  const [customAlert, setCustomAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: "",
    message: "",
  });

  const handleCreateAccount = async () => {
    if (isSubmitting) return;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setCustomAlert({
        visible: true,
        title: t("auth.missingDetails"),
        message: t("auth.completeAllFields"),
      });
      return;
    }

    if (password.length < 6) {
      setCustomAlert({
        visible: true,
        title: t("auth.weakPassword"),
        message: t("auth.passwordAtLeast6"),
      });
      return;
    }

    if (!agreed) {
      setCustomAlert({
        visible: true,
        title: t("auth.termsRequired"),
        message: t("auth.agreeTermsAndPrivacy"),
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${firstName.trim()} ${lastName.trim()}`,
      });

      await setDoc(doc(FIREBASE_DB, "users", user.uid), {
        uid: user.uid,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim().toLowerCase(),
        agreedToTerms: agreed,
        provider: "password",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      router.replace("/onboarding/genres");
    } catch (error: any) {
      console.log("Create account error:", error);
      console.log("Error code:", error?.code);
      console.log("Error message:", error?.message);

      setCustomAlert({
        visible: true,
        title: t("auth.signupFailed"),
        message: getSignupErrorMessage(error?.code),
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <KeyboardAvoidingView
      className="bg-primary flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 bg-primary px-5">
        <View className="flex mt-16 flex-col">
          <OnboardingHeader step={2} />
          <KeyboardAwareScrollView
            className="mt-8"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            enableOnAndroid
            extraScrollHeight={30}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <OnboardingHeaderInfo
              title={t("auth.signupTitle")}
              subtitle={t("auth.signupSubtitle")}
            />
            <View className="mt-10 flex flex-col gap-6">
              <View className="flex-row gap-4">
                <View className="flex-1 flex-col gap-2">
                  <Text className="text-md text-[#6A6880] font-bold">
                    {t("auth.firstName")}
                  </Text>
                  <View className="flex-row items-center rounded-[14px] border border-[#2A2845] bg-[#141325] px-6 h-[52px]">
                    <Image
                      source={images.user}
                      className="w-5 h-5"
                      resizeMode="contain"
                      tintColor="#8B88A8"
                    />
                    <TextInput
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder={t("auth.firstNamePlaceholder")}
                      placeholderTextColor="#3A3858"
                      autoCapitalize="words"
                      className={`ml-5 flex-1 text-[#EDEAF8] text-lg font-semibold`}
                    />
                  </View>
                </View>
                <View className="flex-1 flex-col gap-2">
                  <Text className="text-md text-[#6A6880] font-bold">
                    {t("auth.lastName")}
                  </Text>
                  <View className="flex-row items-center rounded-[14px] border border-[#2A2845] bg-[#141325] px-6 h-[52px]">
                    <TextInput
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder={t("auth.lastNamePlaceholder")}
                      placeholderTextColor="#3A3858"
                      autoCapitalize="words"
                      className={`ml-5 flex-1 text-[#EDEAF8] text-lg font-semibold`}
                    />
                  </View>
                </View>
              </View>
              <View className="flex flex-col gap-2">
                <Text className="text-md text-[#6A6880] font-bold">
                  {t("auth.emailAddress")}
                </Text>
                <View className="flex-row items-center rounded-[14px] border border-[#2A2845] bg-[#141325] px-6 h-[52px]">
                  <Feather name="mail" size={18} color="#3A3858" />

                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder={t("auth.emailPlaceholder")}
                    placeholderTextColor="#3A3858"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    className={`ml-5 flex-1 text-[#EDEAF8] text-lg font-semibold`}
                  />
                </View>
              </View>
              <View className="flex flex-col gap-2">
                <Text className="text-md text-[#8B88A8] font-bold">
                  {t("auth.password")}
                </Text>

                <View className="flex-row items-center rounded-[18px] border border-[#2A2845] bg-[#141325] px-6 h-[64px]">
                  <EvilIcons name="lock" size={26} color="#8B88A8" />

                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder={t("auth.enterPassword")}
                    placeholderTextColor="#3A3858"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="ml-5 flex-1 text-[#EDEAF8] text-lg font-semibold"
                  />

                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    activeOpacity={0.7}
                  >
                    <Feather
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#8B88A8"
                    />
                  </TouchableOpacity>
                </View>

                {/* Password strength */}
                {password.length > 0 && (
                  <View className="mt-1">
                    <View className="flex-row gap-2 mb-2">
                      {[1, 2, 3, 4].map((item) => (
                        <View
                          key={item}
                          className="flex-1 h-[5px] rounded-full"
                          style={{
                            backgroundColor:
                              item <= strength.score
                                ? strength.color
                                : "#2A2845",
                          }}
                        />
                      ))}
                    </View>

                    <Text
                      className="text-base font-bold"
                      style={{ color: strength.color }}
                    >
                      {strength.label} {strength.message}
                    </Text>
                  </View>
                )}
              </View>

              {/* Terms checkbox */}
              <View className="flex-row items-start gap-4 mt-1">
                <TouchableOpacity
                  onPress={() => setAgreed((prev) => !prev)}
                  activeOpacity={0.8}
                  className="w-9 h-9 rounded-[10px] items-center justify-center overflow-hidden"
                  style={{
                    borderWidth: agreed ? 0 : 1,
                    borderColor: agreed ? "transparent" : "#2A2845",
                  }}
                >
                  {agreed ? (
                    <LinearGradient
                      colors={["#D946C4", "#9B4DFF"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Feather name="check" size={22} color="#FFFFFF" />
                    </LinearGradient>
                  ) : null}
                </TouchableOpacity>

                <Text className="flex-1 text-[#8B88A8] text-base leading-6">
                  {t("auth.termsPrefix")}{" "}
                  <Text className="text-[#B15CFF] font-bold">
                    {t("auth.termsOfService")}
                  </Text>{" "}
                  {t("auth.and")}{" "}
                  <Text className="text-[#B15CFF] font-bold">
                    {t("auth.privacyPolicy")}
                  </Text>{" "}
                  {t("auth.termsSuffix")}
                </Text>
              </View>
            </View>
            <View className="mt-6">
              <Button
                title={
                  isSubmitting
                    ? t("auth.creatingAccount")
                    : t("auth.createAccount")
                }
                onPress={handleCreateAccount}
              />
            </View>
            <View className="flex-row items-center my-3 gap-2">
              <View className="flex-1 h-[1px] bg-[#2A2845]" />
              <Text className="text-dark-500 text-sm">
                {t("auth.orContinueWith")}
              </Text>
              <View className="flex-1 h-[1px] bg-[#2A2845]" />
            </View>
            <View className="gap-2 flex-row mt-4">
              {socialButton.map((item, index) => (
                <SocialButton
                  key={index}
                  title={item.title}
                  onPress={() => {}}
                  imageSource={item.imageSource}
                />
              ))}
            </View>
            <View className="flex-row gap-2 items-center justify-center mt-8">
              <Text className="font-bold text-dark-500 text-md">
                {t("auth.alreadyHaveAccount")}
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/login")}
                activeOpacity={0.85}
              >
                <Text className="text-[#E040A0] font-bold text-[20px]">
                  {t("auth.signIn")}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
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
              <Text className="text-white text-2xl font-bold text-center">
                {customAlert.title}
              </Text>

              <Text className="text-[#8B88A8] text-base text-center leading-6 mt-4">
                {customAlert.message}
              </Text>

              <Pressable
                onPress={() =>
                  setCustomAlert((prev) => ({ ...prev, visible: false }))
                }
                className="h-[52px] rounded-[16px] bg-[#B954F5] items-center justify-center mt-6"
              >
                <Text className="text-white font-bold text-lg">
                  {t("common.okay")}
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Profile;
