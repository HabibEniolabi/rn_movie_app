import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const auth = FIREBASE_AUTH;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing details", "Please enter your email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Login failed",
        error?.message || "Something went wrong. Please try again."
      );
    }
  };
  return (
    <KeyboardAvoidingView
      className="bg-primary flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="bg-primary flex-1">
          <Image source={images.bg} className="absolute z-0 w-full" />
          <View className="flex flex-col items-center mt-6">
            <Image
              source={icons.logo}
              className="w-12 h-10 mt-20 mb-5 mx-auto"
            />
            <Text className="text-white font-bold text-[24px] mb-2">
              MovieFlix
            </Text>
            <Text className="text-dark-500 text-sm">300+ movies online</Text>
          </View>
          <ScrollView
            className="flex-1 px-10 mt-6"
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-white font-bold md-3 text-4xl">
              Welcome back 👋🏽
            </Text>
            <Text className="text-[#6A6880] font-bold text-lg">
              Sign in to continue watching
            </Text>
            <View className="mt-10 flex flex-col gap-6">
              <View className="flex flex-col gap-2">
                <Text className="text-md text-[#6A6880] font-bold">
                  Email address
                </Text>
                <View className="flex-row items-center rounded-[14px] border border-[#2A2845] bg-[#141325] px-6 h-[52px]">
                  <Feather name="mail" size={18} color="#3A3858" />

                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="alex@example.com"
                    placeholderTextColor="#3A3858"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className={`ml-5 flex-1 text-[#EDEAF8] text-lg font-semibold`}
                  />
                </View>
              </View>
              <View className="flex flex-col gap-2">
                <Text className="text-md text-[#6A6880] font-bold">Password</Text>
                <View className="flex-row items-center rounded-[14px] border border-[#2A2845] bg-[#141325] px-6 h-[52px]">
                  <EvilIcons name="lock" size={24} color="#3A3858" />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter password"
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#3A3858"
                    autoCapitalize="none"
                    className={`ml-5 flex-1 text-[#EDEAF8] text-lg font-semibold`}
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
              </View>
              <TouchableOpacity
                onPress={() => router.push("/forgot-password")}
                className="self-end"
              >
                <Text className="text-[#9B59F5] font-semibold">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
            <View className="mt-6">
              <Button title={"Sign In"} onPress={() => handleLogin()} />
            </View>
            <View className="flex-row items-center my-3 gap-2">
              <View className="flex-1 h-[1px] bg-[#2A2845]" />
              <Text className="text-dark-500 text-sm">or continue with</Text>
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
                Don't have an account?
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/signup")}
                activeOpacity={0.85}
              >
                <Text className="text-[#E040A0] font-bold text-[20px]">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;
