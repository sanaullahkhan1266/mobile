import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Theme from '@/constants/Theme';

const { width, height } = Dimensions.get('window');

interface Article {
  id: string;
  title: string;
  readTime: string;
  category: string;
  backgroundColor: string;
  illustration: string;
}

const LearnScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('card');

  const categories = [
    { id: 'account', title: 'account' },
    { id: 'card', title: 'card' },
    { id: 'invitation', title: 'Invitation Reward' },
  ];

  const articles: Article[] = [
    {
      id: '1',
      title: 'Rules for physical cards and virtual cards',
      readTime: '5 min read',
      category: 'card',
      backgroundColor: '#F3F4F6',
      illustration: '💳',
    },
    {
      id: '2',
      title: 'Cardtick card limitations & fees',
      readTime: '3 min read',
      category: 'card',
      backgroundColor: '#DBEAFE',
      illustration: '💰',
    },
    {
      id: '3',
      title: 'Physical Card Related Rules',
      readTime: '3 min read',
      category: 'card',
      backgroundColor: '#FCE7F3',
      illustration: '💳',
    },
    {
      id: '4',
      title: 'Card Security Settings',
      readTime: '5 min read',
      category: 'card',
      backgroundColor: '#DBEAFE',
      illustration: '🔒',
    },
    {
      id: '5',
      title: 'How to complete account identity authentication',
      readTime: '3 min read',
      category: 'account',
      backgroundColor: '#E0E7FF',
      illustration: '✅',
    },
    {
      id: '6',
      title: 'Can the $5 given for account registration be used to buy a card?',
      readTime: '1 min read',
      category: 'account',
      backgroundColor: '#FCE7F3',
      illustration: '💳',
    },
    {
      id: '7',
      title: 'How to use Binance Pay to deposit your Cardtick account?',
      readTime: '2 min read',
      category: 'account',
      backgroundColor: '#DCFCE7',
      illustration: '📱',
    },
    {
      id: '8',
      title: 'How to use WhatsApp Messenger to receive Cardtick secondary authentication codes',
      readTime: '2 min read',
      category: 'account',
      backgroundColor: '#FED7AA',
      illustration: '💳',
    },
  ];

  const filteredArticles = articles.filter(article => article.category === selectedCategory);

  const renderCategoryButton = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.selectedCategoryButton
      ]}
      onPress={() => setSelectedCategory(category.id)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category.id && styles.selectedCategoryButtonText
      ]}>
        {category.title}
      </Text>
    </TouchableOpacity>
  );

  const getIllustrationForArticle = (article: Article) => {
    if (article.title.includes('identity authentication')) {
      return (
        <View style={styles.illustrationContainer}>
          <View style={styles.phoneFrame}>
            <View style={styles.phoneScreen}>
              <View style={styles.profileIcon} />
              <View style={styles.checkMark}>
                <Ionicons name="checkmark" size={16} color="#10B981" />
              </View>
            </View>
          </View>
        </View>
      );
    }
    
    if (article.title.includes('Binance Pay')) {
      return (
        <View style={styles.illustrationContainer}>
          <View style={styles.phoneWithLogo}>
            <View style={styles.phoneScreen}>
              <Text style={styles.logoText}>₿</Text>
            </View>
            <View style={styles.arrowIcon}>
              <Ionicons name="arrow-forward" size={14} color="#8B5CF6" />
            </View>
          </View>
        </View>
      );
    }

    // Default card illustration
    return (
      <View style={styles.illustrationContainer}>
        <View style={styles.cardStack}>
          <View style={[styles.card, styles.cardBack]} />
          <View style={[styles.card, styles.cardFront]}>
            <View style={styles.cardChip} />
          </View>
        </View>
        <View style={styles.sparkles}>
          <View style={[styles.sparkle, { top: 5, left: 5 }]} />
          <View style={[styles.sparkle, { top: 15, right: 10 }]} />
          <View style={[styles.sparkle, { bottom: 5, left: 15 }]} />
          <View style={[styles.sparkle, { bottom: 15, right: 5 }]} />
          <View style={[styles.coin, { top: 10, right: 5 }]} />
        </View>
      </View>
    );
  };

  const renderArticleCard = (article: Article) => (
    <TouchableOpacity
      key={article.id}
      style={[styles.articleCard, { backgroundColor: article.backgroundColor }]}
      activeOpacity={0.7}
    >
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle}>{article.title}</Text>
        <Text style={styles.readTime}>{article.readTime}</Text>
      </View>
      {getIllustrationForArticle(article)}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.bg} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title and Description */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Learn</Text>
          <Text style={styles.description}>
            Explore tutorials and resources to learn more about how to use Cardtick card.
          </Text>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map(renderCategoryButton)}
        </ScrollView>

        {/* Articles */}
        <View style={styles.articlesContainer}>
          {filteredArticles.map(renderArticleCard)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Theme.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Theme.muted,
    lineHeight: 24,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
  },
  selectedCategoryButton: {
    backgroundColor: '#D1FAE5',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Theme.muted,
  },
  selectedCategoryButtonText: {
    color: '#059669',
  },
  articlesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    marginBottom: 4,
  },
  articleContent: {
    flex: 1,
    paddingRight: 16,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  readTime: {
    fontSize: 14,
    color: Theme.muted,
  },
  illustrationContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardStack: {
    position: 'relative',
  },
  card: {
    width: 44,
    height: 28,
    borderRadius: 6,
    position: 'absolute',
  },
  cardBack: {
    backgroundColor: '#374151',
    top: 2,
    left: 2,
  },
  cardFront: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: Theme.border,
    top: 0,
    left: 0,
  },
  cardChip: {
    width: 8,
    height: 6,
    backgroundColor: '#FCD34D',
    borderRadius: 2,
    position: 'absolute',
    top: 4,
    left: 4,
  },
  sparkles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sparkle: {
    width: 4,
    height: 4,
    backgroundColor: '#FCD34D',
    borderRadius: 2,
    position: 'absolute',
  },
  coin: {
    width: 12,
    height: 12,
    backgroundColor: '#FCD34D',
    borderRadius: 6,
    position: 'absolute',
  },
  phoneFrame: {
    width: 32,
    height: 48,
    backgroundColor: '#1F2937',
    borderRadius: 6,
    padding: 2,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  profileIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  checkMark: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  phoneWithLogo: {
    width: 32,
    height: 48,
    backgroundColor: '#1F2937',
    borderRadius: 6,
    padding: 2,
    position: 'relative',
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  arrowIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default LearnScreen;