import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

export default function AboutScreen() {
  const router = useRouter();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const appVersion = '2.9.4';
  const cacheSize = '3 MB';

  const handleRating = (rating: number) => {
    setSelectedRating(rating);
    Alert.alert(
      'Thank you!',
      `You rated EnPaying ${rating}/10. Your feedback helps us improve!`
    );
  };

  const handleMenuPress = (item: string) => {
    switch (item) {
      case 'upgrade':
        Alert.alert('App Upgrade', 'You have the latest version!');
        break;
      case 'privacy':
        Alert.alert('Privacy Policy', 'Opening Privacy Policy...');
        break;
      case 'terms':
        Alert.alert('Terms & Conditions', 'Opening Terms & Conditions...');
        break;
      case 'cache':
        Alert.alert(
          'Clear Cache',
          `Are you sure you want to clear ${cacheSize} of cached data?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Clear', 
              style: 'destructive',
              onPress: () => Alert.alert('Success', 'Cache cleared successfully!')
            }
          ]
        );
        break;
    }
  };

  const renderRatingButton = (rating: number) => (
    <TouchableOpacity
      key={rating}
      style={[
        styles.ratingButton,
        selectedRating === rating && styles.selectedRatingButton
      ]}
      onPress={() => handleRating(rating)}
    >
      <Text style={[
        styles.ratingText,
        selectedRating === rating && styles.selectedRatingText
      ]}>
        {rating}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Logo and Info */}
        <View style={styles.appInfoSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>
                <Text style={{ color: '#FF3B30' }}>En</Text>
              </Text>
            </View>
          </View>
          
          <Text style={styles.appName}>EnPaying</Text>
          <Text style={styles.appVersion}>Version {appVersion}</Text>
        </View>

        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>
            Would you recommend EnPaying to friends?
          </Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.ratingNumbers}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(renderRatingButton)}
            </View>
            
            <View style={styles.ratingLabels}>
              <Text style={styles.ratingLabel}>Not now</Text>
              <Text style={styles.ratingLabel}>Of course!</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleMenuPress('upgrade')}
          >
            <Text style={styles.menuItemText}>App upgrade</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemVersion}>v {appVersion}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleMenuPress('privacy')}
          >
            <Text style={styles.menuItemText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleMenuPress('terms')}
          >
            <Text style={styles.menuItemText}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleMenuPress('cache')}
          >
            <Text style={styles.menuItemText}>Clear cache</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemCacheSize}>{cacheSize}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 16,
    color: '#666666',
  },
  ratingSection: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingNumbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  selectedRatingButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  selectedRatingText: {
    color: '#FFFFFF',
  },
  ratingLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#666666',
  },
  menuSection: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#000000',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemVersion: {
    fontSize: 14,
    color: '#666666',
  },
  menuItemCacheSize: {
    fontSize: 14,
    color: '#666666',
  },
});