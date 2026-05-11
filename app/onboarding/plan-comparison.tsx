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

const PlanComparison = () => {
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
            <Text className="text-2xl text-white font-bold">Choose a Plan</Text>
            <Text className="text-md text-dark-500">
              Upgrade or cancel anytime
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
              title="Free"
              subtitle="Great for casual viewers"
              price="$0"
              period="forever free"
              buttonTitle="Start Free"
              onPress={() => choosePlan("free")}
              features={[
                {
                  label: "100+ free movies",
                  available: true,
                  highlight: "100+",
                },
                {
                  label: "Stream up to 720p",
                  available: true,
                  highlight: "720p",
                },
                {
                  label: "1 screen at a time",
                  available: true,
                  highlight: "1",
                },
                {
                  label: "Ads shown between films",
                  available: false,
                },
                {
                  label: "No offline downloads",
                  available: false,
                },
              ]}
            />

            <PlanComparisonCard
              variant="pro"
              iconSource={images.diamond}
              title="Pro"
              subtitle="For real movie lovers"
              price="$5.99"
              period="per month, billed yearly"
              badge="MOST POPULAR"
              buttonTitle="Get Pro — $5.99/mo"
              onPress={() => choosePlan("pro")}
              features={[
                {
                  label: "300+ HD movies + new releases",
                  available: true,
                  highlight: "300+",
                },
                {
                  label: "Stream in full 1080p",
                  available: true,
                  highlight: "1080p",
                },
                {
                  label: "2 screens simultaneously",
                  available: true,
                  highlight: "2",
                },
                {
                  label: "Completely ad-free",
                  available: true,
                  highlight: "ad-free",
                },
                {
                  label: "Download up to 10 titles",
                  available: true,
                  highlight: "10",
                  trailingText: "offline",
                },
                {
                  label: "3 user profiles + kids mode",
                  available: true,
                  highlight: "3",
                },
                {
                  label: "Personalised genre feed",
                  available: true,
                },
              ]}
            />

            <PlanComparisonCard
              variant="ultra"
              iconSource={images.crown}
              title="Ultra"
              subtitle="The ultimate experience"
              oldPrice="$14.99/mo"
              price="$9.99"
              period="per month, billed yearly"
              buttonTitle="Get Ultra — $9.99/mo"
              onPress={() => choosePlan("ultra")}
              features={[
                {
                  label: "500+ movies incl. exclusives",
                  iconType: "star",
                  highlight: "500+",
                },
                {
                  label: "Stunning 4K HDR + Dolby Atmos",
                  iconType: "star",
                  highlight: "4K HDR",
                },
                {
                  label: "4 screens at once",
                  iconType: "star",
                  highlight: "4",
                },
                {
                  label: "Unlimited offline downloads",
                  iconType: "star",
                  highlight: "Unlimited",
                },
                {
                  label: "6 profiles + advanced kids lock",
                  iconType: "star",
                  highlight: "6",
                },
                {
                  label: "Early premiere access",
                  iconType: "star",
                  highlight: "access",
                },
                {
                  label: "Priority 24/7 support",
                  iconType: "star",
                  highlight: "Priority",
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
                7-day free trial on all paid plans
              </Text>

              <Text className="text-[#8B88A8] text-base leading-6">
                Try Pro or Ultra free for a week. Cancel before the trial ends
                and you won&apos;t be charged.
              </Text>
            </View>
          </View>

          <View className="mt-8 px-2">
            <Text className="text-dark-500 text-sm text-center leading-7">
              By subscribing you agree to our{" "}
              <Text
                onPress={() => {
                  setCustomAlert({
                    visible: true,
                    title: "Terms",
                    message: "I agree to the terms and conditions of MovieFlix.",
                  });
                }}
                className="text-[#B15CFF] font-bold"
              >
                Terms
              </Text>{" "}
              and{" "}
              <Text
                onPress={() => {
                  setCustomAlert({
                    visible: true,
                    title: "Privacy Policy",
                    message: "I agree to the Privacy Policy of MovieFlix.",
                  });
                }}
                className="text-[#B15CFF] font-bold"
              >
                Privacy Policy
              </Text>
              .
            </Text>

            <Text className="text-dark-500 text-sm text-center leading-7 mt-1">
              Prices shown in USD. Cancel anytime.
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
                <Text className="text-white font-bold text-lg">Okay</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default PlanComparison;
