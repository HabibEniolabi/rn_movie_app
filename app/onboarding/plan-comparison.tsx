import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import PlanComparisonCard from "@/components/PLanComparisonCard";
import { images } from "@/constants/images";
import BillingToggle from "@/components/BillingToggle";
import QuickComparison from "@/components/QuickComparison";
import { useTranslation } from "react-i18next";

const PlanComparison = () => {
  const { t } = useTranslation();
  const [billingType, setBillingType] = useState<"monthly" | "yearly">(
    "yearly"
  );
  const choosePlan = (plan: "free" | "pro" | "ultra") => {
    router.push({
      pathname: "/onboarding/profile",
      params: { plan },
    });
  };
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
    <View className="flex-1 bg-primary px-5">
      <View className="mt-12">
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            className="px-2 py-2 rounded-[12px] border border-[#2A2845] bg-dark-300 items-center justify-center"
          >
            <Feather name="chevron-left" size={24} color="#8B88A8" />
          </TouchableOpacity>
          <View className="flex flex-col gap-2">
            <Text className="text-2xl text-white font-bold">
              {t("planComparison.title")}
            </Text>
            <Text className="text-md text-dark-500">
              {t("planComparison.subtitle")}
            </Text>
          </View>
        </View>
        <ScrollView
          className="mt-8"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <BillingToggle value={billingType} onChange={setBillingType} />
          <View className="gap-5 mt-6">
            <PlanComparisonCard
              variant="free"
              iconSource={images.film}
              title={t("planComparison.free.title")}
              subtitle={t("planComparison.free.subtitle")}
              price="$0"
              period={t("planComparison.free.period")}
              buttonTitle={t("planComparison.free.buttonTitle")}
              onPress={() => choosePlan("free")}
              features={[
                {
                  label: t("planComparison.free.features.freeMovies"),
                  available: true,
                  highlight: "100+",
                },
                {
                  label: t("planComparison.free.features.streaming"),
                  available: true,
                  highlight: "720p",
                },
                {
                  label: t("planComparison.free.features.screen"),
                  available: true,
                  highlight: "1",
                },
                {
                  label: t("planComparison.free.features.ads"),
                  available: false,
                },
                {
                  label: t("planComparison.free.features.downloads"),
                  available: false,
                },
              ]}
            />

            <PlanComparisonCard
              variant="pro"
              iconSource={images.diamond}
              title={t("planComparison.pro.title")}
              subtitle={t("planComparison.pro.subtitle")}
              price="$5.99"
              period={t("planComparison.pro.period")}
              badge={t("planComparison.pro.badge")}
              buttonTitle={t("planComparison.pro.buttonTitle")}
              onPress={() => choosePlan("pro")}
              features={[
                {
                  label: t("planComparison.pro.features.hdMovies"),
                  available: true,
                  highlight: "300+",
                },
                {
                  label: t("planComparison.pro.features.streaming"),
                  available: true,
                  highlight: "1080p",
                },
                {
                  label: t("planComparison.pro.features.screens"),
                  available: true,
                  highlight: "2",
                },
                {
                  label: t("planComparison.pro.features.adFree"),
                  available: true,
                  highlight: t("planComparison.pro.highlights.adFree"),
                },
                {
                  label: t("planComparison.pro.features.downloads"),
                  available: true,
                  highlight: "10",
                  trailingText: t("planComparison.pro.highlights.offline"),
                },
                {
                  label: t("planComparison.pro.features.profiles"),
                  available: true,
                  highlight: "3",
                },
                {
                  label: t("planComparison.pro.features.personalisedFeed"),
                  available: true,
                },
              ]}
            />

            <PlanComparisonCard
              variant="ultra"
              iconSource={images.crown}
              title={t("planComparison.ultra.title")}
              subtitle={t("planComparison.ultra.subtitle")}
              oldPrice="$14.99/mo"
              price="$9.99"
              period={t("planComparison.ultra.period")}
              buttonTitle={t("planComparison.ultra.buttonTitle")}
              onPress={() => choosePlan("ultra")}
              features={[
                {
                  label: t("planComparison.ultra.features.exclusives"),
                  iconType: "star",
                  highlight: "500+",
                },
                {
                  label: t("planComparison.ultra.features.streaming"),
                  iconType: "star",
                  highlight: "4K HDR",
                },
                {
                  label: t("planComparison.ultra.features.screens"),
                  iconType: "star",
                  highlight: "4",
                },
                {
                  label: t("planComparison.ultra.features.downloads"),
                  iconType: "star",
                  highlight: t("planComparison.ultra.highlights.unlimited"),
                },
                {
                  label: t("planComparison.ultra.features.profiles"),
                  iconType: "star",
                  highlight: "6",
                },
                {
                  label: t("planComparison.ultra.features.premiereAccess"),
                  iconType: "star",
                  highlight: t("planComparison.ultra.highlights.access"),
                },
                {
                  label: t("planComparison.ultra.features.prioritySupport"),
                  iconType: "star",
                  highlight: t("planComparison.ultra.highlights.priority"),
                },
              ]}
            />
          </View>
          <QuickComparison />
          <View className="flex-row items-center mt-6 bg-[#10201F] border border-[#1D9E75] rounded-[28px] px-5 py-5">
            <View className="w-[60px] h-[60px] items-center justify-center mr-4">
              <Image
                source={images.gift}
                className="w-[50px] h-[50px]"
                resizeMode="contain"
              />
            </View>

            <View className="flex-1">
              <Text className="text-[#4DCFA0] font-bold text-lg mb-2">
                {t("planComparison.trialTitle")}
              </Text>

              <Text className="text-[#8B88A8] text-base leading-6">
                {t("planComparison.trialSubtitle")}
              </Text>
            </View>
          </View>

          <View className="mt-8 px-2">
            <Text className="text-dark-500 text-sm text-center leading-7">
              {t("planComparison.termsPrefix")}{" "}
              <Text
                onPress={() => {
                  setCustomAlert({
                    visible: true,
                    title: t("planComparison.termsTitle"),
                    message: t("planComparison.termsMessage"),
                  });
                }}
                className="text-[#B15CFF] font-bold"
              >
                {t("planComparison.terms")}
              </Text>{" "}
              {t("planComparison.and")}{" "}
              <Text
                onPress={() => {
                  setCustomAlert({
                    visible: true,
                    title: t("planComparison.privacyTitle"),
                    message: t("planComparison.privacyMessage"),
                  });
                }}
                className="text-[#B15CFF] font-bold"
              >
                {t("planComparison.privacyPolicy")}
              </Text>
              .
            </Text>

            <Text className="text-dark-500 text-sm text-center leading-7 mt-1">
              {t("planComparison.pricesNote")}
            </Text>
          </View>
        </ScrollView>
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
                <Text className="text-white font-bold text-lg">
                  {t("common.okay")}
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default PlanComparison;
