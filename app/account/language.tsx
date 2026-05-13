import { View, Text, TouchableOpacity, Alert, TextInput, FlatList } from "react-native";
import React, { useMemo, useState } from "react";
import { router } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { useTranslation } from "react-i18next";

import i18n, { changeAppLanguage } from "@/interfaces/i18n";
import { LANGUAGES } from "@/services/languages";
import { LinearGradient } from "expo-linear-gradient";
import LanguageCard from "@/components/LanguageCard";

const Language = () => {
  const { t } = useTranslation();

  const currentLanguage = i18n.language || "en";

  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const selectedLanguageData = LANGUAGES.find(
    (item) => item.code === selectedLanguage
  );

  const otherLanguages = useMemo(() => {
    return LANGUAGES.filter((item) => {
      const isNotSelected = item.code !== selectedLanguage;

      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.nativeName.toLowerCase().includes(search.toLowerCase());

      return isNotSelected && matchesSearch;
    });
  }, [search, selectedLanguage]);

  const handleApplyLanguage = async () => {
    try {
      await changeAppLanguage(selectedLanguage);

      Alert.alert("Success", "Language updated successfully");
    } catch (error) {
      Alert.alert("Error", "Could not update language. Please try again.");
    }
  };

  return (
    <View className="bg-primary flex-1 px-5">
      <View className="flex-row items-center mt-16 mb-4">
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
        data={otherLanguages}
        keyExtractor={item => item.code}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Current */}
            {selectedLanguageData && (
              <View className="mb-6">
                <Text className="text-[#5D5A7A] font-bold tracking-[3px] text-[14px] mb-4">
                  {t('current').toUpperCase()}
                </Text>

                <LanguageCard
                  item={selectedLanguageData}
                  selected
                  onPress={() => setSelectedLanguage(selectedLanguageData.code)}
                />
              </View>
            )}

            <Text className="text-[#5D5A7A] font-bold tracking-[3px] text-[14px] mb-4">
              {t('allLanguages').toUpperCase()}
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
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      />

      <View className="absolute bottom-8 left-5 right-5">
        <TouchableOpacity activeOpacity={0.85} onPress={handleApplyLanguage}>
          <LinearGradient
            colors={["#D83EBE", "#9B4DFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 78,
              borderRadius: 28,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text className="text-white text-[24px] font-bold">
              {t("applyLanguage")}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Language;
