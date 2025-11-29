import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';
import { useCurrency } from '../contexts/CurrencyContext';

const SettingsScreen = ({ navigation }) => {
  const { selectedCurrency } = useCurrency();
  
  const settingsOptions = [
    {
      icon: 'account-balance-wallet',
      title: 'Currency',
      value: selectedCurrency?.code || 'USD',
      flag: selectedCurrency?.flag || '🇺🇸',
      onPress: () => navigation.navigate('SelectCurrency'),
    },
    {
      icon: 'language',
      title: 'Language',
      value: 'English US',
      onPress: () => console.log('Language pressed'),
    },
    {
      icon: 'brightness-6',
      title: 'Appearance',
      value: 'Light',
      onPress: () => navigation.navigate('Appearance'),
    },
    {
      icon: 'settings',
      title: 'Permissions',
      onPress: () => console.log('Permissions pressed'),
    },
    {
      icon: 'network-check',
      title: 'Network Diagnostics',
      onPress: () => console.log('Network Diagnostics pressed'),
    },
  ];

  const handleLogOut = () => {
    console.log('Log Out pressed');
    // Handle logout logic
  };

  const renderSettingItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.settingItem,
        index < settingsOptions.length - 1 && styles.settingItemBorder
      ]}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIconContainer}>
          <Icon name={item.icon} size={24} color={theme.colors.text.primary} />
        </View>
        <Text style={styles.settingTitle}>{item.title}</Text>
      </View>
      
      <View style={styles.settingRight}>
        {item.flag && (
          <Text style={styles.flagEmoji}>{item.flag}</Text>
        )}
        {item.value && (
          <Text style={styles.settingValue}>{item.value}</Text>
        )}
        <Icon name="chevron-right" size={20} color={theme.colors.text.secondary} />
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
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Settings Options */}
        <View style={styles.settingsCard}>
          {settingsOptions.map((option, index) => renderSettingItem(option, index))}
        </View>

        {/* Log Out Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogOut}
          activeOpacity={0.8}
        >
          <View style={styles.logoutContent}>
            <Icon name="exit-to-app" size={24} color={theme.colors.text.primary} />
            <Text style={styles.logoutText}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
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
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  settingsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    marginRight: 16,
    width: 24,
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  settingValue: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginLeft: 12,
  },
});

export default SettingsScreen;