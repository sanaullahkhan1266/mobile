import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { CustomHeader } from '../components/ui';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

const HelpScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const helpCollections = [
    {
      id: 1,
      title: 'Opening Your Account',
      description: 'RedotPay App Download, Account Registration, Identity Verification',
      articles: 37,
      screen: 'HelpCollection',
      params: { collectionId: 'opening-account' }
    },
    {
      id: 2,
      title: 'Managing your Card',
      description: 'Usage Rules, Fee Schedule for RedotPay Virtual & Physical Card',
      articles: 46,
      screen: 'HelpCollection',
      params: { collectionId: 'managing-card' }
    },
    {
      id: 3,
      title: 'Managing Your Transaction',
      description: 'Card Transactions, ATM Withdrawals, Payment Settings, Refunds, PayPal Transfers, Card Fraud, Bill statement',
      articles: 44,
      screen: 'HelpCollection',
      params: { collectionId: 'managing-transaction' }
    },
    {
      id: 4,
      title: 'Deposit and Withdrawal',
      description: 'Deposit and Withdrawal Process, Frequently Asked Questions for Deposit and Withdrawal',
      articles: 16,
      screen: 'HelpCollection',
      params: { collectionId: 'deposit-withdrawal' }
    },
    {
      id: 5,
      title: 'Send To RedotPay Account',
      description: 'RedotPay internal transfer',
      articles: 2,
      screen: 'HelpCollection',
      params: { collectionId: 'send-redotpay' }
    },
    {
      id: 6,
      title: 'Currency Account FAQ',
      description: 'Currency Account related questions and answers',
      articles: 26,
      screen: 'HelpCollection',
      params: { collectionId: 'currency-account' }
    },
    {
      id: 7,
      title: 'Gift',
      description: 'Send and Receive Cryptocurrency as Gift',
      articles: 1,
      screen: 'HelpCollection',
      params: { collectionId: 'gift' }
    },
    {
      id: 8,
      title: 'Safety Guide',
      description: 'RedotPay Account and Card Security Settings, Anti-Fraud Guide',
      articles: 9,
      screen: 'HelpCollection',
      params: { collectionId: 'safety-guide' }
    },
    {
      id: 9,
      title: 'Credit Account',
      description: 'Credit account related',
      articles: 5,
      screen: 'HelpCollection',
      params: { collectionId: 'credit-account' }
    },
    {
      id: 10,
      title: 'Multi-market payout',
      description: 'Multi-market payout',
      articles: 2,
      screen: 'HelpCollection',
      params: { collectionId: 'multi-market-payout' }
    },
    {
      id: 11,
      title: 'Earn',
      description: 'Earn Feature',
      articles: 1,
      screen: 'HelpCollection',
      params: { collectionId: 'earn' }
    },
    {
      id: 12,
      title: 'P2P',
      description: 'All information on this FAQ page is provided for reference only. Use of our services is subject to our Terms and Conditions. https://www.redot...',
      articles: 28,
      screen: 'HelpCollection',
      params: { collectionId: 'p2p' }
    },
    {
      id: 13,
      title: 'General FAQ',
      description: 'General questions and troubleshooting',
      articles: 15,
      screen: 'HelpCollection',
      params: { collectionId: 'general-faq' }
    }
  ];

  const filteredCollections = helpCollections.filter(collection =>
    collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalArticles = helpCollections.reduce((total, collection) => total + collection.articles, 0);

  const renderHelpCollection = (collection) => {
    return (
      <TouchableOpacity
        key={collection.id}
        style={[
          styles.collectionItem,
          { 
            backgroundColor: isDarkMode ? theme.colors.surface : '#FFFFFF',
            borderBottomColor: isDarkMode ? theme.colors.gray[700] : theme.colors.gray[200],
          }
        ]}
        onPress={() => navigation.navigate(collection.screen, collection.params)}
        activeOpacity={0.7}
      >
        <View style={styles.collectionContent}>
          <Text style={[
            styles.collectionTitle,
            { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
          ]}>
            {collection.title}
          </Text>
          <Text style={[
            styles.collectionDescription,
            { color: isDarkMode ? theme.colors.text.secondary : colors.text.secondary }
          ]}>
            {collection.description}
          </Text>
          <Text style={[
            styles.articleCount,
            { color: isDarkMode ? theme.colors.text.secondary : colors.text.secondary }
          ]}>
            {collection.articles} articles
          </Text>
        </View>
        <View style={styles.collectionArrow}>
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
        title="Help"
        onBackPress={() => navigation.goBack()}
        rightIcon="search"
        onRightPress={() => navigation.navigate('HelpSearch')}
        backgroundColor={isDarkMode ? theme.colors.background.primary : colors.surface}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Collections Count */}
        <View style={styles.countContainer}>
          <Text style={[
            styles.countText,
            { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
          ]}>
            {filteredCollections.length} collections
          </Text>
        </View>

        {/* Collections List */}
        <View style={[
          styles.collectionsContainer,
          { backgroundColor: isDarkMode ? theme.colors.surface : '#FFFFFF' }
        ]}>
          {filteredCollections.map(collection => renderHelpCollection(collection))}
        </View>

        {/* Quick Actions */}
        <View style={[
          styles.quickActionsContainer,
          { backgroundColor: isDarkMode ? theme.colors.surface : '#FFFFFF' }
        ]}>
          <TouchableOpacity
            style={[
              styles.quickAction,
              { borderBottomColor: isDarkMode ? theme.colors.gray[700] : theme.colors.gray[200] }
            ]}
            onPress={() => navigation.navigate('Messages')}
          >
            <View style={styles.quickActionLeft}>
              <Icon 
                name="message" 
                size={24} 
                color={isDarkMode ? theme.colors.text.secondary : colors.text.secondary} 
              />
              <Text style={[
                styles.quickActionTitle,
                { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
              ]}>
                Messages
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.text.disabled} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('HelpSupport')}
          >
            <View style={styles.quickActionLeft}>
              <Icon 
                name="help" 
                size={24} 
                color={isDarkMode ? theme.colors.text.secondary : colors.text.secondary} 
              />
              <Text style={[
                styles.quickActionTitle,
                { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
              ]}>
                Contact Support
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.text.disabled} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  },
  countContainer: {
    paddingVertical: spacing.md,
  },
  countText: {
    fontSize: 18,
    fontWeight: '600',
  },
  collectionsContainer: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...colors.shadows.light,
    marginBottom: spacing.lg,
  },
  collectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
    minHeight: 80,
  },
  collectionContent: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  collectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  collectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  articleCount: {
    fontSize: 14,
    fontWeight: '400',
  },
  collectionArrow: {
    paddingLeft: spacing.sm,
  },
  quickActionsContainer: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...colors.shadows.light,
    marginBottom: spacing.xl,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
    minHeight: 56,
  },
  quickActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '400',
    marginLeft: spacing.md,
  },
});

export default HelpScreen;