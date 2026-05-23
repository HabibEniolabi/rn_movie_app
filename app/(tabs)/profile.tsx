import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Octicons from "react-native-vector-icons/Octicons";
import Feather from "react-native-vector-icons/Feather";
import { images } from "@/constants/images";
import ProfileStatsCard from "@/components/ProfileStatsCard";
import Genre from "@/components/Genre";
import ProfileCardNavigation from "@/components/ProfileCardNavigation";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { router, useFocusEffect } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { getMovieGenres, MovieGenre } from "@/services/genres";
import { LinearGradient } from "expo-linear-gradient";
import {
  getProfileAvatarByKey,
  type AvatarType,
} from "@/constants/profileAvatars";

const getInitials = (fullName: string, fallback = "U") => {
  const parts = fullName.trim().split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return fallback.slice(0, 2).toUpperCase();
};

const isValidAvatarType = (value: unknown): value is AvatarType => {
  return value === "initials" || value === "gallery" || value === "memoji";
};

const Profile = () => {
  const { t, i18n } = useTranslation();
  const tabBarHeight = useBottomTabBarHeight();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  const [avatarType, setAvatarType] = useState<AvatarType>("initials");
  const [avatarKey, setAvatarKey] = useState<string | null>(null);
  const [avatarBackgroundColor, setAvatarBackgroundColor] = useState("#C044D8");

  const [favouriteGenreIds, setFavouriteGenreIds] = useState<string[]>([]);
  const [availableGenres, setAvailableGenres] = useState<MovieGenre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);

  const [customAlert, setCustomAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: "",
    message: "",
  });

  const selectedAvatar = getProfileAvatarByKey(avatarKey);

  const initials = useMemo(() => {
    const user = FIREBASE_AUTH.currentUser;

    return getInitials(
      fullName,
      user?.email?.split("@")[0] || t("profile.defaultUsername")
    );
  }, [fullName, t]);

  const translatedFavouriteGenres = useMemo(() => {
    return availableGenres
      .filter((genre) => favouriteGenreIds.includes(genre.id))
      .map((genre) => ({
        id: genre.id,
        name: genre.name,
      }));
  }, [availableGenres, favouriteGenreIds]);

  const profileItems = useMemo(
    () => [
      {
        id: 1,
        icon: <Image source={images.user} className="w-[22px] h-[22px]" />,
        iconBgClass: "#281E43",
        title: t("profile.editProfile"),
        subtitle: t("profile.editProfileSubtitle"),
        rightType: "chevron" as const,
        onPress: () => router.push("/account/edit-profile"),
      },
      {
        id: 2,
        icon: <Image source={images.diamond} className="w-[22px] h-[22px]" />,
        iconBgClass: "#321A37",
        title: t("profile.subscription"),
        subtitle: t("profile.subscriptionSubtitle"),
        rightType: "chevron" as const,
        onPress: () => router.push("/onboarding/plan-comparison"),
      },
      {
        id: 3,
        icon: <Image source={images.bell} className="w-[22px] h-[22px]" />,
        iconBgClass: "#352E2B",
        title: t("profile.notifications"),
        subtitle: t("profile.notificationsSubtitle"),
        rightType: "toggle" as const,
        onPress: () => {},
      },
      {
        id: 4,
        icon: <Image source={images.internet} className="w-[22px] h-[22px]" />,
        iconBgClass: "#172731",
        title: t("profile.language"),
        subtitle: t("profile.languageSubtitle"),
        rightType: "chevron" as const,
        onPress: () => router.push("/account/language"),
      },
    ],
    [t]
  );

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoadingGenres(true);

        const genres = await getMovieGenres(i18n.language);

        setAvailableGenres(genres);
      } catch (error) {
        console.log("Fetch profile genres error:", error);
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchGenres();
  }, [i18n.language]);

  const fetchProfile = useCallback(async () => {
    const user = FIREBASE_AUTH.currentUser;

    if (!user) return;

    try {
      const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));

      if (userDoc.exists()) {
        const data = userDoc.data();

        const savedFullName =
          data.fullName ||
          `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
          user.displayName ||
          t("profile.defaultFullName");

        const savedUsername =
          data.username ||
          data.firstName?.toLowerCase() ||
          user.email?.split("@")[0] ||
          t("profile.defaultUsername");

        const savedAvatarType = isValidAvatarType(data.avatarType)
          ? data.avatarType
          : "initials";

        setFullName(savedFullName);
        setUsername(`@${savedUsername}`);

        setAvatarType(savedAvatarType);
        setAvatarKey(data.avatarKey || null);
        setAvatarBackgroundColor(data.avatarBackgroundColor || "#C044D8");

        setFavouriteGenreIds(
          Array.isArray(data.favouriteGenres) ? data.favouriteGenres : []
        );
      } else {
        setFullName(user.displayName || t("profile.defaultFullName"));

        setUsername(
          `@${user.email?.split("@")[0] || t("profile.defaultUsername")}`
        );

        setAvatarType("initials");
        setAvatarKey(null);
        setAvatarBackgroundColor("#C044D8");
        setFavouriteGenreIds([]);
      }
    } catch (error) {
      console.log("Fetch profile error:", error);
    }
  }, [t]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH);

      router.replace("/login");
    } catch (error: any) {
      console.log("Sign out error:", error);

      setCustomAlert({
        visible: true,
        title: t("profile.signOutFailed"),
        message: error?.message || t("common.somethingWentWrong"),
      });
    }
  };

  const renderProfileAvatar = () => {
    if (avatarType === "gallery" && selectedAvatar?.image) {
      return (
        <View
          className="w-[140px] h-[140px] rounded-full overflow-hidden bg-[#0F0D23]"
          style={{ borderRadius: 999 }}
        >
          <Image
            source={selectedAvatar.image}
            className="w-full h-full"
            resizeMode="cover"
            style={{ borderRadius: 999 }}
          />
        </View>
      );
    }

    if (avatarType === "memoji" && selectedAvatar?.image) {
      return (
        <View
          className="w-[140px] h-[140px] rounded-full overflow-hidden items-center justify-center"
          style={{
            borderRadius: 999,
            backgroundColor: avatarBackgroundColor,
          }}
        >
          <Image
            source={selectedAvatar.image}
            className="w-[118px] h-[118px]"
            resizeMode="contain"
          />
        </View>
      );
    }

    return (
      <LinearGradient
        colors={[avatarBackgroundColor, "#9B4DFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-[140px] h-[140px] rounded-full items-center justify-center"
        style={{ borderRadius: 999 }}
      >
        <Text className="text-white text-[40px] font-extrabold">
          {initials}
        </Text>
      </LinearGradient>
    );
  };
  return (
    <View className="bg-primary flex-1 px-10">
      <View className="flex justify-between mt-16 mb-2 items-center flex-row">
        <Text className="text-white font-bold text-[24px]">
          {t("profile.title")}
        </Text>
        <View className="flex items-center bg-dark-300 border-dark-400 border p-3 rounded-md">
          <TouchableOpacity>
            <Octicons name={"gear"} size={18} color="#8B88A8" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="w-full items-center mt-3 mb-2">
        <View className="relative mb-2">
          {renderProfileAvatar()}
          <TouchableOpacity
            onPress={() => router.push("/account/edit-profile")}
            className="w-[35px] h-[35px] bg-orange rounded-full justify-center items-center -mt-7 ml-24"
          >
            <Feather name={"edit-3"} size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <Text className="text-white font-bold text-[20px]">{fullName}</Text>
        <Text className="text-light-200 font-medium text-[16px]">
          {username}
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
            {t("profile.favouriteGenres")}
          </Text>
          {loadingGenres ? (
            <View className="items-start mt-4">
              <ActivityIndicator size="small" color="#B954F5" />
            </View>
          ) : translatedFavouriteGenres.length > 0 ? (
            <Genre genres={translatedFavouriteGenres} />
          ) : (
            <Text className="text-[#8B88A8] text-base mt-3">
              {t("profile.noFavouriteGenres")}
            </Text>
          )}
        </View>
        <View className="flex flex-col gap-6 mt-6">
          <Text className="text-dark-500 font-bold uppercase">
            {t("profile.account")}
          </Text>
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
                onPress={item.onPress}
              />
            ))}
          </View>
          <TouchableOpacity activeOpacity={0.8} onPress={handleSignOut}>
            <View className="border border-[#7A1B68] bg-[#2B1230] justify-center items-center rounded-[14px]">
              <Text className="text-[#F07CD6] font-bold p-5">
                {t("profile.signOut")}
              </Text>
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
              <Text className="text-white font-bold text-lg">
                {t("common.okay")}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;
