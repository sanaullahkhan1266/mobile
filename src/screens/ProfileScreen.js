import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  CustomHeader,
  GradientButton,
  Card,
  SettingItem,
} from '../components/ui';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const userInfo = {
    email: 'ham****@gmail.com',
    uid: '1564170416',
    securityLevel: 'Low',
    version: '2.9.3'
  };

  const handleSettingPress = (setting) => {
    switch (setting) {
      case 'Security':
        navigation.navigate('Security');
        break;
      case 'Low Balance Alert':
        navigation.navigate('LowBalanceAlert');
        break;
      case 'Account Priority':
        navigation.navigate('AccountPriority');
        break;
      case 'Settings':
        navigation.navigate('Settings');
        break;
      default:
        Alert.alert('Navigation', `Navigate to ${setting} screen`);
        break;
    }
  };

  const handleReferralPress = () => {
    navigation.navigate('InviteFriends');
  };

  const handleMyRewardsPress = () => {
    navigation.navigate('MyRewards');
  };

  const renderUserProfile = () => (
    <Card gradient={colors.gradients.primary} style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
            style={styles.avatar}
          >
            <Icon name="person" size={32} color={colors.text.white} />
          </LinearGradient>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userEmail}>{userInfo.email}</Text>
          <Text style={styles.userUID}>UID: {userInfo.uid}</Text>
        </View>
        <Icon name="chevron-right" size={24} color="rgba(255,255,255,0.8)" />
      </View>
    </Card>
  );

  const renderReferralSection = () => (
    <Card style={styles.referralCard} shadow="medium">
      <View style={styles.referralContent}>
        <View style={styles.referralLeft}>
          <Text style={styles.referralTitle}>Referral</Text>
          <Text style={styles.referralSubtitle}>
            Refer & Earn Up to 40% Commission
          </Text>
        </View>
        
        <View style={styles.referralRight}>
          <View style={styles.referralIconContainer}>
            <LinearGradient
              colors={colors.gradients.green}
              style={styles.referralIcon}
            >
              <Icon name="card-giftcard" size={28} color={colors.text.white} />
            </LinearGradient>
          </View>
          <GradientButton
            title="Go referral"
            onPress={handleReferralPress}
            gradient={colors.gradients.dark}
            style={styles.referralButton}
            textStyle={styles.referralButtonText}
          />
        </View>
      </View>
    </Card>
  );

  const renderSecuritySettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Security Settings</Text>
      
      <Card style={styles.settingsCard}>
        <SettingItem
          icon="security"
          title="Security"
          value={userInfo.securityLevel}
          valueColor={colors.error}
          onPress={() => handleSettingPress('Security')}
        />
      </Card>
    </View>
  );

  const renderPaymentSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Payment Settings</Text>
      
      <Card style={styles.settingsCard}>
        <SettingItem
          icon="payment"
          title="Payment Priority"
          onPress={() => handleSettingPress('Payment Priority')}
        />
        <View style={styles.separator} />
        <SettingItem
          icon="layers"
          title="Account Priority"
          onPress={() => handleSettingPress('Account Priority')}
        />
        <View style={styles.separator} />
        <SettingItem
          icon="battery-alert"
          title="Low Balance Alert"
          onPress={() => handleSettingPress('Low Balance Alert')}
        />
      </Card>
    </View>
  );

  const renderGeneralSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>General</Text>
      
      <Card style={styles.settingsCard}>
        <SettingItem
          icon="card-giftcard"
          title="My Rewards"
          onPress={handleMyRewardsPress}
        />
        <View style={styles.separator} />
        <SettingItem
          icon="settings"
          title="Settings"
          onPress={() => handleSettingPress('Settings')}
        />
        <View style={styles.separator} />
        <SettingItem
          icon="help-outline"
          title="Support Center"
          onPress={() => handleSettingPress('Support Center')}
        />
        <View style={styles.separator} />
        <SettingItem
          icon="tag"
          title="Community"
          onPress={() => handleSettingPress('Community')}
        />
        <View style={styles.separator} />
        <SettingItem
          icon="share"
          title="Share"
          onPress={() => handleSettingPress('Share')}
        />
        <View style={styles.separator} />
        <SettingItem
          icon="info-outline"
          title="About Us"
          value={`v ${userInfo.version}`}
          onPress={() => handleSettingPress('About Us')}
        />
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradients.primary}
        style={styles.header}
      >
        <CustomHeader
          title=""
          onBackPress={() => navigation.goBack()}
        />
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {renderUserProfile()}
        {renderReferralSection()}
        {renderSecuritySettings()}
        {renderPaymentSettings()}
        {renderGeneralSettings()}
        
        {/* Logout Button */}
        <GradientButton
          title="Sign Out"
          onPress={() => Alert.alert('Sign Out', 'Are you sure you want to sign out?')}
          gradient={colors.gradients.red}
          style={styles.logoutButton}
          icon="exit-to-app"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingBottom: spacing.md,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },

  // Profile Card
  profileCard: {
    marginTop: -spacing.xl,
    marginBottom: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  profileInfo: {
    flex: 1,
  },
  userEmail: {
    ...typography.h4,
    color: colors.text.white,
    marginBottom: spacing.xs,
  },
  userUID: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },

  // Referral Section
  referralCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  referralContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  referralLeft: {
    flex: 1,
  },
  referralTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  referralSubtitle: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  referralRight: {
    alignItems: 'center',
  },
  referralIconContainer: {
    marginBottom: spacing.sm,
  },
  referralIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  referralButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  referralButtonText: {
    ...typography.caption,
    fontWeight: '600',
  },

  // Settings Sections
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsCard: {
    paddingVertical: spacing.sm,
    paddingHorizontal: 0,
  },
  separator: {
    height: 1,
    backgroundColor: colors.surface,
    marginLeft: 70, // Icon width + margin
    marginVertical: spacing.xs,
  },

  // Logout Button
  logoutButton: {
    marginVertical: spacing.xl,
    marginHorizontal: spacing.md,
  },
});

export default ProfileScreen;