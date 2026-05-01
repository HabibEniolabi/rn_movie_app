import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Octicons from "react-native-vector-icons/Octicons";
import Feather from "react-native-vector-icons/Feather";
import { images } from "@/constants/images";
import ProfileStatsCard from "@/components/ProfileStatsCard";
import Genre from "@/components/Genre";
import ProfileCardNavigation from "@/components/ProfileCardNavigation";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { router } from "expo-router";
import { signOut } from "firebase/auth";

const favouriteGenres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Sci-Fi" },
  { id: 3, name: "Thriller" },
  { id: 4, name: "Animation" },
  { id: 5, name: "Drama" },
  { id: 6, name: "Horror" },
];

const profileItems = [
  {
    id: 1,
    icon: <Image source={images.user} className="w-[22px] h-[22px]" />,
    iconBgClass: "#281E43",
    title: "edit profile",
    subtitle: "Update your name & avatar",
    rightType: "chevron" as const,
  },
  {
    id: 2,
    icon: <Image source={images.diamond} className="w-[22px] h-[22px]" />,
    iconBgClass: "#321A37",
    title: "subscription",
    subtitle: "Pro Plan · Renews Jan 2026",
    rightType: "chevron" as const,
  },
  {
    id: 3,
    icon: <Image source={images.bell} className="w-[22px] h-[22px]" />,
    iconBgClass: "#352E2B",
    title: "notifications",
    subtitle: "New releases & reminders",
    rightType: "toggle" as const,
  },
  {
    id: 4,
    icon: <Image source={images.internet} className="w-[22px] h-[22px]" />,
    iconBgClass: "#172731",
    title: "language",
    subtitle: "English (US)",
    rightType: "chevron" as const,
  },
];

const Profile = () => {
  const tabBarHeight = useBottomTabBarHeight();

  const [customAlert, setCustomAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: "",
    message: "",
  });

  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH);

      router.replace("/login");
    } catch (error: any) {
      console.log("Sign out error:", error);
      setCustomAlert({
        visible: true,
        title: "Sign out failed",
        message: error?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <View className="bg-primary flex-1 px-10">
      <View className="flex justify-between mt-16 mb-2 items-center flex-row">
        <Text className="text-white font-bold text-[24px]">Profile</Text>
        <View className="flex items-center bg-dark-300 border-dark-400 border p-3 rounded-md">
          <TouchableOpacity>
            <Octicons name={"gear"} size={18} color="#8B88A8" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="w-full items-center mt-3 mb-2">
        <View className="relative mb-2">
          <Image
            source={images.profile}
            className="w-[140px] h-[140px] rounded-full"
            resizeMode="cover"
          />
          <TouchableOpacity className="w-[35px] h-[35px] bg-orange rounded-full justify-center items-center -mt-7 ml-24">
            <Feather name={"edit-3"} size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <Text className="text-white font-bold text-[20px]">Micheal Ross</Text>
        <Text className="text-light-200 font-medium text-[16px]">
          @micheal_movies
        </Text>
      </View>
      <ProfileStatsCard />
      <ScrollView
        className="flex-1 bg-primary"
        contentContainerStyle={{ paddingBottom: tabBarHeight + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex flex-col mt-6">
          <Text className="text-dark-500 font-bold uppercase">
            Favourite Genres
          </Text>
          <Genre genres={favouriteGenres} />
        </View>
        <View className="flex flex-col gap-6 mt-6">
          <Text className="text-dark-500 font-bold uppercase">Account</Text>
          <View className="gap-1">
            {profileItems.map((item) => (
              <ProfileCardNavigation
                key={item.id}
                icon={item.icon}
                iconBgClass={item.iconBgClass}
                title={item.title}
                subtitle={item.subtitle}
                rightType={item.rightType}
                toggle={
                  item.rightType === "toggle" ? (
                    <Switch
                      value={true}
                      onValueChange={() => {}}
                      trackColor={{ false: "#2A2740", true: "#D946EF" }}
                      thumbColor="#FFFFFF"
                    />
                  ) : undefined
                }
              />
            ))}
          </View>
          <TouchableOpacity activeOpacity={0.8} onPress={handleSignOut}>
            <View className="border border-[#7A1B68] bg-[#2B1230] justify-center items-center rounded-[14px]">
              <Text className="text-[#F07CD6] font-bold p-5">Sign Out</Text>
            </View>
          </TouchableOpacity>
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
  );
};

export default Profile;
