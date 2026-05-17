import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useTranslation } from "react-i18next";
import { changeAppLanguage } from "@/interfaces/i18n";

const LANGUAGE_OPTIONS = [
  {
    code: "en",
    short: "EN",
    flag: "🇺🇸",
    nameKey: "language.english",
    nativeNameKey: "language.englishNative",
  },
  {
    code: "fr",
    short: "FR",
    flag: "🇫🇷",
    nameKey: "language.french",
    nativeNameKey: "language.frenchNative",
  },
  {
    code: "es",
    short: "ES",
    flag: "🇪🇸",
    nameKey: "language.spanish",
    nativeNameKey: "language.spanishNative",
  },
  {
    code: "de",
    short: "DE",
    flag: "🇩🇪",
    nameKey: "language.german",
    nativeNameKey: "language.germanNative",
  },
  {
    code: "pt",
    short: "PT",
    flag: "🇵🇹",
    nameKey: "language.portuguese",
    nativeNameKey: "language.portugueseNative",
  },
  {
    code: "ja",
    short: "JA",
    flag: "🇯🇵",
    nameKey: "language.japanese",
    nativeNameKey: "language.japaneseNative",
  },
  {
    code: "ko",
    short: "KO",
    flag: "🇰🇷",
    nameKey: "language.korean",
    nativeNameKey: "language.koreanNative",
  },
  {
    code: "ar",
    short: "AR",
    flag: "🇸🇦",
    nameKey: "language.arabic",
    nativeNameKey: "language.arabicNative",
  },
];

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [changing, setChanging] = useState(false);

  const currentLanguageCode = i18n.language?.split("-")[0] || "en";

  const currentLanguage = useMemo(() => {
    return (
      LANGUAGE_OPTIONS.find((item) => item.code === currentLanguageCode) ||
      LANGUAGE_OPTIONS[0]
    );
  }, [currentLanguageCode]);

  const handleChangeLanguage = async (languageCode: string) => {
    try {
      setChanging(true);
      await changeAppLanguage(languageCode);
      setVisible(false);
    } catch (error) {
      console.log("Error changing language:", error);
    } finally {
      setChanging(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setVisible(true)}
        className="h-[44px] px-5 rounded-full bg-[#1B1930]/90 border border-[#343052] flex-row items-center gap-2"
      >
        <Text className="text-lg">{currentLanguage.flag}</Text>

        <Text className="text-white font-bold text-base tracking-[4px]">
          {currentLanguage.short}
        </Text>

        <Feather name="chevron-down" size={18} color="#8B88A8" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <Pressable
            className="absolute inset-0"
            onPress={() => setVisible(false)}
          />

          <View className="bg-primary rounded-t-[32px] border border-[#2A2845] px-6 pt-4 pb-8 max-h-[75%]">
            <View className="w-20 h-1.5 rounded-full bg-[#343052] self-center mb-8" />

            <Text className="text-white font-bold text-3xl mb-8">
              🌐 {t("language.chooseLanguage", { defaultValue: "Choose Language" })}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {LANGUAGE_OPTIONS.map((language) => {
                const selected = currentLanguageCode === language.code;

                return (
                  <TouchableOpacity
                    key={language.code}
                    activeOpacity={0.85}
                    disabled={changing}
                    onPress={() => handleChangeLanguage(language.code)}
                    className={`flex-row items-center justify-between rounded-[22px] px-5 py-5 mb-3 ${
                      selected
                        ? "border border-[#9B4DFF] bg-[#211A3D]"
                        : "bg-[#17162B]"
                    }`}
                  >
                    <View className="flex-row items-center gap-4 flex-1">
                      <Text className="text-3xl">{language.flag}</Text>

                      <View>
                        <Text className="text-white font-bold text-xl">
                          {t(language.nameKey)}
                        </Text>

                        <Text className="text-[#8B88A8] font-semibold text-base mt-1">
                          {t(language.nativeNameKey)}
                        </Text>
                      </View>
                    </View>

                    <View
                      className={`w-10 h-10 rounded-full items-center justify-center border ${
                        selected
                          ? "bg-[#9B4DFF] border-[#9B4DFF]"
                          : "border-[#343052]"
                      }`}
                    >
                      {selected && (
                        <Feather name="check" size={22} color="#FFFFFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setVisible(false)}
              className="h-[58px] rounded-[18px] bg-[#211F3A] items-center justify-center mt-5"
            >
              <Text className="text-[#B8B5CC] font-bold text-lg">
                {t("common.cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default LanguageSwitcher;