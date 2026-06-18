import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Feather from "react-native-vector-icons/Feather";
import { router } from "expo-router";

type NotificationBellProps = {
  count?: number;
};

const NotificationBell = ({ count = 0 }: NotificationBellProps) => {
  const displayCount = count > 9 ? "9+" : String(count);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push("/notifications")}
      className="w-11 h-11 rounded-full bg-white/10 items-center justify-center relative"
    >
      <Feather name="bell" size={23} color="#fff" />

      {count > 0 && (
        <View className="absolute -top-1 -right-1 min-w-[20px] h-[20px] rounded-full bg-red-600 items-center justify-center px-1">
          <Text className="text-white text-[11px] font-extrabold">
            {displayCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default NotificationBell;