import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { images } from "@/constants/images";

const ResetEmailSent = () => {
  const { email } = useLocalSearchParams<{ email?: string }>();

  const handleContinue = () => {
    router.push({
       pathname: "/forgot-password/verify",
      params: { email },
    })
  }

  return (
    <KeyboardAvoidingView
      className="bg-primary flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="bg-primary flex-1 px-10">
          <View className="mt-20">
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.back()}
              className="p-2 rounded-[12px] border border-[#2A2845] bg-dark-300 items-center justify-center self-start"
            >
              <Feather name="chevron-left" size={24} color="#8B88A8" />
            </TouchableOpacity>

            <View className="flex-col justify-center items-center mt-12">
              <Image
                source={images.email}
                className="w-[110px] h-[110px]"
                resizeMode="contain"
              />

              <View className="flex-col gap-5 mt-5">
                <Text className="text-white text-3xl text-center font-bold">
                  Check your inbox!
                </Text>

                <View>
                  <Text className="text-dark-500 text-lg leading-6 text-center">
                    We sent a password reset link to
                  </Text>

                  <Text className="text-[#9B59F5] text-lg font-bold text-center">
                    {email || "your email"}
                  </Text>
                </View>

                <Text className="text-dark-500 text-base leading-6 text-center">
                  Open the email and click the reset link to create a new
                  password.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleContinue}
              activeOpacity={0.85}
              className="h-[52px] rounded-[16px] bg-[#E040A0] items-center justify-center mt-10"
            >
              <Text className="text-white font-bold text-lg">
                Continue
              </Text>
            </TouchableOpacity>

            <View className="flex-row gap-2 items-center justify-center mt-8">
              <Text className="font-bold text-dark-500 text-md">
                Wrong email?
              </Text>

              <TouchableOpacity onPress={() => router.back()} activeOpacity={0.85}>
                <Text className="text-[#E040A0] font-bold text-[18px]">
                  Try again
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ResetEmailSent;