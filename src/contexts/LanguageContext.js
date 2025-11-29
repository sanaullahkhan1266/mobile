import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'react-native-localize';
import i18n from '../i18n/i18n';

const LanguageContext = createContext();

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English US', nativeName: 'English US' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국인' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'th', name: 'Thai', nativeName: 'ภาษาไทย' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
];

const LANGUAGE_STORAGE_KEY = '@app_language';

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  // Get device language
  const getDeviceLanguage = () => {
    const locales = getLocales();
    if (locales.length > 0) {
      const deviceLang = locales[0].languageCode;
      return SUPPORTED_LANGUAGES.find(lang => lang.code === deviceLang)?.code || 'en';
    }
    return 'en';
  };

  // Load saved language from storage
  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage)) {
        setCurrentLanguage(savedLanguage);
        i18n.changeLanguage(savedLanguage);
      } else {
        const deviceLang = getDeviceLanguage();
        setCurrentLanguage(deviceLang);
        i18n.changeLanguage(deviceLang);
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
      const deviceLang = getDeviceLanguage();
      setCurrentLanguage(deviceLang);
      i18n.changeLanguage(deviceLang);
    } finally {
      setIsLoading(false);
    }
  };

  // Save language to storage
  const saveLanguage = async (languageCode) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  // Change language
  const changeLanguage = async (languageCode) => {
    if (SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode)) {
      setCurrentLanguage(languageCode);
      await saveLanguage(languageCode);
      i18n.changeLanguage(languageCode);
    }
  };

  // Get current language object
  const getCurrentLanguageObject = () => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  };

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        changeLanguage,
        getCurrentLanguageObject,
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};