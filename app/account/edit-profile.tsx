import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTranslation } from "react-i18next";

import {
  GALLERY_AVATARS,
  MEMOJI_AVATARS,
  getProfileAvatarByKey,
  type AvatarType,
  type ProfileAvatarOption,
} from "@/constants/profileAvatars";

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

const isValidAvatarType = (value: unknown): value is AvatarType => {
  return value === "initials" || value === "gallery" || value === "memoji";
};

const EditProfile = () => {
  const { t } = useTranslation();

  const user = FIREBASE_AUTH.currentUser;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(user?.email || "");

  // const [isSending, setIsSending] = useState(false);

  const [avatarType, setAvatarType] = useState<AvatarType>("initials");
  const [avatarKey, setAvatarKey] = useState<string | null>(null);
  const [avatarBackgroundColor, setAvatarBackgroundColor] = useState("#C044D8");
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  const [originalUsername, setOriginalUsername] = useState("");

  const [avatarPickerMode, setAvatarPickerMode] = useState<
    "avatar" | "gallery"
  >("avatar");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const selectedAvatar = getProfileAvatarByKey(avatarKey);

  const fullName = useMemo(() => {
    return `${firstName.trim()} ${lastName.trim()}`.trim();
  }, [firstName, lastName]);

  const initials = useMemo(() => {
    return getInitials(firstName, lastName, user?.email || "U");
  }, [firstName, lastName, user?.email]);

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const buildUsernameSeed = (first: string, last: string) => {
    const cleanFirst = cleanUsername(first);
    const cleanLast = cleanUsername(last);

    const nameBasedUsername = [cleanFirst, cleanLast].filter(Boolean).join("_");

    return nameBasedUsername || "movie_fan";
  };

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

  const generateUniqueUsername = async (first: string, last: string) => {
    const base = buildUsernameSeed(first, last);

    const candidates = [
      base,
      `${base}_movies`,
      `${base}_${Math.floor(1000 + Math.random() * 9000)}`,
      `${base}_${Date.now().toString().slice(-4)}`,
    ];

    for (const candidate of candidates) {
      const available = await checkUsernameAvailable(candidate);

      if (available) {
        return candidate;
      }
    }

    return `${base}_${Date.now().toString().slice(-6)}`;
  };

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

          const savedFirstName = data.firstName || "";
          const savedLastName = data.lastName || "";

          setFirstName(savedFirstName);
          setLastName(savedLastName);
          setEmail(data.email || user.email || "");

          const savedUsername =
            data.username ||
            (await generateUniqueUsername(savedFirstName, savedLastName));

          setUsername(savedUsername);
          setOriginalUsername(savedUsername);

          const savedAvatarType = isValidAvatarType(data.avatarType)
            ? data.avatarType
            : "initials";

          setAvatarType(savedAvatarType);
          setAvatarKey(data.avatarKey || null);
          setAvatarBackgroundColor(data.avatarBackgroundColor || "#C044D8");
        } else {
          const fallbackFirstName = user.displayName?.split(" ")?.[0] || "";
          const fallbackLastName =
            user.displayName?.split(" ")?.slice(1).join(" ") || "";
          const fallbackUsername = await generateUniqueUsername(
            fallbackFirstName,
            fallbackLastName
          );

          setFirstName(fallbackFirstName);
          setLastName(fallbackLastName);
          setUsername(fallbackUsername);
          setEmail(user.email || "");
          setOriginalUsername(fallbackUsername);

          setAvatarType("initials");
          setAvatarKey(null);
          setAvatarBackgroundColor("#C044D8");
        }
      } catch (error) {
        console.log("Fetch edit profile error:", error);

        Alert.alert(t("editProfile.errorTitle"), t("editProfile.loadFailed"));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, t]);

  const handleSelectAvatar = (avatar: ProfileAvatarOption) => {
    setAvatarType(avatar.type);
    setAvatarKey(avatar.key);
    setAvatarBackgroundColor(avatar.backgroundColor || "#C044D8");
    setAvatarModalVisible(false);
  };

  const handleUseInitials = () => {
    setAvatarType("initials");
    setAvatarKey(null);
    setAvatarBackgroundColor("#C044D8");
    setAvatarModalVisible(false);
  };

  const openAvatarModal = (mode: "avatar" | "gallery") => {
    setAvatarPickerMode(mode);
    setAvatarModalVisible(true);
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

      const usernameAvailable = await checkUsernameAvailable(
        normalizedUsername
      );

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
          email: user.email || email.trim().toLowerCase(),
          username: normalizedUsername,

          avatarType,
          avatarKey: avatarType === "initials" ? null : avatarKey,
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

      Alert.alert(t("editProfile.errorTitle"), t("editProfile.saveFailed"));
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

      Alert.alert(t("editProfile.errorTitle"), t("editProfile.deleteFailed"));
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
            {avatarType === "gallery" && selectedAvatar?.image ? (
              <View
                className="w-[150px] h-[150px] rounded-full overflow-hidden"
                style={{ borderRadius: 999 }}
              >
                <Image
                  source={selectedAvatar.image}
                  className="w-full h-full"
                  resizeMode="cover"
                  style={{ borderRadius: 999 }}
                />
              </View>
            ) : avatarType === "memoji" && selectedAvatar?.image ? (
              <View
                className="w-[150px] h-[150px] rounded-full overflow-hidden items-center justify-center"
                style={{
                  borderRadius: 999,
                  backgroundColor: avatarBackgroundColor,
                }}
              >
                <Image
                  source={selectedAvatar.image}
                  className="w-[125px] h-[125px]"
                  resizeMode="contain"
                />
              </View>
            ) : (
              <LinearGradient
                colors={[avatarBackgroundColor, "#9B4DFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-[150px] h-[150px] rounded-full items-center justify-center"
                style={{ borderRadius: 999 }}
              >
                <Text className="text-white text-[44px] font-extrabold">
                  {initials}
                </Text>
              </LinearGradient>
            )}

            <TouchableOpacity
              className="w-[35px] h-[35px] bg-orange rounded-full justify-center items-center -mt-7 ml-24"
              onPress={() => setAvatarModalVisible(true)}
              activeOpacity={0.85}
            >
              <Feather name="edit-3" size={17} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <Text className="text-[#B954F5] font-bold text-[16px] mt-2">
            {t("editProfile.changeAvatar")}
          </Text>

          <View className="flex-row gap-4 mt-8 w-full">
            <TouchableOpacity
              onPress={() => openAvatarModal("avatar")}
              activeOpacity={0.85}
              className="flex-1 h-[88px] rounded-[22px] border border-[#A33A8F] bg-[#26142D] items-center justify-center px-3"
            >
              <Text className="text-[#F08AD8] font-bold text-[16px] text-center">
                😊 {t("editProfile.avatar")}
              </Text>

              <Text className="text-[#8B88A8] text-[12px] text-center mt-1">
                {t("editProfile.initials")} + {t("editProfile.memoji")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openAvatarModal("gallery")}
              activeOpacity={0.85}
              className="flex-1 h-[88px] rounded-[22px] border border-[#2A2845] bg-dark-300 items-center justify-center px-3"
            >
              <Text className="text-[#8B88A8] font-bold text-[16px] text-center">
                🖼️ {t("editProfile.gallery")}
              </Text>

              <Text className="text-[#6A6880] text-[12px] text-center mt-1">
                {t("editProfile.presetImages")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-10 gap-5">
          <Text className="text-dark-500 uppercase text-[20px] font-semibold">
            {t("editProfile.personalInfo")}
          </Text>
          <View>
            <Text className="text-[#8B88A8] font-bold mb-2">
              {t("editProfile.firstName")}
            </Text>

            <View className="h-[58px] rounded-[18px] border border-[#2A2845] bg-dark-300  flex-row items-center justify-between">
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder={t("editProfile.firstNamePlaceholder")}
                placeholderTextColor="#4C4968"
                className="ml-4 flex-1 text-white text-[17px] font-semibold"
              />
              {firstName.trim() !== "" && (
                <Text className="w-[30px] h-[30px] text-green-500 items-center justify-center">
                  ✓
                </Text>
              )}
            </View>
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
          <View className="flex-row items-center rounded-[18px] border border-[#2A2845] bg-[#0F0E1E] h-[60px]">
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder={t("auth.emailPlaceholder")}
              placeholderTextColor="#3A3858"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              className="ml-4 flex-1 text-[#EDEAF8] text-lg font-semibold"
            />

            {isValidEmail(email) && (
              <Text className="w-[30px] h-[30px] text-green-500 items-center justify-center">
                ✓
              </Text>
            )}
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
          <View
            className="bg-[#141325] rounded-t-[32px] border border-[#2A2845] px-6 pt-6 pb-8"
            style={{ maxHeight: "82%" }}
          >
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-white text-[22px] font-bold">
                {avatarPickerMode === "avatar"
                  ? t("editProfile.chooseAvatar")
                  : t("editProfile.gallery")}
              </Text>

              <Pressable onPress={() => setAvatarModalVisible(false)}>
                <Feather name="x" size={24} color="#8B88A8" />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
            >
              {avatarPickerMode === "avatar" && (
                <>
                  <Text className="text-[#8B88A8] font-bold uppercase mb-4">
                    {t("editProfile.initials")}
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleUseInitials}
                    className="w-[74px] h-[74px] rounded-full bg-[#C044D8] items-center justify-center mb-6"
                  >
                    <Text className="text-white text-[24px] font-bold">
                      {initials}
                    </Text>
                  </TouchableOpacity>

                  <Text className="text-[#8B88A8] font-bold uppercase mb-4">
                    {t("editProfile.memoji")}
                  </Text>

                  <View className="flex-row flex-wrap gap-4">
                    {MEMOJI_AVATARS.map((avatar) => (
                      <TouchableOpacity
                        key={avatar.key}
                        activeOpacity={0.85}
                        onPress={() => handleSelectAvatar(avatar)}
                        className="w-[74px] h-[74px] rounded-full overflow-hidden items-center justify-center"
                        style={{
                          borderRadius: 999,
                          backgroundColor: avatar.backgroundColor || "#E9DDFF",
                        }}
                      >
                        <Image
                          source={avatar.image}
                          className="w-[62px] h-[62px]"
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {avatarPickerMode === "gallery" && (
                <>
                  <Text className="text-[#8B88A8] font-bold uppercase mb-4">
                    {t("editProfile.gallery")}
                  </Text>

                  <View className="flex-row flex-wrap gap-4">
                    {GALLERY_AVATARS.map((avatar) => (
                      <TouchableOpacity
                        key={avatar.key}
                        activeOpacity={0.85}
                        onPress={() => handleSelectAvatar(avatar)}
                        className="w-[74px] h-[74px] rounded-full overflow-hidden border border-[#2A2845] bg-[#0F0D23]"
                        style={{ borderRadius: 999 }}
                      >
                        <Image
                          source={avatar.image}
                          className="w-full h-full"
                          resizeMode="cover"
                          style={{ borderRadius: 999 }}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditProfile;
