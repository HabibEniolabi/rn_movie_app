import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import OnboardingHeader from "@/components/OnboardingHeader";
import OnboardingHeaderInfo from "@/components/OnboardingHeaderInfo";
import PlanCard from "@/components/PlanCard";
import { images } from "@/constants/images";
import Button from "@/components/Button";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

const Plan = () => {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro">("pro");
  return (
    <View className="bg-primary flex-1 px-5">
      <View className="flex mt-16 flex-col">
        <OnboardingHeader step={1} />
        <ScrollView
          className="mt-8"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <OnboardingHeaderInfo
            title={t("onboarding.planTitle")}
            subtitle={t("onboarding.planSubtitle")}
            warning={t("onboarding.planWarning")}
          />
          <View className="mt-4 gap-5">
            <PlanCard
              iconSource={images.film}
              title={t("plans.free.title")}
              subtitle={t("plans.free.subtitle")}
              price="$0"
              period={t("plans.free.period")}
              selected={selectedPlan === "free"}
              onPress={() => setSelectedPlan("free")}
              features={[
                { label: t("plans.free.features.freeMovies"), available: true },
                { label: t("plans.free.features.streaming"), available: true },
                { label: t("plans.free.features.adsRemoval"), available: false },
                { label: t("plans.free.features.offlineDownloads"), available: false },
              ]}
            />
            <PlanCard
              iconSource={images.diamond}
              title={t("plans.pro.title")}
              subtitle={t("plans.pro.subtitle")}
              price="$9.99"
              badge={t("plans.pro.badge")}
              period={t("plans.pro.period")}
              selected={selectedPlan === "pro"}
              onPress={() => setSelectedPlan("pro")}
              features={[
                { label: t("plans.pro.features.hdMovies"), available: true },
                { label: t("plans.pro.features.streaming"), available: true },
                { label: t("plans.pro.features.adFree"), available: true },
                { label: t("plans.pro.features.offlineDownloads"), available: true },
              ]}
            />
          </View>
          <View className="mt-8 flex fex-col gap-6">
            <Button
              title={t("onboarding.continueWithPro")}
              showArrow
              variant="primary"
              onPress={() => router.push("/onboarding/profile")}
            />
            <Button
              title={t("onboarding.startWithFree")}
              variant="outline"
              onPress={() => router.push("/onboarding/profile")}
            />
          </View>
          <View className="flex-row gap-2 items-center justify-center mt-3">
            <Text className="font-bold text-dark-500 text-md">
             {t("onboarding.seeFull")}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/onboarding/plan-comparison")}
              activeOpacity={0.85}
            >
              <Text className="text-[#9B59F5] font-bold text-[20px]">
                {t("onboarding.planComparison")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Plan;
