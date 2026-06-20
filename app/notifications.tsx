import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
// import Fontisto from "react-native-vector-icons/Fontisto";
import { useTranslation } from "react-i18next";
import useFetch from "@/services/useFetch";
import {
  getSystemNotifications,
  type AppNotification,
} from "@/services/appwrite";

const getTypeColor = (type: AppNotification["type"]) => {
  switch (type) {
    case "critical":
      return "#EF4444";
    case "warning":
      return "#F59E0B";
    case "update":
      return "#AB8BFF";
    default:
      return "#3B82F6";
  }
};

const NotificationsScreen = () => {
  const { t, i18n } = useTranslation();

  const {
    data: notifications,
    loading,
    error,
    refetch,
  } = useFetch(getSystemNotifications);

  useEffect(() => {
    refetch();
  }, [i18n.language]);

  return (
    <View className="flex-1 bg-primary px-5 pt-14">
      <View className="flex-row items-center justify-between mb-7">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 rounded-full bg-white/10 items-center justify-center"
        >
          <Feather name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>

        <Text className="text-white text-2xl font-extrabold">
          {t("notifications.title", { defaultValue: "Notifications" })}
        </Text>

        <View className="w-11 h-11" />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#AB8BFF" className="mt-20" />
      ) : error ? (
        <Text className="text-light-200 text-center mt-20">
          {t("notifications.failedToLoad", {
            defaultValue: "Unable to load notifications.",
          })}
        </Text>
      ) : !notifications?.length ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-20 h-20 rounded-full bg-white/10 items-center justify-center mb-5">
            <Feather name="bell" size={34} color="#AB8BFF" />
          </View>

          <Text className="text-white text-xl font-extrabold text-center">
            {t("notifications.emptyTitle", {
              defaultValue: "No notifications yet",
            })}
          </Text>

          <Text className="text-light-200 text-center mt-2 leading-6">
            {t("notifications.emptyMessage", {
              defaultValue:
                "Important updates about MovieFlix will appear here.",
            })}
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.$id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
          }}
          renderItem={({ item }) => (
            <View className="rounded-2xl bg-dark-300 border border-white/10 px-4 py-4 mb-4">
              <View className="flex-row items-start">
                <View
                  className="w-3 h-3 rounded-full mt-2 mr-3"
                  style={{
                    backgroundColor: getTypeColor(item.type),
                  }}
                />

                <View className="flex-1">
                  <Text className="text-white text-base font-extrabold">
                    {item.title}
                  </Text>

                  <Text className="text-light-200 text-sm leading-6 mt-2">
                    {item.message}
                  </Text>

                  {!!item.$createdAt && (
                    <Text className="text-[#6A6880] text-xs mt-3">
                      {new Date(item.$createdAt).toLocaleDateString(
                        i18n.language,
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default NotificationsScreen;