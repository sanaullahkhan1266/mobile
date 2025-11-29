import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import kycService from '@/services/KycService';
import AppHeader from '@/components/AppHeader';

export default function KycDocumentType() {
  const router = useRouter();
  const [selected, setSelected] = useState<'passport'|'id'|'driver_license'|null>(null);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    (async () => {
      const s = await kycService.getState();
      if (s.document?.type) setSelected(s.document.type as any);
    })();
    
    // Fade in animation
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const saveAndNext = async () => {
    if (!selected) return;
    await kycService.save({ document: { ...(await kycService.getState()).document, type: selected } });
    router.push('/kyc/document-capture' as any);
  };

  const documents = [
    { 
      key: 'id', 
      title: 'ID Card', 
      icon: 'card-outline', 
      desc: 'To check your personal informations are correct',
      gradient: ['#667eea', '#764ba2']
    },
    { 
      key: 'passport', 
      title: 'Passport', 
      icon: 'airplane-outline', 
      desc: 'Open your passport to the photo page',
      gradient: ['#f093fb', '#f5576c']
    },
    { 
      key: 'driver_license', 
      title: 'Driving License', 
      icon: 'car-outline', 
      desc: 'Front and back sides required',
      gradient: ['#4facfe', '#00f2fe']
    },
  ];

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <AppHeader title="Let's verify KYC" />
      
      <Animated.View style={[s.content, { opacity: animatedValue }]}>
        <Text style={s.subtitle}>Please submit the following documents{"\n"}verify your profile.</Text>
        
        <View style={s.documentsContainer}>
          {documents.map((doc, index) => (
            <Animated.View
              key={doc.key}
              style={[
                {
                  opacity: animatedValue,
                  transform: [{
                    translateY: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0]
                    })
                  }]
                }
              ]}
            >
              <TouchableOpacity 
                style={[s.documentCard, selected === doc.key && s.documentCardSelected]} 
                onPress={() => setSelected(doc.key as any)}
                activeOpacity={0.7}
              >
                <View style={s.cardContent}>
                  <View style={[s.iconContainer, { backgroundColor: '#000000' }]}>
                    <Ionicons 
                      name={doc.icon as any} 
                      size={24} 
                      color="#FFFFFF"
                    />
                  </View>
                  
                  <View style={s.textContainer}>
                    <Text style={[s.documentTitle, selected === doc.key && s.documentTitleSelected]}>
                      {doc.title}
                    </Text>
                    <Text style={s.documentDesc}>{doc.desc}</Text>
                  </View>
                  
                  <View style={s.chevronContainer}>
                    <Ionicons 
                      name="chevron-forward" 
                      size={20} 
                      color="#000000"
                    />
                  </View>
                </View>
                
                {selected === doc.key && (
                  <View style={s.selectedIndicator}>
                    <View style={[s.selectedBadge, { backgroundColor: '#000000' }]}>
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <TouchableOpacity 
          style={[s.continueButton, !selected && s.continueButtonDisabled]} 
          disabled={!selected} 
          onPress={saveAndNext}
          activeOpacity={0.8}
        >
          <View style={[s.gradientButton, { backgroundColor: selected ? '#000000' : '#E2E8F0' }]}>
            <Text style={[s.continueText, !selected && s.continueTextDisabled]}>Continue</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC'
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  documentsContainer: {
    flex: 1,
    gap: 16,
  },
  documentCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  documentCardSelected: {
    borderColor: '#000000',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  documentTitleSelected: {
    color: '#000000',
  },
  documentDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  chevronContainer: {
    marginLeft: 8,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButton: {
    marginTop: 24,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  gradientButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  continueTextDisabled: {
    color: '#94A3B8',
  },
});
