import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

export const LANGUAGE_STORAGE_KEY = "app_language";

const resources = {
  en: {
    translation: {
      language: "Language",
      searchLanguage: "Search language...",
      current: "Current",
      allLanguages: "All Languages",
      applyLanguage: "Apply Language",
      done: "Done",
      noLanguageFound: "No language found",

      english: "English",
      french: "French",
      spanish: "Spanish",
      german: "German",
      portuguese: "Portuguese",
      japanese: "Japanese",
      korean: "Korean",
      arabic: "Arabic",
    },
  },
  fr: {
    translation: {
      language: "Langue",
      searchLanguage: "Rechercher une langue...",
      current: "Actuel",
      allLanguages: "Toutes les langues",
      applyLanguage: "Appliquer la langue",
      done: "Terminé",
      noLanguageFound: "Aucune langue trouvée",

      english: "Anglais",
      french: "Français",
      spanish: "Espagnol",
      german: "Allemand",
      portuguese: "Portugais",
      japanese: "Japonais",
      korean: "Coréen",
      arabic: "Arabe",
    },
  },
  es: {
    translation: {
      language: "Idioma",
      searchLanguage: "Buscar idioma...",
      current: "Actual",
      allLanguages: "Todos los idiomas",
      applyLanguage: "Aplicar idioma",
      done: "Listo",
      noLanguageFound: "No se encontró ningún idioma",

      english: "Inglés",
      french: "Francés",
      spanish: "Español",
      german: "Alemán",
      portuguese: "Portugués",
      japanese: "Japonés",
      korean: "Coreano",
      arabic: "Árabe",
    },
  },
  de: {
    translation: {
      language: "Sprache",
      searchLanguage: "Sprache suchen...",
      current: "Aktuell",
      allLanguages: "Alle Sprachen",
      applyLanguage: "Sprache anwenden",
      done: "Fertig",
      noLanguageFound: "Keine Sprache gefunden",

      english: "Englisch",
      french: "Französisch",
      spanish: "Spanisch",
      german: "Deutsch",
      portuguese: "Portugiesisch",
      japanese: "Japanisch",
      korean: "Koreanisch",
      arabic: "Arabisch",
    },
  },
  pt: {
    translation: {
      language: "Idioma",
      searchLanguage: "Pesquisar idioma...",
      current: "Atual",
      allLanguages: "Todos os Idiomas",
      applyLanguage: "Aplicar Idioma",
      done: "Concluído",
      noLanguageFound: "Nenhum idioma encontrado",

      english: "Inglês",
      french: "Francês",
      spanish: "Espanhol",
      german: "Alemão",
      portuguese: "Português",
      japanese: "Japonês",
      korean: "Coreano",
      arabic: "Árabe",
    },
  },
  ja: {
    translation: {
      language: "言語",
      searchLanguage: "言語を検索...",
      current: "現在",
      allLanguages: "すべての言語",
      applyLanguage: "言語を適用",
      done: "完了",
      noLanguageFound: "言語が見つかりません",

      english: "英語",
      french: "フランス語",
      spanish: "スペイン語",
      german: "ドイツ語",
      portuguese: "ポルトガル語",
      japanese: "日本語",
      korean: "韓国語",
      arabic: "アラビア語",
    },
  },
  ko: {
    translation: {
      language: "언어",
      searchLanguage: "언어 검색...",
      current: "현재",
      allLanguages: "모든 언어",
      applyLanguage: "언어 적용",
      done: "완료",
      noLanguageFound: "언어를 찾을 수 없습니다",

      english: "영어",
      french: "프랑스어",
      spanish: "스페인어",
      german: "독일어",
      portuguese: "포르투갈어",
      japanese: "일본어",
      korean: "한국어",
      arabic: "아랍어",
    },
  },
  ar: {
    translation: {
      language: "اللغة",
      searchLanguage: "البحث عن اللغة...",
      current: "الحالي",
      allLanguages: "جميع اللغات",
      applyLanguage: "تطبيق اللغة",
      done: "تم",
      noLanguageFound: "لم يتم العثور على لغة",

      english: "الإنجليزية",
      french: "الفرنسية",
      spanish: "الإسبانية",
      german: "الألمانية",
      portuguese: "البرتغالية",
      japanese: "اليابانية",
      korean: "الكورية",
      arabic: "العربية",
    },
  },
};

export type SupportedLanguage = keyof typeof resources;

export const supportedLanguages = Object.keys(resources);

const getValidLanguage = (languageCode?: string | null) => {
  if (languageCode && supportedLanguages.includes(languageCode)) {
    return languageCode;
  }

  return "en";
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export const loadSavedLanguage = async () => {
  const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (savedLanguage) {
    const validSavedLanguage = getValidLanguage(savedLanguage);

    if (validSavedLanguage !== savedLanguage) {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, validSavedLanguage);
    }

    await i18n.changeLanguage(validSavedLanguage);
    return;
  }

  const deviceLanguage = Localization.getLocales()?.[0]?.languageCode || "en";
  const validDeviceLanguage = getValidLanguage(deviceLanguage);

  await i18n.changeLanguage(validDeviceLanguage);
};

export const changeAppLanguage = async (languageCode: string) => {
  const validLanguage = getValidLanguage(languageCode);

  if (validLanguage !== languageCode) {
    throw new Error(`Unsupported language: ${languageCode}`);
  }

  await i18n.changeLanguage(validLanguage);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, validLanguage);
};

export default i18n;