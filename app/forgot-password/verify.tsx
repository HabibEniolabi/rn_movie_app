import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import Feather from "react-native-vector-icons/Feather";

const Verify = () => {
  const { email } = useLocalSearchParams<{ email?: string }>();

  return (
    <KeyboardAvoidingView
      className="bg-primary flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 bg-primary"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 32,
            paddingTop: 20,
            paddingBottom: 40,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.back()}
            className="p-2 rounded-[12px] border border-[#2A2845] bg-dark-300 items-center justify-center self-start"
          >
            <Feather name="chevron-left" size={24} color="#8B88A8" />
          </TouchableOpacity>

          <View className="flex-col items-center mt-16 gap-6">
            <View className="w-[120px] h-[120px] rounded-full bg-[#9B59F5]/20 border border-[#9B59F5]/30 items-center justify-center">
              <Feather name="mail" size={56} color="#9B59F5" />
            </View>

            <Text className="text-white text-3xl text-center font-bold">
              Almost done 📩
            </Text>

            <Text className="text-dark-500 text-base leading-7 text-center">
              We sent the reset link to
            </Text>

            <Text className="text-[#9B59F5] text-lg font-bold text-center">
              {email || "your email"}
            </Text>

            <Text className="text-dark-500 text-base leading-7 text-center">
              Click the link in your email to create a new password. After that,
              come back and sign in with your new password.
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.replace("/login")}
            className="h-[56px] rounded-[16px] bg-[#E040A0] items-center justify-center mt-10"
          >
            <Text className="text-white font-bold text-lg">
              Back to Sign In
            </Text>
          </TouchableOpacity>

          <View className="flex-row gap-2 items-center justify-center mt-8">
            <Text className="font-bold text-[#8B88A8] text-base">
              Didn’t receive it?
            </Text>

            <TouchableOpacity
              onPress={() => router.replace("/forgot-password")}
              activeOpacity={0.85}
            >
              <Text className="text-[#E040A0] font-bold text-base">
                Send again
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Verify;