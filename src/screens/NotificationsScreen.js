import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  CustomHeader,
  TabBar,
  EmptyState,
  Card,
} from '../components/ui';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

const { width } = Dimensions.get('window');

const NotificationsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['All', 'Transaction', 'System'];

  // Mock notification data - in real app this would come from API
  const notifications = {
    all: [],
    transaction: [],
    system: []
  };

  const renderEmptyState = () => {
    const messages = {
      0: { // All
        title: 'No Notifications',
        subtitle: 'You\'ll see all your notifications here when you receive them.',
        icon: 'inbox'
      },
      1: { // Transaction
        title: 'No Transactions',
        subtitle: 'Transaction notifications will appear here when you make payments or receive money.',
        icon: 'account-balance-wallet'
      },
      2: { // System
        title: 'No System Alerts',
        subtitle: 'Important system updates and security alerts will be shown here.',
        icon: 'settings'
      }
    };

    const message = messages[activeTab];
    
    return (
      <View style={styles.emptyStateContainer}>
        <View style={styles.illustrationContainer}>
          {/* Custom illustration for empty state */}
          <View style={styles.folderIllustration}>
            <LinearGradient
              colors={['#F5F5F5', '#E0E0E0']}
              style={styles.folderBase}
            >
              <View style={styles.folderTab} />
            </LinearGradient>
            
            {/* Flying paper plane animation */}
            <View style={styles.paperPlaneContainer}>
              <LinearGradient
                colors={colors.gradients.primary}
                style={styles.paperPlane}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.paperPlaneTrail} />
            </View>
          </View>
        </View>
        
        <Text style={styles.emptyTitle}>{message.title}</Text>
        <Text style={styles.emptySubtitle}>{message.subtitle}</Text>
      </View>
    );
  };

  const renderNotificationItem = (notification, index) => {
    return (
      <Card key={index} style={styles.notificationCard}>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationIcon}>
            <Icon 
              name={notification.icon} 
              size={20} 
              color={notification.iconColor || colors.primary} 
            />
          </View>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationTime}>{notification.time}</Text>
          </View>
          {notification.unread && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
        {notification.amount && (
          <Text style={[styles.notificationAmount, { color: notification.amountColor }]}>
            {notification.amount}
          </Text>
        )}
      </Card>
    );
  };

  const renderTabContent = () => {
    const currentNotifications = Object.values(notifications)[activeTab] || [];
    
    if (currentNotifications.length === 0) {
      return renderEmptyState();
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {currentNotifications.map((notification, index) => 
          renderNotificationItem(notification, index)
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradients.primary}
        style={styles.header}
      >
        <CustomHeader
          title="Notifications"
          onBackPress={() => navigation.goBack()}
          rightIcon="filter-list"
          onRightPress={() => {/* Handle filter */}}
        />
      </LinearGradient>

      <View style={styles.content}>
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />
        
        <View style={styles.tabContent}>
          {renderTabContent()}
        </View>
      </View>
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
  tabContent: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  
  // Empty State Styles
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  illustrationContainer: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  folderIllustration: {
    position: 'relative',
    width: 120,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderBase: {
    width: 100,
    height: 80,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...colors.shadows.light,
  },
  folderTab: {
    position: 'absolute',
    top: -8,
    left: 20,
    width: 30,
    height: 16,
    backgroundColor: '#BDBDBD',
    borderTopLeftRadius: borderRadius.sm,
    borderTopRightRadius: borderRadius.sm,
  },
  paperPlaneContainer: {
    position: 'absolute',
    top: -20,
    right: -10,
    width: 40,
    height: 30,
  },
  paperPlane: {
    width: 24,
    height: 24,
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },
  paperPlaneTrail: {
    position: 'absolute',
    top: 12,
    left: -15,
    width: 20,
    height: 2,
    backgroundColor: colors.text.disabled,
    opacity: 0.5,
    borderRadius: 1,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptySubtitle: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.8,
  },

  // Notification Item Styles
  notificationCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  notificationTime: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
    marginTop: spacing.xs,
  },
  notificationMessage: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 20,
    marginLeft: 54, // Icon width + margin
  },
  notificationAmount: {
    ...typography.body1,
    fontWeight: '600',
    marginLeft: 54,
    marginTop: spacing.sm,
  },
});

export default NotificationsScreen;