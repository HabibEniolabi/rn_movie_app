import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

export const LANGUAGE_STORAGE_KEY = 'app_language';

const resources = {
  en: {
    translation: {
      language: 'Language',
      searchLanguage: 'Search language...',
      current: 'Current',
      allLanguages: 'All Languages',
      applyLanguage: 'Apply Language',
      english: 'English',
      french: 'French',
      spanish: 'Spanish',
      german: 'German',
      portuguese: 'Portuguese',
      japanese: 'Japanese',
      korean: 'Korean',
      arabic: 'Arabic',
    },
  },
  fr: {
    translation: {
      language: 'Langue',
      searchLanguage: 'Rechercher une langue...',
      current: 'Actuel',
      allLanguages: 'Toutes les langues',
      applyLanguage: 'Appliquer la langue',
      english: 'Anglais',
      french: 'Français',
      spanish: 'Espagnol',
      german: 'Allemand',
      portuguese: 'Portugais',
      japanese: 'Japonais',
      korean: 'Coréen',
      arabic: 'Arabe',
    },
  },
  es: {
    translation: {
      language: 'Idioma',
      searchLanguage: 'Buscar idioma...',
      current: 'Actual',
      allLanguages: 'Todos los idiomas',
      applyLanguage: 'Aplicar idioma',
      english: 'Inglés',
      french: 'Francés',
      spanish: 'Español',
      german: 'Alemán',
      portuguese: 'Portugués',
      japanese: 'Japonés',
      korean: 'Coreano',
      arabic: 'Árabe',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export const loadSavedLanguage = async () => {
  const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (savedLanguage) {
    await i18n.changeLanguage(savedLanguage);
    return;
  }

  const deviceLanguage = Localization.getLocales()?.[0]?.languageCode || 'en';

  await i18n.changeLanguage(deviceLanguage);
};

export const changeAppLanguage = async (languageCode: string) => {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
  await i18n.changeLanguage(languageCode);
};

export default i18n;