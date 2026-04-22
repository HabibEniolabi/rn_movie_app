import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";
import Octicons from "react-native-vector-icons/Octicons";
import Feather from "react-native-vector-icons/Feather";
import { images } from "@/constants/images";
import ProfileStatsCard from "@/components/ProfileStatsCard";

const Profile = () => {
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
        <Text className="text-light-200 font-medium text-[16px]">@micheal_movies</Text>
      </View>
      <ProfileStatsCard />
      <View className="flex flex-col mt-6">
        <Text className="text-dark-500 font-bold uppercase">Favourite Genres</Text>
      </View>
    </View>
  );
};

export default Profile;
