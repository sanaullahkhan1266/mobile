// This file shows how to update your existing screens to use the ThemeContext
// You can apply these patterns to your existing screens

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

// Example 1: Using theme in a simple component
export const ThemedComponent = () => {
  const { theme, isDarkMode, themeType } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        Current Theme: {themeType}
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        Is Dark Mode: {isDarkMode ? 'Yes' : 'No'}
      </Text>
    </View>
  );
};

// Example 2: Dynamic styles based on theme
export const DynamicStyledComponent = () => {
  const { theme } = useTheme();

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.gray[200],
      shadowColor: theme.colors.black,
    },
    text: {
      color: theme.colors.text.primary,
    },
    secondaryText: {
      color: theme.colors.text.secondary,
    },
    button: {
      backgroundColor: theme.colors.primary,
    },
  });

  return (
    <View style={[styles.card, dynamicStyles.container]}>
      <Text style={dynamicStyles.text}>Dynamic Theme Example</Text>
      <Text style={dynamicStyles.secondaryText}>This adapts to theme changes</Text>
    </View>
  );
};

// Example 3: How to update your existing SelectCurrencyScreen
/*
// Before (static theme):
import { theme } from '../styles/theme';

// After (dynamic theme):
import { useTheme } from '../contexts/ThemeContext';

const SelectCurrencyScreen = ({ navigation }) => {
  const { theme } = useTheme(); // Add this line
  
  // Rest of your component stays the same!
  // All your existing styles will now use the dynamic theme
};
*/

// Example 4: Pattern for updating StyleSheet.create
const createThemedStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    backgroundColor: theme.colors.surface,
    borderBottomColor: theme.colors.gray[100],
  },
  text: {
    color: theme.colors.text.primary,
  },
  secondaryText: {
    color: theme.colors.text.secondary,
  },
  card: {
    backgroundColor: theme.colors.surface,
    shadowColor: theme.colors.black,
  },
});

export const ComponentWithThemedStyles = () => {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Themed Text</Text>
      <Text style={styles.secondaryText}>Secondary Text</Text>
      <View style={styles.card}>
        <Text style={styles.text}>Card Content</Text>
      </View>
    </View>
  );
};

// Static styles that don't depend on theme
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
});

export default ThemedComponent;