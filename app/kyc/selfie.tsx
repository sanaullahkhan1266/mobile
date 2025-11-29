import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import kycService from '@/services/KycService';
import AppHeader from '@/components/AppHeader';

const { width } = Dimensions.get('window');

export default function KycSelfie() {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [selfieUri, setSelfieUri] = useState<string | undefined>();
  const [animatedValue] = useState(new Animated.Value(0));
  const [pulseAnimation] = useState(new Animated.Value(1));

  useEffect(() => {
    (async () => {
      const s = await kycService.getState();
      setDone(!!s.selfieDone);
      setSelfieUri(s.selfieUri);
    })();
    
    // Fade in animation
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    // Pulse animation for face oval
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ]).start(() => pulse());
    };
    
    if (!done) pulse();
  }, [done]);

  const capture = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') return;
    const res = await ImagePicker.launchCameraAsync({ 
      quality: 0.8, 
      cameraType: ImagePicker.CameraType.front,
      allowsEditing: true,
      aspect: [1, 1]
    });
    if (res.canceled) return;
    const uri = res.assets?.[0]?.uri;
    if (!uri) return;
    setSelfieUri(uri);
    setDone(true);
    await kycService.save({ selfieDone: true, selfieUri: uri });
  };

  const FaceOverlay = () => (
    <View style={s.faceOverlay}>
      <Animated.View style={[
        s.faceOutline,
        {
          transform: [{ scale: pulseAnimation }]
        }
      ]}>
        <View style={s.faceOval}>
          <View style={s.faceDots}>
            <View style={s.dot} />
            <View style={s.dot} />
          </View>
          <View style={s.faceSmile} />
        </View>
      </Animated.View>
      
      <View style={s.instructionBubble}>
        <View style={[s.bubbleGradient, { backgroundColor: '#000000' }]}>
          <Text style={s.bubbleText}>Position your face within the oval</Text>
        </View>
        <View style={[s.bubbleArrow, { borderTopColor: '#000000' }]} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <AppHeader title="Take a selfie of yourself" />

      <Animated.View style={[s.content, { opacity: animatedValue }]}>
        <Text style={s.instructions}>
          To match your face to your ID photo
        </Text>
        
        <View style={s.cameraContainer}>
          {selfieUri ? (
            <Animated.View style={[
              s.successContainer,
              {
                opacity: animatedValue,
                transform: [{
                  scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1]
                  })
                }]
              }
            ]}>
              <Image source={{ uri: selfieUri }} style={s.capturedSelfie} />
              <View style={s.successBadgeContainer}>
                <View style={[s.successBadge, { backgroundColor: '#000000' }]}>
                  <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                </View>
              </View>
              <Text style={[s.successText, { color: '#000000' }]}>Perfect! Selfie captured</Text>
            </Animated.View>
          ) : (
            <TouchableOpacity style={s.cameraArea} onPress={capture}>
              <FaceOverlay />
              
              <View style={s.captureButtonContainer}>
                <TouchableOpacity style={s.captureButton} onPress={capture}>
                  <View style={[s.captureButtonGradient, { backgroundColor: '#000000' }]}>
                    <Ionicons name="camera" size={32} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={s.helpSection}>
          <View style={s.helpItem}>
            <View style={s.helpIcon}>
              <Ionicons name="sunny-outline" size={20} color="#000000" />
            </View>
            <Text style={s.helpText}>Make sure you're in good lighting</Text>
          </View>
          
          <View style={s.helpItem}>
            <View style={s.helpIcon}>
              <Ionicons name="eye-outline" size={20} color="#000000" />
            </View>
            <Text style={s.helpText}>Look directly at the camera</Text>
          </View>
          
          <View style={s.helpItem}>
            <View style={s.helpIcon}>
              <Ionicons name="happy-outline" size={20} color="#000000" />
            </View>
            <Text style={s.helpText}>Keep a neutral expression</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[s.continueButton, !done && s.continueButtonDisabled]} 
          disabled={!done} 
          onPress={() => router.push('/kyc/review' as any)}
        >
          <View style={[s.gradientButton, { backgroundColor: done ? '#000000' : '#E2E8F0' }]}>
            <Text style={[s.continueText, !done && s.continueTextDisabled]}>Continue</Text>
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
  },
  instructions: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    paddingTop: 10,
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  cameraArea: {
    width: width * 0.85,
    height: width * 0.85,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceOutline: {
    width: 220,
    height: 280,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  faceOval: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceDots: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000000',
  },
  faceSmile: {
    width: 60,
    height: 30,
    borderBottomWidth: 3,
    borderColor: '#000000',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  instructionBubble: {
    position: 'absolute',
    top: 40,
    alignItems: 'center',
  },
  bubbleGradient: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  bubbleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bubbleArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#000000',
    marginTop: -1,
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: -80,
    alignItems: 'center',
  },
  captureButton: {
  },
  captureButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successContainer: {
    alignItems: 'center',
    gap: 16,
  },
  capturedSelfie: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#000000',
  },
  successBadgeContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  successBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    textAlign: 'center',
  },
  helpSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 16,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  helpIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  continueButton: {
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
