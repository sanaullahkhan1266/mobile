import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../contexts/ThemeContext';

const AppearanceScreen = ({ navigation }) => {
  const { theme, themeType, setThemeType } = useTheme();

  const themeOptions = [
    {
      key: 'system',
      title: 'System',
      description: "We'll adjust your appearance based on your device's system settings.",
      icon: 'smartphone',
    },
    {
      key: 'light',
      title: 'Light',
      description: null,
      icon: 'light-mode',
    },
    {
      key: 'dark',
      title: 'Dark',
      description: null,
      icon: 'dark-mode',
    },
  ];

  const handleThemeSelect = (themeKey) => {
    setThemeType(themeKey);
    console.log('Selected theme:', themeKey);
  };

  const renderThemeOption = (option) => (
    <TouchableOpacity
      key={option.key}
      style={styles.themeOption}
      onPress={() => handleThemeSelect(option.key)}
      activeOpacity={0.7}
    >
      <View style={styles.themeOptionContent}>
        <View style={styles.themeOptionLeft}>
          <Text style={styles.themeTitle}>{option.title}</Text>
          {option.description && (
            <Text style={styles.themeDescription}>{option.description}</Text>
          )}
        </View>
        
        {themeType === option.key && (
          <View style={styles.checkmarkContainer}>
            <Icon name="check-circle" size={24} color={theme.colors.success} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appearance</Text>
      </View>

      <View style={styles.content}>
        {/* Theme Options */}
        <View style={styles.themeOptionsContainer}>
          {themeOptions.map(renderThemeOption)}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  themeOptionsContainer: {
    gap: 24,
  },
  themeOption: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
  },
  themeOptionLeft: {
    flex: 1,
    marginRight: 16,
  },
  themeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  themeDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  checkmarkContainer: {
    marginTop: 2,
  },
});

export default AppearanceScreen;