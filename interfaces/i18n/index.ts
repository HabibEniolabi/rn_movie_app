import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import es from "@/locales/es.json";
import de from "@/locales/de.json";
import pt from "@/locales/pt.json";
import ja from "@/locales/ja.json";
import ko from "@/locales/ko.json";
import ar from "@/locales/ar.json";

export const LANGUAGE_STORAGE_KEY = "app_language";

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  es: { translation: es },
  de: { translation: de },
  pt: { translation: pt },
  ja: { translation: ja },
  ko: { translation: ko },
  ar: { translation: ar },
};

export type SupportedLanguage = keyof typeof resources;

export const supportedLanguages = Object.keys(resources);

const getLanguageCode = (languageCode?: string | null) => {
  return languageCode?.split("-")[0] || "en";
};

export const getValidLanguage = (languageCode?: string | null) => {
  const normalizedLanguage = getLanguageCode(languageCode);

  if (supportedLanguages.includes(normalizedLanguage)) {
    return normalizedLanguage;
  }

  return "en";
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  returnNull: false,
  interpolation: {
    escapeValue: false,
  },
});

export const loadSavedLanguage = async () => {
  const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (savedLanguage) {
    const validSavedLanguage = getValidLanguage(savedLanguage);

    await i18n.changeLanguage(validSavedLanguage);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, validSavedLanguage);

    return;
  }

  const deviceLanguage = Localization.getLocales()?.[0]?.languageCode || "en";
  const validDeviceLanguage = getValidLanguage(deviceLanguage);

  await i18n.changeLanguage(validDeviceLanguage);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, validDeviceLanguage);
};

export const changeAppLanguage = async (languageCode: string) => {
  const validLanguage = getValidLanguage(languageCode);

  await i18n.changeLanguage(validLanguage);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, validLanguage);
};

export default i18n;