import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { useTranslation } from "react-i18next";
import useFetch from "@/services/useFetch";
import {
  getContentNotifications,
  type ContentNotification,
} from "@/services/appwrite";

const getPosterUrl = (posterPath?: string | null) => {
  if (!posterPath) return null;

  if (posterPath.startsWith("http")) return posterPath;

  return `https://image.tmdb.org/t/p/w500${posterPath}`;
};

const getTypeColor = (type: ContentNotification["type"]) => {
  switch (type) {
    case "movie":
      return "#AB8BFF";
    case "tv":
      return "#38BDF8";
    case "category":
      return "#F59E0B";
    default:
      return "#3B82F6";
  }
};

const getCategoryIcon = (category: ContentNotification["category"]) => {
  switch (category) {
    case "comedies":
      return "smile";
    case "tv_shows":
    case "series":
      return "tv";
    case "anime":
      return "star";
    case "new_hot":
      return "zap";
    case "action":
      return "target";
    case "romance":
      return "heart";
    default:
      return "film";
  }
};

const NotificationsScreen = () => {
  const { t, i18n } = useTranslation();

  const {
    data: notifications,
    loading,
    error,
    refetch,
  } = useFetch(getContentNotifications);

  useEffect(() => {
    refetch();
  }, [i18n.language]);

  const handlePressNotification = (item: ContentNotification) => {
    if (item.type === "movie" && item.mediaId) {
      router.push({
        pathname: "/movie/[id]" as const,
        params: {
          id: String(item.mediaId),
        },
      });

      return;
    }

    if (item.type === "tv" && item.mediaId) {
      // Later when you create /show/[id], change this to /show/[id]
      router.push({
        pathname: "/show/[id]" as const,
        params: {
          id: String(item.mediaId),
        },
      });

      return;
    }

    router.push({
      pathname: "/search",
      params: {
        category: item.category,
      },
    });
  };

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
                "Movie, series and category updates will appear here.",
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
          renderItem={({ item }) => {
            const posterUrl = getPosterUrl(item.posterPath);

            return (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handlePressNotification(item)}
                className="rounded-2xl bg-dark-300 border border-white/10 px-4 py-4 mb-4"
              >
                <View className="flex-row">
                  {posterUrl ? (
                    <Image
                      source={{ uri: posterUrl }}
                      className="w-[72px] h-[104px] rounded-xl bg-black"
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      className="w-[72px] h-[104px] rounded-xl items-center justify-center"
                      style={{
                        backgroundColor: getTypeColor(item.type),
                      }}
                    >
                      <Feather
                        name={getCategoryIcon(item.category)}
                        size={30}
                        color="#fff"
                      />
                    </View>
                  )}

                  <View className="flex-1 ml-4">
                    <View className="flex-row items-center mb-2">
                      <View
                        className="w-2.5 h-2.5 rounded-full mr-2"
                        style={{
                          backgroundColor: getTypeColor(item.type),
                        }}
                      />

                      <Text className="text-[#AB8BFF] text-xs font-extrabold uppercase">
                        {item.category.replace("_", " ")}
                      </Text>
                    </View>

                    <Text className="text-white text-base font-extrabold">
                      {item.title}
                    </Text>

                    <Text
                      className="text-light-200 text-sm leading-5 mt-2"
                      numberOfLines={3}
                    >
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
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

export default NotificationsScreen;