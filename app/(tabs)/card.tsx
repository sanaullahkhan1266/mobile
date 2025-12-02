import { Card, createCard, getCards } from '@/services/cardService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ProfileButton from '../../components/ProfileButton';

const { width, height } = Dimensions.get('window');

const CardScreen = () => {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      console.log('🔵 Loading cards from backend...');
      const fetchedCards = await getCards();
      console.log('✅ Cards loaded:', fetchedCards);
      setCards(fetchedCards);
    } catch (error: any) {
      console.error('❌ Failed to load cards:', error);
      // Don't alert on first load, just show empty state
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCard = async () => {
    if (creating) return;

    setCreating(true);
    try {
      console.log('🔵 Creating virtual card...');

      const newCard = await createCard({
        currency: 'USD',
        fundingAmount: '10',
        cardType: 'virtual',
      });

      console.log('✅ Card created:', newCard);

      Alert.alert(
        'Card Created! 🎉',
        `Your virtual card has been created successfully!\n\nCard Number: ${newCard.cardNumberMasked || '****'}`,
        [
          {
            text: 'View Card',
            onPress: () => loadCards(), // Reload to show new card
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Failed to create card:', error);

      let errorMessage = 'Failed to create card. Please try again.';
      if (error.message?.toLowerCase().includes('authentication')) {
        errorMessage = 'Please login again to create a card.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setCreating(false);
    }
  };

  const C = {
    bg: '#FFFFFF',
    text: '#000000',
    muted: '#666666',
    card: '#FFFFFF',
    border: '#E5E7EB',
    red: '#DC2626',
  } as const;

  const s = getStyles(C);

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
        <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#DC2626" />
          <Text style={{ marginTop: 16, color: C.muted }}>Loading cards...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentCard = cards[selectedCardIndex];
  const hasCards = cards.length > 0;

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.content}>
          {/* Header */}
          <View style={s.header}>
            <ProfileButton size={32} />
            <Text style={s.title}>{hasCards ? 'My Cards' : 'Get a Card'}</Text>
            <TouchableOpacity onPress={() => router.push('/notifications')}>
              <Ionicons name="notifications-outline" size={24} color={C.text} />
            </TouchableOpacity>
          </View>

          {hasCards && (
            <Text style={s.cardCounter}>
              {selectedCardIndex + 1} of {cards.length}
            </Text>
          )}

          {/* Card Display */}
          <View style={s.cardContainer}>
            <View style={[
              s.cardImage,
              currentCard?.cardType === 'PHYSICAL' ? s.physicalCard : s.virtualCard
            ]}>
              {/* EnPaying brand - top right */}
              <Text style={s.cardBrand}>EnPaying</Text>

              {hasCards && (
                <>
                  {/* Card Number */}
                  <Text style={s.cardNumber}>
                    {currentCard?.cardNumberMasked || '•••• •••• •••• ••••'}
                  </Text>

                  {/* Cardholder Name */}
                  <Text style={s.cardHolder}>
                    {currentCard?.cardholderName || 'CARDHOLDER NAME'}
                  </Text>

                  {/* Expiry */}
                  <Text style={s.expiry}>
                    {currentCard?.expiryMonth}/{currentCard?.expiryYear || currentCard?.expiryDate}
                  </Text>
                </>
              )}

              {/* VISA logo - bottom left */}
              <Text style={s.visa}>{currentCard?.brand || 'VISA'}</Text>
            </View>

            {hasCards ? (
              <View style={[s.customizableBadge, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={[s.customizableText, { color: '#4CAF50' }]}>Active</Text>
              </View>
            ) : (
              <View style={s.customizableBadge}>
                <Ionicons name="color-palette" size={16} color="#4285F4" />
                <Text style={[s.customizableText, { color: '#4285F4' }]}>Customizable</Text>
              </View>
            )}
          </View>

          {/* Card Info */}
          <View style={s.cardInfoSection}>
            <Text style={s.cardTypeTitle}>
              {hasCards ? currentCard?.cardType || 'Virtual Card' : 'Virtual Card'}
            </Text>
            {hasCards ? (
              <View>
                <Text style={s.cardDescription}>
                  Balance: {currentCard?.currency} {currentCard?.balance || '0.00'}
                </Text>
                <Text style={[s.cardDescription, { marginTop: 4 }]}>
                  {currentCard?.status === 'ACTIVE' || currentCard?.status === 'active'
                    ? '✓ Card is active and ready to use'
                    : '⚠ Card is ' + currentCard?.status}
                </Text>
              </View>
            ) : (
              <Text style={s.cardDescription}>
                Pay contactless online or in-store
              </Text>
            )}
          </View>

          {/* Navigation between cards */}
          {cards.length > 1 && (
            <View style={s.navigationDots}>
              {cards.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedCardIndex(index)}
                  style={[
                    s.dot,
                    selectedCardIndex === index && s.dotActive
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Apply/Manage Button */}
      <View style={s.bottomBar}>
        <TouchableOpacity
          style={s.buttonTouchable}
          onPress={hasCards ? loadCards : handleApplyCard}
          activeOpacity={0.9}
          disabled={creating}
        >
          <View style={s.buttonGradient}>
            {creating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={s.applyButtonText}>
                {hasCards ? 'Refresh Cards' : 'Apply Card • 10 USD'}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (C: { bg: string; text: string; muted: string; card: string; border: string; red: string }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: C.bg
    },

    scrollView: {
      flex: 1,
    },

    scrollContent: {
      paddingBottom: 120,
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 20,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },

    title: {
      fontSize: 20,
      fontWeight: '600',
      color: C.text,
      textAlign: 'center',
    },

    cardCounter: {
      textAlign: 'center',
      color: C.muted,
      fontSize: 14,
      marginBottom: 20,
    },

    cardContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },

    cardImage: {
      width: 260,
      height: 400,
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 28,
      marginBottom: 16,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
      position: 'relative',
    },

    virtualCard: {
      backgroundColor: '#1F2937',
    },

    physicalCard: {
      backgroundColor: '#DC2626',
    },

    cardBrand: {
      fontSize: 20,
      fontWeight: '600',
      color: '#FFFFFF',
      position: 'absolute',
      top: 28,
      right: 24,
    },

    cardNumber: {
      fontSize: 20,
      fontWeight: '500',
      color: '#FFFFFF',
      letterSpacing: 2,
      position: 'absolute',
      top: 180,
      left: 24,
    },

    cardHolder: {
      fontSize: 14,
      fontWeight: '500',
      color: '#FFFFFF',
      position: 'absolute',
      bottom: 80,
      left: 24,
    },

    expiry: {
      fontSize: 14,
      fontWeight: '500',
      color: '#FFFFFF',
      position: 'absolute',
      bottom: 80,
      right: 24,
    },

    visa: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FFFFFF',
      position: 'absolute',
      bottom: 28,
      left: 24,
    },

    customizableBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F8F9FA',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },

    customizableText: {
      marginLeft: 6,
      fontSize: 14,
      fontWeight: '500',
    },

    cardInfoSection: {
      alignItems: 'center',
      marginBottom: 40,
    },

    cardTypeTitle: {
      fontSize: 22,
      fontWeight: '600',
      color: C.text,
      marginBottom: 8,
    },

    cardDescription: {
      fontSize: 16,
      color: C.muted,
      textAlign: 'center',
    },

    navigationDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      marginTop: 20,
    },

    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#E5E7EB',
    },

    dotActive: {
      backgroundColor: '#DC2626',
      width: 24,
    },

    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: C.bg,
      paddingHorizontal: 20,
      paddingBottom: 20,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: C.border,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 8,
    },

    buttonTouchable: {
      width: '100%',
      borderRadius: 12,
      overflow: 'hidden',
    },

    buttonGradient: {
      backgroundColor: '#DC2626',
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },

    applyButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default CardScreen;