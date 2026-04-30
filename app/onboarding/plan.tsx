import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import OnboardingHeader from "@/components/OnboardingHeader";
import OnboardingHeaderInfo from "@/components/OnboardingHeaderInfo";
import PlanCard from "@/components/PlanCard";
import { images } from "@/constants/images";
import Button from "@/components/Button";
import { router } from "expo-router";

const Plan = () => {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro">("pro");
  const [selectIcon, setSelectIcon] = useState<true | false>(false);
  return (
    <View className="bg-primary flex-1 px-10">
      <View className="flex mt-16 flex-col">
        <OnboardingHeader step={1} />
        <ScrollView
          className="mt-8"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <OnboardingHeaderInfo
            title={"Choose your plan 🎬"}
            subtitle={
              "Pick a plan that works for you. Upgrade or cancel anytime."
            }
            warning="Save 40% with yearly billing"
          />
          <View className="mt-4 gap-5">
            <PlanCard
              iconSource={images.film}
              title="Free"
              subtitle="Great for casual viewers"
              price="$0"
              period="forever"
              selected={selectedPlan === "free"}
              onPress={() => setSelectedPlan("free")}
              features={[
                { label: "100+ free movies", available: true },
                { label: "720p streaming", available: true },
                { label: "No ads removal", available: false },
                { label: "No offline downloads", available: false },
              ]}
            />
            <PlanCard
              iconSource={images.diamond}
              title="Pro"
              subtitle="Best for movie lovers"
              price="$9.99"
              badge="MOST POPULAR"
              period="/ month"
              selected={selectedPlan === "pro"}
              onPress={() => setSelectedPlan("pro")}
              features={[
                { label: "300+ HD movies", available: true },
                { label: "4K + HDR streaming", available: true },
                { label: "Ad-free experience", available: true },
                { label: "Offline downloads", available: true },
              ]}
            />
          </View>
          <View className="mt-8 flex fex-col gap-6">
            <Button
              title="Continue with Pro"
              showArrow
              variant="primary"
              onPress={() => router.push("/onboarding/profile")}
            />
            <Button
              title="Start with Free"
              variant="outline"
              onPress={() => router.push("/onboarding/profile")}
            />
          </View>
          <View className="items-center justify-center flew-row mt-6 gap-1">
            <Text className="text-dark-500 text-md">See full</Text>
            <TouchableOpacity activeOpacity={0.8}>
              <Text className="text-lg font-bold text-[#6A6880]">
                plan comparison
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Plan;
