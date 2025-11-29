import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ProfileButton from '../../components/ProfileButton';

const { width, height } = Dimensions.get('window');

const CardScreen = () => {
  const router = useRouter();
  // Only virtual card available
  const selectedCard = 'virtual';
  
  const handleApplyCard = () => {
    const price = '10 USD';
    // Navigate to application page or handle application logic
    console.log(`Applying for virtual card - ${price}`);
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
  
  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={C.bg} />
      
      <ScrollView 
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.content}>
          {/* Header */}
          <View style={s.header}>
            <ProfileButton size={32} />
            <Text style={s.title}>Choose Card</Text>
            <TouchableOpacity onPress={() => router.push('/notifications')}>
              <Ionicons name="notifications-outline" size={24} color={C.text} />
            </TouchableOpacity>
          </View>
          
          
          {/* Card Display */}
          <View style={s.cardContainer}>
            <View style={[
              s.cardImage, 
              s.virtualCard
            ]}>
              {/* EnPaying brand - top right */}
              <Text style={s.cardBrand}>EnPaying</Text>
              
              
              {/* VISA logo - bottom left */}
              <Text style={s.visa}>VISA</Text>
            </View>
            
            <View style={s.customizableBadge}>
              <Ionicons name="color-palette" size={16} color="#4285F4" />
              <Text style={[s.customizableText, { color: '#4285F4' }]}>Customizable</Text>
            </View>
          </View>
          
          {/* Card Info */}
          <View style={s.cardInfoSection}>
            <Text style={s.cardTypeTitle}>
              Virtual Card
            </Text>
            <Text style={s.cardDescription}>
              Pay contactless online or in-store
            </Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Apply Button */}
      <View style={s.bottomBar}>
        <TouchableOpacity 
          style={s.buttonTouchable}
          onPress={handleApplyCard}
          activeOpacity={0.9}
        >
          <View style={s.buttonGradient}>
            <Text style={s.applyButtonText}>
              Apply Card • 10 USD
            </Text>
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
      paddingBottom: 120, // Space for bottom button
    },
    
    content: {
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 25,
    },
    
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: C.text,
      textAlign: 'center',
    },
    
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: '#F3F4F6',
      borderRadius: 12,
      padding: 4,
      marginBottom: 40,
      width: '100%',
      maxWidth: 350,
    },
    
    toggleButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 8,
    },
    
    leftToggle: {
      // No additional styles needed
    },
    
    rightToggle: {
      // No additional styles needed  
    },
    
    activeToggle: {
      backgroundColor: '#000000',
    },
    
    toggleText: {
      fontSize: 16,
      fontWeight: '600',
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
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
      position: 'relative',
    },
    
    
    virtualCard: {
      backgroundColor: '#1F2937',
      backgroundImage: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
    },
    
    physicalCard: {
      backgroundColor: '#DC2626', 
      backgroundImage: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
    },
    
    cardBrand: {
      fontSize: 20,
      fontWeight: '600',
      color: '#FFFFFF',
      position: 'absolute',
      top: 28,
      right: 24,
    },
    
    chip: {
      width: 36,
      height: 28,
      backgroundColor: '#E5E5E5',
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      left: 24,
      top: 100,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
    },
    
    chipInner: {
      width: 22,
      height: 16,
      backgroundColor: '#CCCCCC',
      borderRadius: 1,
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
      shadowOffset: {
        width: 0,
        height: 2,
      },
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
      marginBottom: 60,
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
      shadowOffset: {
        width: 0,
        height: -2,
      },
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