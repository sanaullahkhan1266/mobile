import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { CustomHeader } from '../components/ui';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

const LanguageSelectionScreen = ({ navigation }) => {
  const { currentLanguage, supportedLanguages, changeLanguage } = useLanguage();
  const { theme, isDarkMode } = useTheme();

  const handleLanguageSelect = async (languageCode) => {
    try {
      await changeLanguage(languageCode);
      // Show success feedback
      Alert.alert(
        'Language Changed',
        'Your language preference has been updated.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error changing language:', error);
      Alert.alert(
        'Error',
        'Failed to change language. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderLanguageItem = (language) => {
    const isSelected = currentLanguage === language.code;
    
    return (
      <TouchableOpacity
        key={language.code}
        style={[
          styles.languageItem,
          { 
            backgroundColor: isDarkMode ? theme.colors.surface : '#FFFFFF',
            borderBottomColor: isDarkMode ? theme.colors.gray[700] : theme.colors.gray[200],
          }
        ]}
        onPress={() => handleLanguageSelect(language.code)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.languageText,
          { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
        ]}>
          {language.nativeName}
        </Text>
        {isSelected && (
          <View style={styles.checkmarkContainer}>
            <Icon name="check" size={24} color={colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDarkMode ? theme.colors.background.primary : colors.surface }
    ]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? theme.colors.background.primary : colors.surface}
      />
      
      <CustomHeader
        title="Language"
        onBackPress={() => navigation.goBack()}
        backgroundColor={isDarkMode ? theme.colors.background.primary : colors.surface}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Information Banner */}
        <View style={[
          styles.infoBanner,
          { 
            backgroundColor: isDarkMode ? theme.colors.gray[800] : '#F5F5F5',
            borderColor: isDarkMode ? theme.colors.gray[700] : colors.text.disabled,
          }
        ]}>
          <View style={styles.infoIconContainer}>
            <Icon name="info" size={20} color={colors.text.secondary} />
          </View>
          <Text style={[
            styles.infoText,
            { color: isDarkMode ? theme.colors.text.secondary : colors.text.secondary }
          ]}>
            Your language selection applies to RedotPay emails, SMS, in-app notifications and all devices you're logged into.
          </Text>
        </View>

        {/* Language List */}
        <View style={[
          styles.languageContainer,
          { backgroundColor: isDarkMode ? theme.colors.surface : '#FFFFFF' }
        ]}>
          {supportedLanguages.map((language) => renderLanguageItem(language))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  infoBanner: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  infoIconContainer: {
    marginRight: spacing.sm,
    paddingTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  languageContainer: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...colors.shadows.light,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
    minHeight: 56,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LanguageSelectionScreen;