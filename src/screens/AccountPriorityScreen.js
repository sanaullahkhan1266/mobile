import React, { useState } from 'react';
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

const AccountPriorityScreen = ({ navigation }) => {
  const [selectedAccount, setSelectedAccount] = useState('funding');

  const handleApply = () => {
    console.log('Apply pressed with selected account:', selectedAccount);
    // Handle apply logic here
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
        <Text style={styles.headerTitle}>Account Priority</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Information Banner */}
        <View style={styles.infoBanner}>
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Ensure Sufficient Funds: </Text>
              <Text style={styles.infoDescription}>
                Make sure you have sufficient funds before making transactions to avoid payment failure.
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoBullet}>•</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Fee Waivers: </Text>
              <Text style={styles.infoDescription}>
                Fee incurred by failed payments can be waived up to three times per month.
              </Text>
            </View>
          </View>
        </View>

        {/* Account Selection - Selected */}
        <View style={styles.accountCard}>
          <View style={styles.accountContent}>
            <Text style={styles.accountTitle}>Funding Account</Text>
            <View style={styles.checkmarkContainer}>
              <Icon name="check-circle" size={24} color={theme.colors.success} />
            </View>
          </View>
        </View>

        {/* Account Selection - With Apply Button */}
        <View style={styles.accountCard}>
          <View style={styles.accountContent}>
            <Text style={styles.accountTitle}>Funding Account</Text>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
              activeOpacity={0.8}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
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
    backgroundColor: theme.colors.gray[100],
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoBullet: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginRight: 8,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  infoDescription: {
    fontSize: 14,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
  accountCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  accountContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  accountTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  checkmarkContainer: {
    padding: 4,
  },
  applyButton: {
    backgroundColor: theme.colors.gray[300],
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
});

export default AccountPriorityScreen;