import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';

const SecurityScreen = ({ navigation }) => {
  const authMethods = [
    {
      icon: 'fingerprint',
      title: 'Passkey',
      hasWarning: false,
      onPress: () => console.log('Passkey pressed'),
    },
    {
      icon: 'security',
      title: 'Google Authenticator',
      hasWarning: true,
      onPress: () => console.log('Google Authenticator pressed'),
    },
    {
      icon: 'email',
      title: 'Email',
      hasWarning: false,
      onPress: () => console.log('Email pressed'),
    },
    {
      icon: 'phone',
      title: 'Phone',
      hasWarning: false,
      onPress: () => console.log('Phone pressed'),
    },
  ];

  const advancedSecurityOptions = [
    {
      icon: 'shield',
      title: 'Anti-Phishing Code',
      onPress: () => navigation.navigate('SecurityAdvanced'),
    },
    {
      icon: 'link',
      title: 'Third-Party Account Linking',
      onPress: () => navigation.navigate('SecurityAdvanced'),
    },
    {
      icon: 'devices',
      title: 'Devices',
      onPress: () => navigation.navigate('SecurityAdvanced'),
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
        <Text style={styles.headerTitle}>Security</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Security Level Card */}
        <View style={styles.securityLevelCard}>
          <LinearGradient
            colors={[theme.colors.gray[200], theme.colors.gray[100]]}
            style={styles.securityLevelGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.securityLevelContent}>
              <View style={styles.securityIcon}>
                {/* Security illustration placeholder */}
                <View style={styles.securityIllustration}>
                  <Icon name="security" size={40} color={theme.colors.primary} />
                  <Icon name="verified" size={20} color={theme.colors.success} style={styles.verifiedIcon} />
                </View>
              </View>
              <View style={styles.securityLevelText}>
                <Text style={styles.securityLevelTitle}>Security level</Text>
                <Text style={styles.securityLevelDescription}>
                  Enable multiple authentication methods to enhance your account security.
                </Text>
                <View style={styles.securityLevelBadge}>
                  <Text style={styles.securityLevelBadgeText}>Medium III</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Authentication Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentication methods</Text>
          <View style={styles.card}>
            {authMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index < authMethods.length - 1 && styles.menuItemBorder
                ]}
                onPress={method.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuItemIconContainer}>
                    <Icon name={method.icon} size={24} color={theme.colors.text.primary} />
                  </View>
                  <Text style={styles.menuItemTitle}>{method.title}</Text>
                </View>
                <View style={styles.menuItemRight}>
                  {method.hasWarning && (
                    <View style={styles.warningIcon}>
                      <Icon name="warning" size={16} color={theme.colors.error} />
                    </View>
                  )}
                  <Icon name="chevron-right" size={20} color={theme.colors.text.secondary} />
                </View>
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
  },
  securityLevelCard: {
    marginTop: 24,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  securityLevelGradient: {
    padding: 20,
  },
  securityLevelContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIcon: {
    marginRight: 20,
    position: 'relative',
  },
  securityIllustration: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  verifiedIcon: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
  },
  securityLevelText: {
    flex: 1,
  },
  securityLevelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  securityLevelDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  securityLevelBadge: {
    backgroundColor: theme.colors.text.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  securityLevelBadgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
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
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningIcon: {
    marginRight: 8,
  },
});

export default SecurityScreen;