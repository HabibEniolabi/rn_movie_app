import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import Feather from "react-native-vector-icons/Feather";

const OldPassword = () => {
  return (
    <View className="bg-primary flex-1 px-8">
      <View className="mt-12">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.back()}
            className="p-2 rounded-[12px] border border-[#2A2845] bg-dark-300 items-center justify-center self-start"
          >
            <Feather name="chevron-left" size={24} color="#8B88A8" />
          </TouchableOpacity>

        <View className="flex-col items-center justify-center">
          
        </View>
      </View>
    </View>
  );
};

export default OldPassword;
