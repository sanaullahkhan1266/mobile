import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const CustomizePage = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState('#E53E3E');

  const C = {
    bg: isDark ? '#0B0F14' : '#FFFFFF',
    text: isDark ? '#E5E7EB' : '#1F2937',
    muted: isDark ? '#9CA3AF' : '#6B7280',
    card: isDark ? '#0F1620' : '#FFFFFF',
    border: isDark ? 'rgba(255,255,255,0.08)' : '#E5E7EB',
  } as const;

  const cardColors = [
    { id: 1, name: 'Classic Red', color: '#E53E3E', popular: true },
    { id: 2, name: 'Deep Black', color: '#1A1A1A', popular: true },
    { id: 3, name: 'Ocean Blue', color: '#0EA5E9', popular: false },
    { id: 4, name: 'Forest Green', color: '#059669', popular: false },
    { id: 5, name: 'Royal Purple', color: '#7C3AED', popular: false },
    { id: 6, name: 'Sunset Orange', color: '#EA580C', popular: false },
    { id: 7, name: 'Rose Gold', color: '#EC4899', popular: false },
    { id: 8, name: 'Midnight Blue', color: '#1E293B', popular: false },
    { id: 9, name: 'Emerald', color: '#10B981', popular: false },
    { id: 10, name: 'Amber', color: '#F59E0B', popular: false },
    { id: 11, name: 'Indigo', color: '#6366F1', popular: false },
    { id: 12, name: 'Crimson', color: '#DC2626', popular: false },
  ];

  const s = getStyles(C);

  const CardPreview = ({ color }: { color: string }) => (
    <View style={[s.previewCard, { backgroundColor: color }]}>
      {/* EMV Chip */}
      <View style={s.previewChipContainer}>
        <View style={s.previewChip}>
          <View style={s.previewChipPattern}>
            <View style={s.previewChipLine} />
            <View style={s.previewChipLine} />
            <View style={s.previewChipLine} />
            <View style={s.previewChipLine} />
          </View>
        </View>
      </View>
      
      {/* Brand Vertical */}
      <View style={s.previewBrand}>
        <View style={s.logoPlaceholder}>
          <Text style={s.previewBrandText}>LOGO</Text>
        </View>
      </View>
      
      {/* VISA Logo */}
      <View style={s.previewVisa}>
        <Text style={s.previewVisaText}>VISA</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bg} />
      
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: C.text }]}>Customize Card</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
        {/* Card Preview */}
        <View style={s.previewSection}>
          <Text style={[s.sectionTitle, { color: C.text }]}>Preview</Text>
          <View style={s.previewContainer}>
            <CardPreview color={selectedColor} />
          </View>
        </View>

        {/* Popular Colors */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: C.text }]}>Popular Colors</Text>
          <View style={s.colorsGrid}>
            {cardColors.filter(color => color.popular).map((colorOption) => (
              <TouchableOpacity
                key={colorOption.id}
                style={[
                  s.colorOption,
                  selectedColor === colorOption.color && s.selectedColorOption
                ]}
                onPress={() => setSelectedColor(colorOption.color)}
                activeOpacity={0.8}
              >
                <View style={[s.colorCircle, { backgroundColor: colorOption.color }]}>
                  {selectedColor === colorOption.color && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <Text style={[s.colorName, { color: C.text }]}>{colorOption.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* All Colors */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: C.text }]}>All Colors</Text>
          <View style={s.colorsGrid}>
            {cardColors.map((colorOption) => (
              <TouchableOpacity
                key={colorOption.id}
                style={[
                  s.colorOption,
                  selectedColor === colorOption.color && s.selectedColorOption
                ]}
                onPress={() => setSelectedColor(colorOption.color)}
                activeOpacity={0.8}
              >
                <View style={[s.colorCircle, { backgroundColor: colorOption.color }]}>
                  {selectedColor === colorOption.color && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <Text style={[s.colorName, { color: C.text }]}>{colorOption.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Apply Button */}
      <View style={s.bottomSection}>
        <TouchableOpacity 
          style={[s.applyButton, { backgroundColor: selectedColor }]} 
          activeOpacity={0.8}
          onPress={() => {
            // Here you would save the selected color and navigate back
            router.back();
          }}
        >
          <Text style={s.applyButtonText}>Apply Color</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (C: { bg: string; text: string; muted: string; card: string; border: string }) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: width * 0.05,
      paddingTop: height * 0.02,
      paddingBottom: height * 0.015,
    },
    
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
    },
    
    content: {
      flex: 1,
      paddingHorizontal: width * 0.05,
    },
    
    previewSection: {
      alignItems: 'center',
      marginBottom: 32,
    },
    
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 16,
      alignSelf: 'flex-start',
    },
    
    previewContainer: {
      alignItems: 'center',
    },
    
    // Card Preview Styles
    previewCard: {
      width: width * 0.6,
      height: width * 0.95,
      borderRadius: 16,
      position: 'relative',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 12,
    },
    
    previewChipContainer: {
      position: 'absolute',
      top: 50,
      left: '50%',
      marginLeft: -16,
    },
    
    previewChip: {
      width: 32,
      height: 24,
      backgroundColor: '#C0C0C0',
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    previewChipPattern: {
      width: 20,
      height: 16,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignContent: 'space-between',
    },
    
    previewChipLine: {
      width: 6,
      height: 1,
      backgroundColor: '#8B6914',
    },
    
    previewBrand: {
      position: 'absolute',
      right: 10,
      top: 10,
      transform: [{ rotate: '-90deg' }],
    },

    logoPlaceholder: {
      width: 40,
      height: 24,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
    },
    
    previewBrandText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '400',
      letterSpacing: 0.8,
    },
    
    previewVisa: {
      position: 'absolute',
      bottom: 24,
      left: 16,
      transform: [{ rotate: '90deg' }],
    },
    
    previewVisaText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
      fontStyle: 'italic',
    },
    
    // Color Selection Styles
    section: {
      marginBottom: 32,
    },
    
    colorsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    
    colorOption: {
      alignItems: 'center',
      width: (width * 0.9 - 48) / 4,
      padding: 8,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    
    selectedColorOption: {
      borderColor: C.border,
      backgroundColor: C.card,
    },
    
    colorCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginBottom: 8,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    
    colorName: {
      fontSize: 10,
      fontWeight: '500',
      textAlign: 'center',
    },
    
    // Bottom Section
    bottomSection: {
      paddingHorizontal: width * 0.05,
      paddingVertical: height * 0.02,
      backgroundColor: C.bg,
      borderTopWidth: 1,
      borderTopColor: C.border,
    },
    
    applyButton: {
      width: '100%',
      paddingVertical: 16,
      borderRadius: 30,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 10,
    },
    
    applyButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
  });

export default CustomizePage;