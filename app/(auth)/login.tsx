import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import Feather from "react-native-vector-icons/Feather";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    router.replace("/(tabs)");
  };
  return (
    <View className="bg-primary flex-1">
      <Image source={images.bg} className="absolute z-0 w-full" />
      <View className="flex flex-col items-center mt-6">
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        <Text className="text-white font-bold text-[24px] mb-2">MovieFlix</Text>
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
                className="ml-5 flex-1 text-[#EDEAF8] text-lg font-semibold"
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
                placeholder="***********"
                secureTextEntry={!showPassword}
                placeholderTextColor="#3A3858"
                keyboardType="email-address"
                autoCapitalize="none"
                className="ml-5 flex-1 text-[#EDEAF8] text-lg font-semibold"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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
        <TouchableOpacity
          onPress={handleLogin}
          activeOpacity={0.85}
          className="rounded-[18px] overflow-hidden mt-6"
        >
          <LinearGradient
            colors={["#E040A0", "#9B59F5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 56,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 18,
            }}
          >
            <Text className="text-white text-lg font-bold">Sign In</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Login;
