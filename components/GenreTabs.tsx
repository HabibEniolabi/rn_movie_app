import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";

const tabs = ["All", "Watching", "Completed", "Plan to Watch"];

const GenreTabs = () => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 24 }}
      >
        <View className="flex-row gap-3">
          {tabs.map((tab, index) => {
            const isActive = index === 0;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.8}
                className={`px-6 py-2 rounded-full border ${
                  isActive
                    ? "bg-fuchsia-500 border-fuchsia-500"
                    : "bg-[#1A1830] border-[#2B2944]"
                }`}
              >
                <Text
                  className={`text-[16px] font-semibold ${
                    isActive ? "text-white" : "text-[#6F6C8F]"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default GenreTabs;
