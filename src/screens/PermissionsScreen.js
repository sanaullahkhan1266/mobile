import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { CustomHeader } from '../components/ui';
import { colors, typography, spacing, borderRadius } from '../styles/theme';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as Contacts from 'expo-contacts';

const PermissionsScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [permissions, setPermissions] = useState({
    notifications: 'unknown',
    camera: 'unknown',
    contacts: 'denied',
  });

  useEffect(() => {
    checkAllPermissions();
  }, []);

  const checkAllPermissions = async () => {
    try {
      // Check notification permission
      const notificationStatus = await Notifications.getPermissionsAsync();
      
      // Check camera permission
      const cameraStatus = await ImagePicker.getCameraPermissionsAsync();
      
      // Check contacts permission
      const contactsStatus = await Contacts.getPermissionsAsync();

      setPermissions({
        notifications: notificationStatus.status,
        camera: cameraStatus.status,
        contacts: contactsStatus.status,
      });
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissions(prev => ({ ...prev, notifications: status }));
      
      if (status === 'denied') {
        Alert.alert(
          'Permission Denied',
          'To enable notifications, please go to Settings > Notifications and allow notifications for this app.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setPermissions(prev => ({ ...prev, camera: status }));
      
      if (status === 'denied') {
        Alert.alert(
          'Permission Denied',
          'To enable camera access, please go to Settings and allow camera access for this app.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
    }
  };

  const requestContactsPermission = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setPermissions(prev => ({ ...prev, contacts: status }));
      
      if (status === 'denied') {
        Alert.alert(
          'Permission Denied',
          'To enable contacts access, please go to Settings and allow contacts access for this app.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
    }
  };

  const getPermissionIcon = (status) => {
    switch (status) {
      case 'granted':
        return { name: 'check-circle', color: colors.success };
      case 'denied':
        return { name: 'error', color: colors.error };
      case 'undetermined':
      default:
        return { name: 'warning', color: colors.warning };
    }
  };

  const getPermissionText = (status) => {
    switch (status) {
      case 'granted':
        return 'Allowed';
      case 'denied':
        return 'Denied';
      case 'undetermined':
        return 'Not Set';
      default:
        return 'Unknown';
    }
  };

  const renderPermissionItem = (title, permissionKey, onPress) => {
    const status = permissions[permissionKey];
    const icon = getPermissionIcon(status);
    const statusText = getPermissionText(status);
    const showWarning = status === 'denied' || status === 'undetermined';

    return (
      <TouchableOpacity
        style={[
          styles.permissionItem,
          { 
            backgroundColor: isDarkMode ? theme.colors.surface : '#FFFFFF',
            borderBottomColor: isDarkMode ? theme.colors.gray[700] : theme.colors.gray[200],
          }
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.permissionLeft}>
          <Text style={[
            styles.permissionTitle,
            { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
          ]}>
            {title}
          </Text>
        </View>
        
        <View style={styles.permissionRight}>
          {showWarning && (
            <View style={styles.warningBadge}>
              <Icon name="warning" size={16} color="#FFFFFF" />
            </View>
          )}
          <Icon name="chevron-right" size={24} color={colors.text.disabled} />
        </View>
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
        title="Permissions"
        onBackPress={() => navigation.goBack()}
        backgroundColor={isDarkMode ? theme.colors.background.primary : colors.surface}
      />

      <View style={styles.content}>
        <View style={[
          styles.permissionContainer,
          { backgroundColor: isDarkMode ? theme.colors.surface : '#FFFFFF' }
        ]}>
          {renderPermissionItem('Push Notifications', 'notifications', requestNotificationPermission)}
          {renderPermissionItem('Camera', 'camera', requestCameraPermission)}
          {renderPermissionItem('Contacts', 'contacts', requestContactsPermission)}
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={[
            styles.helpText,
            { color: isDarkMode ? theme.colors.text.secondary : colors.text.secondary }
          ]}>
            Tap on any permission to change its settings. Some permissions may require you to go to system settings.
          </Text>
        </View>
      </View>
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
  permissionContainer: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...colors.shadows.light,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
    minHeight: 64,
  },
  permissionLeft: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  permissionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  helpContainer: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  helpText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default PermissionsScreen;