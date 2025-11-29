import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';

const SecurityAdvancedScreen = ({ navigation }) => {
  const [accountEnabled, setAccountEnabled] = useState(true);

  const securityOptions = [
    {
      icon: 'phone',
      title: 'Phone',
      onPress: () => console.log('Phone pressed'),
    },
  ];

  const advancedSecurityOptions = [
    {
      icon: 'shield',
      title: 'Anti-Phishing Code',
      onPress: () => console.log('Anti-Phishing Code pressed'),
    },
    {
      icon: 'link',
      title: 'Third-Party Account Linking',
      onPress: () => console.log('Third-Party Account Linking pressed'),
    },
    {
      icon: 'devices',
      title: 'Devices',
      onPress: () => console.log('Devices pressed'),
    },
    {
      icon: 'lock',
      title: 'Set Password',
      onPress: () => console.log('Set Password pressed'),
    },
    {
      icon: 'lock-outline',
      title: 'App Lock',
      onPress: () => navigation.navigate('AppLock'),
    },
    {
      icon: 'credit-card',
      title: 'Card Privacy Controls',
      onPress: () => console.log('Card Privacy Controls pressed'),
    },
  ];

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
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Phone Section */}
        <View style={styles.section}>
          <View style={styles.card}>
            {securityOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={option.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuItemIconContainer}>
                    <Icon name={option.icon} size={24} color={theme.colors.text.primary} />
                  </View>
                  <Text style={styles.menuItemTitle}>{option.title}</Text>
                </View>
                <Icon name="chevron-right" size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Advanced Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced security</Text>
          <View style={styles.card}>
            {advancedSecurityOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index < advancedSecurityOptions.length - 1 && styles.menuItemBorder
                ]}
                onPress={option.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuItemIconContainer}>
                    <Icon name={option.icon} size={24} color={theme.colors.text.primary} />
                  </View>
                  <Text style={styles.menuItemTitle}>{option.title}</Text>
                </View>
                <Icon name="chevron-right" size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account management</Text>
          <View style={styles.card}>
            {/* Account Enable Toggle */}
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIconContainer}>
                  <Icon name="person" size={24} color={theme.colors.text.primary} />
                </View>
                <Text style={styles.menuItemTitle}>Account Enable</Text>
              </View>
              <Switch
                value={accountEnabled}
                onValueChange={setAccountEnabled}
                trackColor={{ 
                  false: theme.colors.gray[300], 
                  true: theme.colors.primary + '40' 
                }}
                thumbColor={accountEnabled ? theme.colors.primary : theme.colors.gray[400]}
                ios_backgroundColor={theme.colors.gray[300]}
              />
            </View>

            {/* Delete Account */}
            <View style={styles.menuItemBorder} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => console.log('Delete Account pressed')}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIconContainer}>
                  <Icon name="delete" size={24} color={theme.colors.error} />
                </View>
                <Text style={[styles.menuItemTitle, styles.deleteAccountTitle]}>
                  Delete Account
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>
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
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIconContainer: {
    marginRight: 16,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  deleteAccountTitle: {
    color: theme.colors.error,
  },
});

export default SecurityAdvancedScreen;