import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Feather from "react-native-vector-icons/Feather";

interface ProfileCardNavigationProps {
  icon: React.ReactNode;
  iconBgClass: string;
  title: string;
  subtitle: string;
  rightType?: "chevron" | "toggle";
  toggle?: React.ReactNode;
  onPress?: () => void;
}

const ProfileCardNavigation = ({
  icon,
  title,
  subtitle,
  iconBgClass,
  rightType = "chevron",
  onPress,
  toggle,
}: ProfileCardNavigationProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View className="flex-row gap-3 items-center justify-between rounded-[24px] bg-dark-500 px-4 py-4">
        <View
          className={`w-[54px] h-[54px] justify-center items-center rounded-[14px] ${iconBgClass}`}
        >
          {icon}
        </View>
        <View className="flex flex-col gap-2">
          <Text className="text-[24px] font-bold capitalize text-white">
            {title}
          </Text>
          <Text className="text-[14px] font-medium text-dark-500">
            {subtitle}
          </Text>
        </View>
        <View>
          {rightType === "toggle" ? (
            toggle
          ) : (
            <Feather name="chevron-right" size={20} color="#4C4A78" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileCardNavigation;
