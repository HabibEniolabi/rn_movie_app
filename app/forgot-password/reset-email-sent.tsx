import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";

const ResetEmailSent = () => {
  const { email } = useLocalSearchParams<{ email?: string }>();

  const handleContinue = () => {
    router.push({
      pathname: "/forgot-password/verify",
      params: { email },
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-primary"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1 bg-primary"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 32,
          paddingTop: 64,
          paddingBottom: 36,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.back()}
          className="w-[56px] h-[56px] rounded-[18px] overflow-hidden self-start"
        >
          <LinearGradient
            colors={["#3A2D63", "#211F3A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flex: 1,
              padding: 1.4,
              borderRadius: 18,
            }}
          >
            <View className="flex-1 rounded-[17px] bg-[#0D0C1A] items-center justify-center">
              <Feather name="chevron-left" size={26} color="#A6A1C8" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Main Content */}
        <View className="items-center mt-16">
          {/* Icon Ring */}
          <View
            className="w-[150px] h-[150px] rounded-full items-center justify-center"
            style={{
              borderWidth: 1.5,
              borderColor: "#43246D",
              borderStyle: "dashed",
            }}
          >
            <LinearGradient
              colors={["#3A1E5C", "#1D1737"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 122,
                height: 122,
                borderRadius: 999,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#5A2D8A",
              }}
            >
              <LinearGradient
                colors={["#D946C4", "#9B4DFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 999,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="mail" size={34} color="#FFFFFF" />
              </LinearGradient>
            </LinearGradient>
          </View>

          <Text className="text-white text-[30px] text-center font-extrabold mt-8">
            Check your inbox!
          </Text>

          <View className="mt-5">
            <Text className="text-[#8B88A8] text-[17px] leading-6 text-center">
              We sent a reset link to
            </Text>

            <Text className="text-[#A855F7] text-[18px] font-extrabold text-center mt-1">
              {email || "your email"}
            </Text>
          </View>
        </View>

        {/* Email Preview Card */}
        <View className="mt-14 rounded-[22px] border border-[#2A2845] bg-[#141325] px-5 py-5">
          <View className="flex-row items-center">
            <LinearGradient
              colors={["#3A1E5C", "#26164A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 68,
                height: 68,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="film" size={30} color="#D7C9FF" />
            </LinearGradient>

            <View className="ml-4 flex-1">
              <Text className="text-[#7F7B9D] text-[14px] leading-5">
                From: no-reply@moviestream.app
              </Text>

              <Text className="text-white text-[18px] font-extrabold mt-1">
                Reset your password
              </Text>

              <Text className="text-[#6F6B8D] text-[14px] leading-5 mt-1">
                Tap the link to create a new password...
              </Text>
            </View>

            <Text className="text-[#6F6B8D] text-[13px] ml-2">Just now</Text>
          </View>
        </View>

        {/* Resend Row */}
        <View className="flex-row items-center justify-center mt-8">
          <Text className="text-[#7F7B9D] text-[16px] font-semibold">
            Didn&apos;t receive it? Resend in
          </Text>

          <View className="ml-3 px-5 py-2 rounded-[12px] border border-[#2A2845] bg-[#141325]">
            <Text className="text-[#A855F7] text-[18px] font-extrabold">
              0:45
            </Text>
          </View>
        </View>

        <View className="flex-1 min-h-[40px]" />

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          activeOpacity={0.88}
          className="rounded-[22px] overflow-hidden"
        >
          <LinearGradient
            colors={["#D946C4", "#9B4DFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 62,
              borderRadius: 22,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <Text className="text-white font-extrabold text-[20px]">
              Continue
            </Text>

            <View className="ml-4 w-[38px] h-[38px] rounded-[14px] bg-white/15 items-center justify-center">
              <Feather name="arrow-right" size={22} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Try Again */}
        <View className="flex-row gap-2 items-center justify-center mt-8">
          <Text className="font-bold text-[#7F7B9D] text-[16px]">
            Wrong email?
          </Text>

          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.85}>
            <Text className="text-[#E85CBF] font-extrabold text-[18px]">
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetEmailSent;