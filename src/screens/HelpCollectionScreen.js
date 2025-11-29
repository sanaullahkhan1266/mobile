import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { CustomHeader } from '../components/ui';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

const HelpCollectionScreen = ({ navigation, route }) => {
  const { theme, isDarkMode } = useTheme();
  const { collectionId } = route.params;
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [collectionInfo, setCollectionInfo] = useState({});

  // Mock data for different collections
  const mockCollections = {
    'opening-account': {
      title: 'Opening Your Account',
      description: 'RedotPay App Download, Account Registration, Identity Verification',
      articles: [
        { id: 1, title: 'How to Download RedotPay App', readTime: '2 min' },
        { id: 2, title: 'Account Registration Process', readTime: '5 min' },
        { id: 3, title: 'Identity Verification Requirements', readTime: '8 min' },
        { id: 4, title: 'KYC Document Submission', readTime: '3 min' },
        { id: 5, title: 'Account Verification Status', readTime: '2 min' },
        { id: 6, title: 'Troubleshooting Registration Issues', readTime: '6 min' },
        { id: 7, title: 'Age Requirements and Eligibility', readTime: '3 min' },
      ]
    },
    'managing-card': {
      title: 'Managing your Card',
      description: 'Usage Rules, Fee Schedule for RedotPay Virtual & Physical Card',
      articles: [
        { id: 1, title: 'Virtual Card Creation and Setup', readTime: '4 min' },
        { id: 2, title: 'Physical Card Request Process', readTime: '6 min' },
        { id: 3, title: 'Card Activation Instructions', readTime: '3 min' },
        { id: 4, title: 'Fee Schedule for Virtual Cards', readTime: '5 min' },
        { id: 5, title: 'Physical Card Fees and Charges', readTime: '5 min' },
        { id: 6, title: 'Card Usage Limits and Rules', readTime: '7 min' },
        { id: 7, title: 'Card Security Settings', readTime: '4 min' },
        { id: 8, title: 'How to Freeze/Unfreeze Cards', readTime: '2 min' },
      ]
    },
    'gift': {
      title: 'Gift',
      description: 'Send and Receive Cryptocurrency as Gift',
      articles: [
        { id: 1, title: 'How to Send Cryptocurrency as Gift', readTime: '6 min' },
      ]
    },
    'safety-guide': {
      title: 'Safety Guide',
      description: 'RedotPay Account and Card Security Settings, Anti-Fraud Guide',
      articles: [
        { id: 1, title: 'Account Security Best Practices', readTime: '8 min' },
        { id: 2, title: 'Two-Factor Authentication Setup', readTime: '4 min' },
        { id: 3, title: 'Recognizing Phishing Attempts', readTime: '6 min' },
        { id: 4, title: 'Secure Password Guidelines', readTime: '3 min' },
        { id: 5, title: 'Card Security Features', readTime: '5 min' },
        { id: 6, title: 'Anti-Fraud Protection', readTime: '7 min' },
        { id: 7, title: 'Reporting Suspicious Activity', readTime: '4 min' },
        { id: 8, title: 'Account Recovery Process', readTime: '6 min' },
        { id: 9, title: 'Privacy Settings and Controls', readTime: '5 min' },
      ]
    },
  };

  useEffect(() => {
    loadCollectionData();
  }, [collectionId]);

  const loadCollectionData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const collection = mockCollections[collectionId];
      if (collection) {
        setCollectionInfo({
          title: collection.title,
          description: collection.description,
          articleCount: collection.articles.length
        });
        setArticles(collection.articles);
      } else {
        // Generic collection
        setCollectionInfo({
          title: 'Help Articles',
          description: 'Browse helpful articles and guides',
          articleCount: 0
        });
        setArticles([]);
      }
    } catch (error) {
      console.error('Error loading collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderArticle = (article) => {
    return (
      <TouchableOpacity
        key={article.id}
        style={[
          styles.articleItem,
          { 
            backgroundColor: isDarkMode ? theme.colors.surface : '#FFFFFF',
            borderBottomColor: isDarkMode ? theme.colors.gray[700] : theme.colors.gray[200],
          }
        ]}
        onPress={() => navigation.navigate('HelpArticle', { 
          articleId: article.id,
          collectionId,
          title: article.title
        })}
        activeOpacity={0.7}
      >
        <View style={styles.articleContent}>
          <Text style={[
            styles.articleTitle,
            { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
          ]}>
            {article.title}
          </Text>
          {article.readTime && (
            <View style={styles.articleMeta}>
              <Icon 
                name="schedule" 
                size={16} 
                color={isDarkMode ? theme.colors.text.secondary : colors.text.secondary} 
              />
              <Text style={[
                styles.readTime,
                { color: isDarkMode ? theme.colors.text.secondary : colors.text.secondary }
              ]}>
                {article.readTime} read
              </Text>
            </View>
          )}
        </View>
        <Icon name="chevron-right" size={20} color={colors.text.disabled} />
      </TouchableOpacity>
    );
  };

  if (loading) {
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
          title="Loading..."
          onBackPress={() => navigation.goBack()}
          backgroundColor={isDarkMode ? theme.colors.background.primary : colors.surface}
        />

        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large" 
            color={colors.primary} 
          />
          <Text style={[
            styles.loadingText,
            { color: isDarkMode ? theme.colors.text.secondary : colors.text.secondary }
          ]}>
            Loading articles...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
        title={collectionInfo.title}
        onBackPress={() => navigation.goBack()}
        rightIcon="search"
        onRightPress={() => navigation.navigate('HelpSearch', { collectionId })}
        backgroundColor={isDarkMode ? theme.colors.background.primary : colors.surface}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Collection Info */}
        <View style={styles.collectionHeader}>
          <Text style={[
            styles.articleCount,
            { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
          ]}>
            {collectionInfo.articleCount} articles
          </Text>
          {collectionInfo.description && (
            <Text style={[
              styles.collectionDescription,
              { color: isDarkMode ? theme.colors.text.secondary : colors.text.secondary }
            ]}>
              {collectionInfo.description}
            </Text>
          )}
        </View>

        {/* Articles List */}
        {articles.length > 0 ? (
          <View style={[
            styles.articlesContainer,
            { backgroundColor: isDarkMode ? theme.colors.surface : '#FFFFFF' }
          ]}>
            {articles.map(article => renderArticle(article))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Icon 
              name="article" 
              size={64} 
              color={isDarkMode ? theme.colors.text.disabled : colors.text.disabled} 
            />
            <Text style={[
              styles.emptyStateTitle,
              { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
            ]}>
              No articles available
            </Text>
            <Text style={[
              styles.emptyStateSubtitle,
              { color: isDarkMode ? theme.colors.text.secondary : colors.text.secondary }
            ]}>
              Check back later for helpful articles and guides
            </Text>
          </View>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
  },
  collectionHeader: {
    paddingVertical: spacing.md,
  },
  articleCount: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  collectionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  articlesContainer: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...colors.shadows.light,
    marginBottom: spacing.xl,
  },
  articleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
    minHeight: 72,
  },
  articleContent: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: spacing.xs,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTime: {
    fontSize: 12,
    marginLeft: spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
  },
});

export default HelpCollectionScreen;