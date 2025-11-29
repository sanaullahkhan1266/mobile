import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { CustomHeader } from '../components/ui';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

const HelpSearchScreen = ({ navigation, route }) => {
  const { theme, isDarkMode } = useTheme();
  const { collectionId } = route.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [popularSearches] = useState([
    'Account verification',
    'Card fees',
    'Deposit money',
    'Password reset',
    'Two-factor authentication',
    'Transaction limits',
  ]);

  // Mock search data
  const allArticles = [
    { id: 1, title: 'How to Download RedotPay App', collection: 'Opening Your Account', readTime: '2 min' },
    { id: 2, title: 'Account Registration Process', collection: 'Opening Your Account', readTime: '5 min' },
    { id: 3, title: 'Identity Verification Requirements', collection: 'Opening Your Account', readTime: '8 min' },
    { id: 4, title: 'Virtual Card Creation and Setup', collection: 'Managing your Card', readTime: '4 min' },
    { id: 5, title: 'Physical Card Request Process', collection: 'Managing your Card', readTime: '6 min' },
    { id: 6, title: 'Card Activation Instructions', collection: 'Managing your Card', readTime: '3 min' },
    { id: 7, title: 'Fee Schedule for Virtual Cards', collection: 'Managing your Card', readTime: '5 min' },
    { id: 8, title: 'Account Security Best Practices', collection: 'Safety Guide', readTime: '8 min' },
    { id: 9, title: 'Two-Factor Authentication Setup', collection: 'Safety Guide', readTime: '4 min' },
    { id: 10, title: 'Recognizing Phishing Attempts', collection: 'Safety Guide', readTime: '6 min' },
    { id: 11, title: 'How to Send Cryptocurrency as Gift', collection: 'Gift', readTime: '6 min' },
    { id: 12, title: 'Deposit and Withdrawal Process', collection: 'Deposit and Withdrawal', readTime: '10 min' },
    { id: 13, title: 'Transaction Limits and Rules', collection: 'Managing Your Transaction', readTime: '7 min' },
    { id: 14, title: 'Currency Account Setup', collection: 'Currency Account FAQ', readTime: '5 min' },
    { id: 15, title: 'Password Reset Instructions', collection: 'General FAQ', readTime: '3 min' },
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [searchQuery]);

  const performSearch = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const results = allArticles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.collection.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePopularSearch = (searchTerm) => {
    setSearchQuery(searchTerm);
  };

  const renderSearchResult = (article) => {
    return (
      <TouchableOpacity
        key={article.id}
        style={[
          styles.resultItem,
          { 
            backgroundColor: isDarkMode ? theme.colors.surface : '#FFFFFF',
            borderBottomColor: isDarkMode ? theme.colors.gray[700] : theme.colors.gray[200],
          }
        ]}
        onPress={() => navigation.navigate('HelpArticle', { 
          articleId: article.id,
          title: article.title
        })}
        activeOpacity={0.7}
      >
        <View style={styles.resultContent}>
          <Text style={[
            styles.resultTitle,
            { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
          ]}>
            {article.title}
          </Text>
          <View style={styles.resultMeta}>
            <Text style={[
              styles.resultCollection,
              { color: isDarkMode ? theme.colors.text.secondary : colors.text.secondary }
            ]}>
              {article.collection}
            </Text>
            <View style={styles.dot} />
            <View style={styles.readTimeContainer}>
              <Icon 
                name="schedule" 
                size={14} 
                color={isDarkMode ? theme.colors.text.secondary : colors.text.secondary} 
              />
              <Text style={[
                styles.readTime,
                { color: isDarkMode ? theme.colors.text.secondary : colors.text.secondary }
              ]}>
                {article.readTime}
              </Text>
            </View>
          </View>
        </View>
        <Icon name="chevron-right" size={20} color={colors.text.disabled} />
      </TouchableOpacity>
    );
  };

  const renderPopularSearch = (searchTerm, index) => {
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.popularSearchItem,
          { 
            backgroundColor: isDarkMode ? theme.colors.gray[800] : '#F5F5F5',
          }
        ]}
        onPress={() => handlePopularSearch(searchTerm)}
        activeOpacity={0.7}
      >
        <Icon 
          name="trending-up" 
          size={16} 
          color={isDarkMode ? theme.colors.text.secondary : colors.text.secondary} 
        />
        <Text style={[
          styles.popularSearchText,
          { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
        ]}>
          {searchTerm}
        </Text>
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
        title="Search Help"
        onBackPress={() => navigation.goBack()}
        backgroundColor={isDarkMode ? theme.colors.background.primary : colors.surface}
      />

      <View style={styles.content}>
        {/* Search Input */}
        <View style={[
          styles.searchContainer,
          { 
            backgroundColor: isDarkMode ? theme.colors.surface : '#FFFFFF',
            borderColor: isDarkMode ? theme.colors.gray[700] : colors.text.disabled,
          }
        ]}>
          <Icon 
            name="search" 
            size={20} 
            color={isDarkMode ? theme.colors.text.secondary : colors.text.secondary} 
          />
          <TextInput
            style={[
              styles.searchInput,
              { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
            ]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for help articles..."
            placeholderTextColor={isDarkMode ? theme.colors.text.secondary : colors.text.secondary}
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Icon 
                name="clear" 
                size={20} 
                color={isDarkMode ? theme.colors.text.secondary : colors.text.secondary} 
              />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
          {!hasSearched && (
            <>
              {/* Popular Searches */}
              <View style={styles.popularContainer}>
                <Text style={[
                  styles.sectionTitle,
                  { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
                ]}>
                  Popular searches
                </Text>
                <View style={styles.popularSearches}>
                  {popularSearches.map((searchTerm, index) => renderPopularSearch(searchTerm, index))}
                </View>
              </View>
            </>
          )}

          {isSearching && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[
                styles.loadingText,
                { color: isDarkMode ? theme.colors.text.secondary : colors.text.secondary }
              ]}>
                Searching...
              </Text>
            </View>
          )}

          {hasSearched && !isSearching && (
            <>
              {searchResults.length > 0 ? (
                <>
                  <Text style={[
                    styles.resultsCount,
                    { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
                  ]}>
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </Text>
                  <View style={[
                    styles.resultsContainer,
                    { backgroundColor: isDarkMode ? theme.colors.surface : '#FFFFFF' }
                  ]}>
                    {searchResults.map(article => renderSearchResult(article))}
                  </View>
                </>
              ) : (
                <View style={styles.noResults}>
                  <Icon 
                    name="search-off" 
                    size={64} 
                    color={isDarkMode ? theme.colors.text.disabled : colors.text.disabled} 
                  />
                  <Text style={[
                    styles.noResultsTitle,
                    { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
                  ]}>
                    No results found
                  </Text>
                  <Text style={[
                    styles.noResultsSubtitle,
                    { color: isDarkMode ? theme.colors.text.secondary : colors.text.secondary }
                  ]}>
                    Try searching with different keywords or browse our help collections
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginVertical: spacing.md,
    ...colors.shadows.light,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  clearButton: {
    padding: spacing.xs,
  },
  resultsContainer: {
    flex: 1,
  },
  popularContainer: {
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  popularSearches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  popularSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  popularSearchText: {
    fontSize: 14,
    marginLeft: spacing.xs,
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
  resultsCount: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: spacing.md,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
    minHeight: 80,
  },
  resultContent: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: spacing.xs,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultCollection: {
    fontSize: 12,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.text.secondary,
    marginHorizontal: spacing.xs,
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTime: {
    fontSize: 12,
    marginLeft: spacing.xs / 2,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  noResultsSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
  },
});

export default HelpSearchScreen;