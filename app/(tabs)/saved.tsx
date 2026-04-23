import GenreTabs from "@/components/GenreTabs";
import { icons } from "@/constants/icons";
import React from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import Octicons from "react-native-vector-icons/Octicons";

const Saved = () => {
  return (
    <View className="bg-primary flex-1 px-10">
      <View className="flex justify-between mt-16 items-center flex-row">
        <Text className="text-white font-bold text-[24px]">My Watchlist</Text>
        <View className="flex items-center bg-dark-300 border-dark-400 border p-3 rounded-md">
          <TouchableOpacity>
            <Octicons name={"plus"} size={18} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex flex-col gap-1 gap-4">
        <Text className="text-dark-500">47 movies saved</Text>
        <GenreTabs />
      </View>
      <ScrollView
        className="flex-1 bg-primary"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex flex-col mt-6">
          <Text className="text-dark-500 font-bold uppercase">
            Recently Added
          </Text>
        </View>
        <View className="flex flex-col mt-6">
          <Text className="text-dark-500 font-bold uppercase">
            Older Saves
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Saved;
