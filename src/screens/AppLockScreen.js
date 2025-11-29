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

const AppLockScreen = ({ navigation }) => {
  const [patternPasswordEnabled, setPatternPasswordEnabled] = useState(false);

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
        <Text style={styles.headerTitle}>App Lock</Text>
      </View>

      <View style={styles.content}>
        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            App Lock supports biometric unlocking and gesture password. We will use the unlocking method you enable to verify your permissions.
          </Text>
        </View>

        {/* Create Pattern Password Setting */}
        <View style={styles.settingsSection}>
          <View style={styles.settingItem}>
            <Text style={styles.settingTitle}>Create Pattern Password</Text>
            <Switch
              value={patternPasswordEnabled}
              onValueChange={setPatternPasswordEnabled}
              trackColor={{ 
                false: theme.colors.gray[300], 
                true: theme.colors.primary + '40' 
              }}
              thumbColor={patternPasswordEnabled ? theme.colors.primary : theme.colors.gray[400]}
              ios_backgroundColor={theme.colors.gray[300]}
            />
          </View>
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
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  descriptionSection: {
    marginBottom: 48,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.secondary,
  },
  settingsSection: {
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
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
});

export default AppLockScreen;