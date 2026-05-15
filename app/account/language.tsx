import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import React, { useMemo, useState } from "react";
import { router } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

import i18n, {
  changeAppLanguage,
  getValidLanguage,
  supportedLanguages,
} from "@/interfaces/i18n";
import { LANGUAGES } from "@/services/languages";
import LanguageCard from "@/components/LanguageCard";

const Language = () => {
  const { t } = useTranslation();

  const currentLanguage = getValidLanguage(i18n.language);

  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const [customAlert, setCustomAlert] = useState<{
      visible: boolean;
      title: string;
      message: string;
    }>({
      visible: false,
      title: "",
      message: "",
    });

  const currentLanguageData = LANGUAGES.find(
    (item) => item.code === currentLanguage
  );

  const hasLanguageChanged = selectedLanguage !== currentLanguage;

  const filteredLanguages = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return LANGUAGES.filter((item) => {
      const isSupported = supportedLanguages.includes(item.code);
      const isNotCurrent = item.code !== currentLanguage;

      const translatedName = t(item.name).toLowerCase();
      const nativeName = item.nativeName.toLowerCase();

      const matchesSearch =
        translatedName.includes(searchValue) ||
        nativeName.includes(searchValue);

      return isSupported && isNotCurrent && matchesSearch;
    });
  }, [search, currentLanguage, t]);

  const handleApplyLanguage = async () => {
    if (!hasLanguageChanged) {
      router.back();
      return;
    }

    try {
      await changeAppLanguage(selectedLanguage);

      setCustomAlert({
        visible: true,
        title: t("done"),
        message: t("languageUpdated"),
      });
    } catch (error) {
      console.log("Language change error:", error);
      setCustomAlert({
        visible: true,
        title: "Error",
        message: t("couldNotUpdateLanguage"),
      });
    }
  };

  return (
    <View className="bg-primary flex-1 px-5">
      <View className="flex-row gap-8 items-center mt-16 mb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          className="rounded-[12px] border border-[#2A2845] bg-dark-300 items-center justify-center px-2 py-2"
        >
          <Feather name="chevron-left" size={24} color="#8B88A8" />
        </TouchableOpacity>

        <Text className="text-white font-bold text-[24px] text-center">
          {t("language")}
        </Text>
      </View>

      <View className="h-[70px] rounded-[22px] border border-[#2A2845] bg-dark-300 flex-row items-center px-5 mb-8">
        <Feather name="search" size={26} color="#5D5A7A" />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t("searchLanguage")}
          placeholderTextColor="#5D5A7A"
          className="flex-1 text-white text-[20px] ml-3 font-semibold"
        />
      </View>

      <FlatList
        data={filteredLanguages}
        keyExtractor={(item) => item.code}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {currentLanguageData && (
              <View className="mb-6">
                <Text className="text-[#5D5A7A] font-bold tracking-[3px] text-[14px] mb-4">
                  {t("current").toUpperCase()}
                </Text>

                <LanguageCard
                  item={currentLanguageData}
                  selected={selectedLanguage === currentLanguageData.code}
                  onPress={() => setSelectedLanguage(currentLanguageData.code)}
                />
              </View>
            )}

            <Text className="text-[#5D5A7A] font-bold tracking-[3px] text-[14px] mb-4">
              {t("allLanguages").toUpperCase()}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <LanguageCard
            item={item}
            selected={selectedLanguage === item.code}
            onPress={() => setSelectedLanguage(item.code)}
          />
        )}
        ListEmptyComponent={
          <Text className="text-[#8B88A8] text-[16px] text-center mt-8">
            {t("noLanguageFound")}
          </Text>
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      />

      <View className="absolute bottom-8 left-5 right-5">
        <TouchableOpacity activeOpacity={0.85} onPress={handleApplyLanguage}>
          <LinearGradient
            colors={
              hasLanguageChanged
                ? ["#D83EBE", "#9B4DFF"]
                : ["#3A3758", "#3A3758"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 78,
              borderRadius: 28,
              alignItems: "center",
              justifyContent: "center",
              opacity: hasLanguageChanged ? 1 : 0.8,
            }}
          >
            <Text className="text-white text-[24px] font-bold">
              {hasLanguageChanged ? t("applyLanguage") : t("done")}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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

export default Language;
