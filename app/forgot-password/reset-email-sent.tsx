import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Modal,
  Image,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { images } from "@/constants/images";

const RestEmailSent = () => {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [isResending, setIsResending] = useState(false);

  const [customAlert, setCustomAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: "",
    message: "",
  });
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
                  <Text className="text-dark-500 test-lg leading-6 text-center">
                    We sent a reset link to
                  </Text>
                  <Text className="text-[#9B59F5] text-lg font-bold text-center">
                    {email || "your email"}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-row gap-2 items-center justify-center mt-8">
              <Text className="font-bold text-dark-500 text-md">
                Wrong email?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.85}
              >
                <Text className="text-[#E040A0] font-bold text-[20px]">
                  Try again
                </Text>
              </TouchableOpacity>
            </View>
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
                  <Text className="text-white font-bold text-lg">Okay</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RestEmailSent;
