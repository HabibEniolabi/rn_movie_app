import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTranslation } from "react-i18next";

import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { deleteUser, updateProfile } from "firebase/auth";

type AvatarOption = {
  emoji: string;
  backgroundColor: string;
};

const AVATAR_OPTIONS: AvatarOption[] = [
  { emoji: "😊", backgroundColor: "#C044D8" },
  { emoji: "🍿", backgroundColor: "#D946C4" },
  { emoji: "🎬", backgroundColor: "#9B4DFF" },
  { emoji: "🔥", backgroundColor: "#F97316" },
  { emoji: "⭐", backgroundColor: "#F59E0B" },
  { emoji: "🚀", backgroundColor: "#3B82F6" },
  { emoji: "😎", backgroundColor: "#10B981" },
  { emoji: "👻", backgroundColor: "#6366F1" },
  { emoji: "🎭", backgroundColor: "#EC4899" },
  { emoji: "🦸", backgroundColor: "#8B5CF6" },
];

const cleanUsername = (value: string) => {
  return value
    .trim()
    .replace(/^@+/, "")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");
};

const getInitials = (firstName: string, lastName: string, fallback = "U") => {
  const first = firstName?.trim()?.[0];
  const last = lastName?.trim()?.[0];

  if (first && last) return `${first}${last}`.toUpperCase();
  if (first) return first.toUpperCase();

  return fallback.slice(0, 2).toUpperCase();
};

const EditProfile = () => {
  const { t } = useTranslation();

  const user = FIREBASE_AUTH.currentUser;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  const [avatarEmoji, setAvatarEmoji] = useState("initials");
  const [avatarBackgroundColor, setAvatarBackgroundColor] = useState("#C044D8");

  const [originalUsername, setOriginalUsername] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  const fullName = useMemo(() => {
    return `${firstName.trim()} ${lastName.trim()}`.trim();
  }, [firstName, lastName]);

  const initials = useMemo(() => {
    return getInitials(firstName, lastName, user?.email || "U");
  }, [firstName, lastName, user?.email]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(FIREBASE_DB, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");

          const savedUsername =
            data.username || user.email?.split("@")[0] || "";

          setUsername(savedUsername);
          setOriginalUsername(savedUsername);

          setAvatarEmoji(data.avatarEmoji || "initials");
          setAvatarBackgroundColor(data.avatarBackgroundColor || "#C044D8");
        } else {
          const fallbackUsername = user.email?.split("@")[0] || "";

          setFirstName(user.displayName?.split(" ")?.[0] || "");
          setLastName(user.displayName?.split(" ")?.slice(1).join(" ") || "");
          setUsername(fallbackUsername);
          setOriginalUsername(fallbackUsername);
          setAvatarEmoji("initials");
          setAvatarBackgroundColor("#C044D8");
        }
      } catch (error) {
        console.log("Fetch edit profile error:", error);

        Alert.alert(
          t("editProfile.errorTitle"),
          t("editProfile.loadFailed")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, t]);

  const checkUsernameAvailable = async (newUsername: string) => {
    if (!user) return false;

    if (newUsername === originalUsername) {
      return true;
    }

    const usernameQuery = query(
      collection(FIREBASE_DB, "users"),
      where("username", "==", newUsername),
      limit(1)
    );

    const snapshot = await getDocs(usernameQuery);

    if (snapshot.empty) return true;

    const existingDoc = snapshot.docs[0];

    return existingDoc.id === user.uid;
  };

  const handleSelectAvatar = (avatar: AvatarOption) => {
    setAvatarEmoji(avatar.emoji);
    setAvatarBackgroundColor(avatar.backgroundColor);
    setAvatarModalVisible(false);
  };

  const handleUseInitials = () => {
    setAvatarEmoji("initials");
    setAvatarBackgroundColor("#C044D8");
    setAvatarModalVisible(false);
  };

  const handleSaveChanges = async () => {
    if (!user) {
      Alert.alert(t("auth.authError"), t("auth.noLoggedInUser"));
      return;
    }

    const normalizedUsername = cleanUsername(username);

    if (!firstName.trim()) {
      Alert.alert(
        t("editProfile.missingName"),
        t("editProfile.firstNameRequired")
      );
      return;
    }

    if (!normalizedUsername) {
      Alert.alert(
        t("editProfile.missingUsername"),
        t("editProfile.usernameRequired")
      );
      return;
    }

    if (normalizedUsername.length < 3) {
      Alert.alert(
        t("editProfile.invalidUsername"),
        t("editProfile.usernameTooShort")
      );
      return;
    }

    try {
      setSaving(true);

      const usernameAvailable = await checkUsernameAvailable(normalizedUsername);

      if (!usernameAvailable) {
        Alert.alert(
          t("editProfile.usernameTaken"),
          t("editProfile.usernameTakenMessage")
        );
        return;
      }

      const userRef = doc(FIREBASE_DB, "users", user.uid);

      await setDoc(
        userRef,
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          fullName,
          username: normalizedUsername,

          avatarType: "avatar",
          avatarEmoji,
          avatarBackgroundColor,
          photoURL: null,

          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await updateProfile(user, {
        displayName: fullName,
        photoURL: null,
      });

      setUsername(normalizedUsername);
      setOriginalUsername(normalizedUsername);

      Alert.alert(
        t("editProfile.successTitle"),
        t("editProfile.profileUpdated")
      );

      router.back();
    } catch (error) {
      console.log("Save profile error:", error);

      Alert.alert(
        t("editProfile.errorTitle"),
        t("editProfile.saveFailed")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t("editProfile.deleteAccount"),
      t("editProfile.deleteAccountWarning"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("editProfile.delete"),
          style: "destructive",
          onPress: confirmDeleteAccount,
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    if (!user) return;

    try {
      setSaving(true);

      await deleteDoc(doc(FIREBASE_DB, "users", user.uid));
      await deleteUser(user);

      router.replace("/login");
    } catch (error: any) {
      console.log("Delete account error:", error);

      if (error?.code === "auth/requires-recent-login") {
        Alert.alert(
          t("editProfile.reloginRequired"),
          t("editProfile.reloginRequiredMessage")
        );
        return;
      }

      Alert.alert(
        t("editProfile.errorTitle"),
        t("editProfile.deleteFailed")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <ActivityIndicator size="large" color="#B954F5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={Platform.OS === "ios" ? 40 : 110}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 52,
          paddingBottom: 42,
        }}
      >
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            className="w-[54px] h-[54px] rounded-[18px] border border-[#2A2845] bg-dark-300 items-center justify-center"
          >
            <Feather name="chevron-left" size={24} color="#8B88A8" />
          </TouchableOpacity>

          <Text className="text-white font-bold text-[28px]">
            {t("editProfile.title")}
          </Text>
        </View>

        <View className="w-full items-center justify-center mt-10">
          <View className="relative mb-3">
            <LinearGradient
              colors={[avatarBackgroundColor, "#9B4DFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: "100%" }}
              className="w-[150px] h-[150px] rounded-full items-center justify-center"
            >
              <Text className="text-white text-[44px] font-extrabold">
                {avatarEmoji === "initials" ? initials : avatarEmoji}
              </Text>
            </LinearGradient>

            <TouchableOpacity
              className="w-[40px] h-[40px] bg-orange rounded-full justify-center items-center absolute bottom-2 right-0 border-4 border-primary"
              onPress={() => setAvatarModalVisible(true)}
              activeOpacity={0.85}
            >
              <Feather name="edit-3" size={17} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <Text className="text-[#B954F5] font-bold text-[16px] mt-2">
            {t("editProfile.changeAvatar")}
          </Text>

          <TouchableOpacity
            onPress={() => setAvatarModalVisible(true)}
            activeOpacity={0.85}
            className="w-full h-[78px] rounded-[22px] border border-[#A33A8F] bg-[#26142D] items-center justify-center mt-8"
          >
            <Text className="text-[#F08AD8] font-bold text-[17px]">
              😊 {t("editProfile.chooseAvatar")}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-10 gap-5">
          <View>
            <Text className="text-[#8B88A8] font-bold mb-2">
              {t("editProfile.firstName")}
            </Text>

            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder={t("editProfile.firstNamePlaceholder")}
              placeholderTextColor="#4C4968"
              className="h-[58px] rounded-[18px] border border-[#2A2845] bg-dark-300 px-5 text-white text-[17px] font-semibold"
            />
          </View>

          <View>
            <Text className="text-[#8B88A8] font-bold mb-2">
              {t("editProfile.lastName")}
            </Text>

            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder={t("editProfile.lastNamePlaceholder")}
              placeholderTextColor="#4C4968"
              className="h-[58px] rounded-[18px] border border-[#2A2845] bg-dark-300 px-5 text-white text-[17px] font-semibold"
            />
          </View>

          <View>
            <Text className="text-[#8B88A8] font-bold mb-2">
              {t("editProfile.username")}
            </Text>

            <View className="h-[58px] rounded-[18px] border border-[#2A2845] bg-dark-300 px-5 flex-row items-center">
              <Text className="text-[#B954F5] text-[18px] font-bold mr-1">
                @
              </Text>

              <TextInput
                value={username}
                onChangeText={(value) => setUsername(cleanUsername(value))}
                placeholder={t("editProfile.usernamePlaceholder")}
                placeholderTextColor="#4C4968"
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 text-white text-[17px] font-semibold"
              />
            </View>

            <Text className="text-[#6A6880] mt-2 text-[13px]">
              {t("editProfile.usernameHint")}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSaveChanges}
          disabled={saving}
          activeOpacity={0.85}
          className={`h-[58px] rounded-[20px] items-center justify-center mt-8 ${
            saving ? "bg-[#4C4968]" : "bg-[#B954F5]"
          }`}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white text-[18px] font-bold">
              {t("editProfile.saveChanges")}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDeleteAccount}
          disabled={saving}
          activeOpacity={0.85}
          className="h-[58px] rounded-[20px] items-center justify-center mt-4 border border-[#FF6B6B]/40 bg-[#FF6B6B]/10"
        >
          <Text className="text-[#FF6B6B] text-[18px] font-bold">
            {t("editProfile.deleteAccount")}
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      <Modal
        visible={avatarModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <View className="flex-1 bg-black/70 justify-end">
          <View className="bg-[#141325] rounded-t-[32px] border border-[#2A2845] px-6 pt-6 pb-10">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-white text-[22px] font-bold">
                {t("editProfile.chooseAvatar")}
              </Text>

              <Pressable onPress={() => setAvatarModalVisible(false)}>
                <Feather name="x" size={24} color="#8B88A8" />
              </Pressable>
            </View>

            <View className="flex-row flex-wrap gap-4">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleUseInitials}
                className="w-[70px] h-[70px] rounded-full bg-[#C044D8] items-center justify-center"
              >
                <Text className="text-white text-[24px] font-bold">
                  {initials}
                </Text>
              </TouchableOpacity>

              {AVATAR_OPTIONS.map((avatar) => (
                <TouchableOpacity
                  key={`${avatar.emoji}-${avatar.backgroundColor}`}
                  activeOpacity={0.85}
                  onPress={() => handleSelectAvatar(avatar)}
                  className="w-[70px] h-[70px] rounded-full items-center justify-center"
                  style={{ backgroundColor: avatar.backgroundColor }}
                >
                  <Text className="text-[30px]">{avatar.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditProfile;