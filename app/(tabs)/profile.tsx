import {
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { icons } from "@/constants/icons";
import Octicons from "react-native-vector-icons/Octicons";
import Feather from "react-native-vector-icons/Feather";
import { images } from "@/constants/images";
import ProfileStatsCard from "@/components/ProfileStatsCard";
import Genre from "@/components/Genre";
import { useLocalSearchParams } from "expo-router";
import ProfileCardNavigation from "@/components/ProfileCardNavigation";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

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
    icon: <Feather name="user" size={22} color="#8FB3FF" />,
    iconBgClass: "bg-surface-purple",
    title: "edit profile",
    subtitle: "Update your name & avatar",
    rightType: "chevron" as const,
  },
  {
    id: 2,
    icon: <Feather name="gift" size={22} color="#7DD3FC" />,
    iconBgClass: "bg-surface-plum",
    title: "subscription",
    subtitle: "Pro Plan · Renews Jan 2026",
    rightType: "chevron" as const,
  },
  {
    id: 3,
    icon: <Feather name="bell" size={22} color="#FACC15" />,
    iconBgClass: "bg-surface-olive",
    title: "notifications",
    subtitle: "New releases & reminders",
    rightType: "toggle" as const,
  },
  {
    id: 4,
    icon: <Feather name="globe" size={22} color="#67E8F9" />,
    iconBgClass: "bg-surface-teal",
    title: "language",
    subtitle: "English (US)",
    rightType: "chevron" as const,
  },
];

const Profile = () => {
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <View className="bg-primary flex-1 px-10">
      <View className="flex justify-between mt-20 mb-10 items-center flex-row">
        <Text className="text-white font-bold text-lg">Profile</Text>
        <View className="flex items-center bg-dark-300 border-dark-400 border p-3 rounded-md">
          <TouchableOpacity>
            <Octicons name={"gear"} size={18} color="#000000" />
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
        <View className="flex flex-col gap-2 mt-6">
          <Text className="text-dark-500 font-bold uppercase mb-3">Account</Text>
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
      </ScrollView>
    </View>
  );
};

export default Profile;
