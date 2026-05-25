import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
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

type FormErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  terms?: string;
  general?: string;
};

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
  const [errors, setErrors] = useState<FormErrors>({});

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

  const clearError = (field: keyof FormErrors) => {
    if (errors[field] || errors.general) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
        general: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      newErrors.email = t("auth.invalidEmail");
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = t("auth.passwordAtLeast6");
    }

    if (!agreed) {
      newErrors.terms = t("auth.agreeTermsAndPrivacy");
    }

    return newErrors;
  };

  const handleCreateAccount = async () => {
    if (isSubmitting) return;

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

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
      const code = error?.code;

      if (code === "auth/email-already-in-use") {
        setErrors({ email: t("auth.emailAlreadyRegistered") });
        return;
      }

      if (code === "auth/invalid-email") {
        setErrors({ email: t("auth.invalidEmail") });
        return;
      }

      if (code === "auth/weak-password") {
        setErrors({ password: t("auth.passwordAtLeast6") });
        return;
      }

      setErrors({
        general: getSignupErrorMessage(code),
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
                  <View
                    className={`flex-row items-center rounded-[14px] border bg-[#141325] px-6 h-[52px] ${
                      errors.firstName ? "border-red-500" : "border-[#2A2845]"
                    }`}
                  >
                    <Image
                      source={images.user}
                      className="w-5 h-5"
                      resizeMode="contain"
                      tintColor="#8B88A8"
                    />
                    <TextInput
                      value={firstName}
                      onChangeText={(text) => {
                        setFirstName(text);
                        clearError("firstName");
                      }}
                      placeholder={t("auth.firstNamePlaceholder")}
                      placeholderTextColor="#3A3858"
                      autoCapitalize="words"
                      className={`ml-5 flex-1 text-[#EDEAF8] text-lg font-semibold`}
                    />
                  </View>
                  {errors.firstName && (
                    <Text className="text-red-400 text-sm font-semibold">
                      {errors.firstName}
                    </Text>
                  )}
                </View>
                <View className="flex-1 flex-col gap-2">
                  <Text className="text-md text-[#6A6880] font-bold">
                    {t("auth.lastName")}
                  </Text>
                  <View
                    className={`flex-row items-center rounded-[14px] border bg-[#141325] px-6 h-[52px] ${
                      errors.lastName ? "border-red-500" : "border-[#2A2845]"
                    }`}
                  >
                    <TextInput
                      value={lastName}
                      onChangeText={(text) => {
                        setLastName(text);
                        clearError("lastName");
                      }}
                      placeholder={t("auth.lastNamePlaceholder")}
                      placeholderTextColor="#3A3858"
                      autoCapitalize="words"
                      className={`ml-5 flex-1 text-[#EDEAF8] text-lg font-semibold`}
                    />
                  </View>
                  {errors.lastName && (
                    <Text className="text-red-400 text-sm font-semibold">
                      {errors.lastName}
                    </Text>
                  )}
                </View>
              </View>
              <View className="flex flex-col gap-2">
                <Text className="text-md text-[#6A6880] font-bold">
                  {t("auth.emailAddress")}
                </Text>
                <View
                  className={`flex-row items-center rounded-[14px] border bg-[#141325] px-6 h-[52px] ${
                    errors.email ? "border-red-500" : "border-[#2A2845]"
                  }`}
                >
                  <Feather name="mail" size={18} color="#3A3858" />

                  <TextInput
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      clearError("email");
                    }}
                    placeholder={t("auth.emailPlaceholder")}
                    placeholderTextColor="#3A3858"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    className={`ml-5 flex-1 text-[#EDEAF8] text-lg font-semibold`}
                  />
                </View>
                {errors.email && (
                  <Text className="text-red-400 text-sm font-semibold">
                    {errors.email}
                  </Text>
                )}
              </View>
              <View className="flex flex-col gap-2">
                <Text className="text-md text-[#8B88A8] font-bold">
                  {t("auth.password")}
                </Text>

                <View
                  className={`flex-row items-center rounded-[18px] border bg-[#141325] px-6 h-[64px] ${
                    errors.password ? "border-red-500" : "border-[#2A2845]"
                  }`}
                >
                  <EvilIcons name="lock" size={26} color="#8B88A8" />

                  <TextInput
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      clearError("password");
                    }}
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
                {errors.password && (
                  <Text className="text-red-400 text-sm font-semibold">
                    {errors.password}
                  </Text>
                )}

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
              <View className="flex-col gap-2 mt-1">
                <View className="flex-row items-start gap-4">
                  <TouchableOpacity
                    onPress={() => {
                      setAgreed((prev) => !prev);
                      clearError("terms");
                    }}
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

                {errors.terms && (
                  <Text className="text-red-400 text-sm font-semibold ml-13">
                    {errors.terms}
                  </Text>
                )}
              </View>
            </View>
            <View className="mt-6">
              {errors.general && (
                <Text className="text-red-400 text-sm font-semibold text-center mb-3">
                  {errors.general}
                </Text>
              )}
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
      </View>
    </KeyboardAvoidingView>
  );
};

export default Profile;
