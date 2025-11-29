import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';

const LowBalanceAlertScreen = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(true);

  const handleSave = () => {
    // Handle save logic here
    console.log('Low Balance Alert setting saved:', isEnabled);
    navigation.goBack();
  };

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
        <Text style={styles.headerTitle}>Low Balance Alert</Text>
      </View>

      <View style={styles.content}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <View style={styles.infoIconContainer}>
            <Icon name="info" size={20} color={theme.colors.text.secondary} />
          </View>
          <Text style={styles.infoText}>
            We'll email you if your balance drops below the set threshold.
          </Text>
        </View>

        {/* Settings Card */}
        <View style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconContainer}>
                <Icon name="battery-alert" size={24} color={theme.colors.text.primary} />
              </View>
              <Text style={styles.settingTitle}>Low Balance Alert</Text>
            </View>
            <Switch
              value={isEnabled}
              onValueChange={setIsEnabled}
              trackColor={{ 
                false: theme.colors.gray[300], 
                true: theme.colors.primary + '40' 
              }}
              thumbColor={isEnabled ? theme.colors.primary : theme.colors.gray[400]}
              ios_backgroundColor={theme.colors.gray[300]}
            />
          </View>
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
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
    paddingTop: 24,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: theme.colors.gray[100],
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.secondary,
  },
  settingsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
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
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 34,
    paddingTop: 16,
  },
  saveButton: {
    backgroundColor: theme.colors.gray[300],
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
});

export default LowBalanceAlertScreen;