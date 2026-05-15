import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

const tabs = [
  {
    key: "all",
    label: "watchlistTabs.all",
  },
  {
    key: "watching",
    label: "watchlistTabs.watching",
  },
  {
    key: "completed",
    label: "watchlistTabs.completed",
  },
  {
    key: "planToWatch",
    label: "watchlistTabs.planToWatch",
  },
];

const ACTIVE_GRADIENT = ["#D946C4", "#9B4DFF"] as const;

const GenreTabs = () => {
  const [activeTab, setActiveTab] = useState("All");
  const { t } = useTranslation();

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 24 }}
      >
        <View className="flex-row gap-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.85}
                onPress={() => setActiveTab(tab.key)}
                className={`px-6 py-2 rounded-full border overflow-hidden ${
                  isActive
                    ? "border-transparent"
                    : "bg-[#1A1830] border-[#2B2944]"
                }`}
              >
                {isActive && (
                  <LinearGradient
                    colors={ACTIVE_GRADIENT}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 999,
                    }}
                  />
                )}

                <Text
                  className={`text-[16px] font-semibold ${
                    isActive ? "text-white" : "text-[#6F6C8F]"
                  }`}
                >
                  {t(tab.label)}
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
