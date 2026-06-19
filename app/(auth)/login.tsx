import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import Feather from "react-native-vector-icons/Feather";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { router } from "expo-router";
import Button from "@/components/Button";
import SocialButton from "@/components/SocialButton";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LanguageSwitcher from "@/components/LanguageSwitcher";
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

const getLoginErrorMessage = (code?: string) => {
  switch (code) {
    case "auth/invalid-email":
      return "Enter a valid email address.";

    case "auth/user-disabled":
      return "This account has been disabled.";

    case "auth/user-not-found":
      return "No account found with this email.";

    case "auth/wrong-password":
      return "Incorrect password.";

    case "auth/invalid-credential":
      return "Invalid email or password.";

    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    default:
      return "Unable to sign in. Please try again.";
  }
};

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const auth = FIREBASE_AUTH;

  const validateForm = () => {
    const newErrors: FormErrors = {};

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      newErrors.email = t("auth.emailRequired") || "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      newErrors.email = t("auth.invalidEmail") || "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = t("auth.passwordRequired") || "Password is required";
    } else if (password.length < 6) {
      newErrors.password =
        t("auth.passwordTooShort") || "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleLogin = async () => {
    if (loading) return;
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      router.replace("/(tabs)");
    } catch (error: any) {
      const code = error?.code;

      if (code === "auth/invalid-email") {
        setErrors({ email: t("auth.invalidEmail") });
        return;
      }

      if (code === "auth/wrong-password") {
        setErrors({ password: t("auth.incorrectPassword") });
        return;
      }

      if (code === "auth/user-not-found") {
        setErrors({ email: t("auth.noAccountFound") });
        return;
      }

      if (code === "auth/invalid-credential") {
        setErrors({
          password: t("auth.invalidEmailOrPassword"),
        });
        return;
      }

      setErrors({
        general: getLoginErrorMessage(code),
      });
    }
  };

  return (
    <KeyboardAvoidingView
      className="bg-primary flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="bg-primary flex-1">
        <Image source={images.bg} className="absolute z-0 w-full" />

        <View className="absolute top-14 right-10 z-20">
          <LanguageSwitcher />
        </View>

        <KeyboardAwareScrollView
          className="flex-1 px-10"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          extraScrollHeight={30}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 100,
          }}
        >
          <View className="flex flex-col items-center mt-6">
            <Image
              source={icons.logo}
              className="w-12 h-10 mt-20 mb-5 mx-auto"
            />
            <Text className="text-white font-bold text-[24px] mb-2">
              MovieFlix
            </Text>
            <Text className="text-dark-500 text-sm">
              {t("home.searchMovies")}
            </Text>
          </View>

          <View className="mt-6">
            <Text className="text-white font-bold md-3 text-4xl">
              {t("auth.loginTitle")}👋🏽
            </Text>

            <Text className="text-[#6A6880] font-bold text-lg">
              {t("auth.loginSubtitle")}
            </Text>

            <View className="mt-10 flex flex-col gap-6">
              <View className="flex flex-col gap-2">
                <Text className="text-md text-[#6A6880] font-bold">
                  {t("auth.email")}
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

                      if (errors.email) {
                        setErrors((prev) => ({
                          ...prev,
                          email: undefined,
                        }));
                      }
                    }}
                    placeholder={t("auth.emailPlaceholder")}
                    placeholderTextColor="#3A3858"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    className="ml-5 flex-1 text-[#EDEAF8] text-lg font-semibold"
                  />
                </View>
                {errors.email && (
                  <Text className="text-red-400 text-sm font-semibold">
                    {errors.email}
                  </Text>
                )}
              </View>

              <View className="flex flex-col gap-2">
                <Text className="text-md text-[#6A6880] font-bold">
                  {t("auth.password")}
                </Text>

                <View
                  className={`flex-row items-center rounded-[14px] border bg-[#141325] px-6 h-[52px] ${
                    errors.password ? "border-red-500" : "border-[#2A2845]"
                  }`}
                >
                  <EvilIcons name="lock" size={24} color="#3A3858" />

                  <TextInput
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);

                      if (errors.password) {
                        setErrors((prev) => ({
                          ...prev,
                          password: undefined,
                        }));
                      }
                    }}
                    placeholder={t("auth.enterPassword")}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#3A3858"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    className="ml-5 flex-1 text-[#EDEAF8] text-lg font-semibold"
                  />

                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    <Feather
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#6A6880"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text className="text-red-400 text-sm font-semibold">
                    {errors.password}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                onPress={() => router.push("/forgot-password")}
                className="self-end"
              >
                <Text className="text-[#9B59F5] font-semibold">
                  {t("auth.forgotPassword")}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.general && (
              <Text className="text-red-400 text-sm font-semibold text-center mb-3">
                {errors.general}
              </Text>
            )}
            <View className="mt-6">
              <Button
                title={
                  loading
                    ? t("auth.signingIn")
                    : t("auth.signIn")
                }
                onPress={handleLogin}
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
                {t("auth.dontHaveAccount")}
              </Text>

              <TouchableOpacity
                onPress={() => router.push("/signup")}
                activeOpacity={0.85}
              >
                <Text className="text-[#E040A0] font-bold text-[20px]">
                  {t("auth.signUp")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
