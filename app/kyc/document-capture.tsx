import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import kycService from '@/services/KycService';
import AppHeader from '@/components/AppHeader';

const { width, height } = Dimensions.get('window');

export default function KycDocumentCapture() {
  const router = useRouter();
  const [front, setFront] = useState(false);
  const [back, setBack] = useState(false);
  const [frontUri, setFrontUri] = useState<string | undefined>();
  const [backUri, setBackUri] = useState<string | undefined>();
  const [animatedValue] = useState(new Animated.Value(0));
  const [docType, setDocType] = useState('ID Card');

  useEffect(() => {
    (async () => {
      const s = await kycService.getState();
      setFront(!!s.document?.frontUploaded);
      setBack(!!s.document?.backUploaded);
      setFrontUri(s.document?.frontUri);
      setBackUri(s.document?.backUri);
      if (s.document?.type === 'id') setDocType('ID Card');
      else if (s.document?.type === 'passport') setDocType('Passport');
      else if (s.document?.type === 'driver_license') setDocType('Driving License');
    })();
    
    // Fade in animation
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const capture = async (side: 'front' | 'back') => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') return;
    const res = await ImagePicker.launchCameraAsync({ 
      quality: 0.8,
      allowsEditing: true,
      aspect: [16, 10]
    });
    if (res.canceled) return;
    const uri = res.assets?.[0]?.uri;
    if (!uri) return;
    const cur = await kycService.getState();
    if (side === 'front') {
      setFront(true); setFrontUri(uri);
      await kycService.save({ document: { ...cur.document, frontUploaded: true, frontUri: uri } });
    } else {
      setBack(true); setBackUri(uri);
      await kycService.save({ document: { ...cur.document, backUploaded: true, backUri: uri } });
    }
  };

  const canContinue = front && back;

  const DocumentFrame = ({ title, icon, onPress, isUploaded, imageUri }: any) => (
    <Animated.View style={[
      {
        opacity: animatedValue,
        transform: [{
          translateY: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          })
        }]
      }
    ]}>
      <TouchableOpacity style={[s.documentFrame, isUploaded && s.documentFrameSuccess]} onPress={onPress}>
        <View style={s.frameHeader}>
          <Ionicons name={icon} size={24} color="#000000" />
          <Text style={[s.frameTitle, isUploaded && s.frameTitleSuccess]}>{title}</Text>
        </View>
        
        <View style={s.captureArea}>
          {imageUri ? (
            <View style={s.imageContainer}>
              <Image source={{ uri: imageUri }} style={s.capturedImage} />
              <View style={s.successOverlay}>
                <View style={[s.successBadge, { backgroundColor: '#000000' }]}>
                  <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                </View>
              </View>
            </View>
          ) : (
            <View style={s.captureGuide}>
              <View style={s.frameGuide}>
                <View style={s.cornerTopLeft} />
                <View style={s.cornerTopRight} />
                <View style={s.cornerBottomLeft} />
                <View style={s.cornerBottomRight} />
                
                <View style={[s.cameraIcon, { backgroundColor: '#000000' }]}>
                  <Ionicons name="camera" size={32} color="#FFFFFF" />
                </View>
              </View>
              
              <Text style={s.captureHint}>Tap to capture {title.toLowerCase()}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <AppHeader title={`Take a picture of your ${docType}`} />

      <Animated.ScrollView style={[s.content, { opacity: animatedValue }]} showsVerticalScrollIndicator={false}>
        <Text style={s.instructions}>
          Please submit the following documents{"\n"}verify your profile.
        </Text>
        
        <View style={s.documentsContainer}>
          <DocumentFrame
            title="Take a picture of your valid ID"
            icon="card-outline"
            onPress={() => capture('front')}
            isUploaded={front}
            imageUri={frontUri}
          />
          
          <DocumentFrame
            title="Take a selfie of yourself"
            icon="person-circle-outline"
            onPress={() => capture('back')}
            isUploaded={back}
            imageUri={backUri}
          />
        </View>

        <TouchableOpacity 
          style={[s.continueButton, !canContinue && s.continueButtonDisabled]} 
          disabled={!canContinue} 
          onPress={() => router.push('/kyc/selfie' as any)}
        >
          <View style={[s.gradientButton, { backgroundColor: canContinue ? '#000000' : '#E2E8F0' }]}>
            <Text style={[s.continueText, !canContinue && s.continueTextDisabled]}>Continue</Text>
          </View>
        </TouchableOpacity>
      </Animated.ScrollView>
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
  instructions: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  documentsContainer: {
    gap: 24,
    marginBottom: 32,
  },
  documentFrame: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  documentFrameSuccess: {
    borderColor: '#000000',
  },
  frameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  frameTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  frameTitleSuccess: {
    color: '#000000',
  },
  captureArea: {
    position: 'relative',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  capturedImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  successOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  successBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureGuide: {
    alignItems: 'center',
  },
  frameGuide: {
    width: width * 0.75,
    height: 200,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderColor: '#000000',
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderColor: '#000000',
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    width: 24,
    height: 24,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#000000',
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#000000',
    borderBottomRightRadius: 8,
  },
  cameraIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureHint: {
    marginTop: 16,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  continueButton: {
    marginTop: 24,
    marginBottom: 32,
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
