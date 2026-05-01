import { View, Text, ScrollView } from "react-native";
import React from "react";
import OnboardingHeader from "@/components/OnboardingHeader";
import OnboardingHeaderInfo from "@/components/OnboardingHeaderInfo";

const Genres = () => {
  return (
    <View className="bg-primary flex-1">
      <View className="flex mt-16 flex-col">
        <OnboardingHeader step={3} />
        <ScrollView
          className="mt-8"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <OnboardingHeaderInfo
            title={"What do you love? ❤️"}
            subtitle={
              "Pick at least 3 genres so we can personalise your feed."
            }
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default Genres;
