import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import kycService from '@/services/KycService';
import AppHeader from '@/components/AppHeader';

export default function KycUploadProof() {
  const router = useRouter();
  const [animatedValue] = useState(new Animated.Value(0));
  const [progressValue] = useState(new Animated.Value(0));
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  useEffect(() => {
    // Fade in animation
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleUpload = async () => {
    setIsUploading(true);
    
    // Simulate upload progress
    Animated.timing(progressValue, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    // Simulate upload completion after 3 seconds
    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
    }, 3000);
  };

  const ProgressCircle = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const listener = progressValue.addListener(({ value }) => {
        setProgress(value);
      });
      return () => progressValue.removeListener(listener);
    }, []);

    return (
      <View style={s.progressCircle}>
        <View style={s.progressTrack} />
        <View 
          style={[
            s.progressFill, 
            { transform: [{ rotate: `${progress * 360}deg` }] }
          ]} 
        />
        <View style={s.progressCenter}>
          <Text style={s.progressText}>{Math.round(progress * 100)}%</Text>
        </View>
      </View>
    );
  };

  const UploadCard = ({ icon, title, description, status }: any) => (
    <View style={[s.uploadCard, status === 'completed' && s.uploadCardCompleted]}>
      <View style={s.cardLeft}>
        <View style={[s.cardIcon, { backgroundColor: '#000000' }]}>
          <Ionicons 
            name={status === 'completed' ? 'checkmark' : icon} 
            size={24} 
            color="#FFFFFF"
          />
        </View>
      </View>
      
      <View style={s.cardContent}>
        <Text style={[s.cardTitle, status === 'completed' && s.cardTitleCompleted]}>
          {title}
        </Text>
        <Text style={s.cardDescription}>{description}</Text>
      </View>
      
      <View style={s.cardRight}>
        {status === 'completed' ? (
          <View style={s.statusBadge}>
            <View style={[s.statusBadgeGradient, { backgroundColor: '#000000' }]}>
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </View>
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={20} color="#000000" />
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <AppHeader title="Upload proof of your identity" />

      <Animated.ScrollView 
        style={[s.content, { opacity: animatedValue }]} 
        showsVerticalScrollIndicator={false}
      >
        {!uploadComplete ? (
          <>
            <View style={s.headerSection}>
              <View style={[s.iconContainer, { backgroundColor: '#000000' }]}>
                <Ionicons name="cloud-upload-outline" size={32} color="#FFFFFF" />
              </View>
              
              <Text style={s.title}>Almost there!</Text>
              <Text style={s.subtitle}>
                Upload your documents to complete{"\n"}your identity verification
              </Text>
            </View>

            <View style={s.documentsSection}>
              <UploadCard
                icon="card-outline"
                title="Identity Document"
                description="Government issued ID, Passport or Driver's License"
                status="completed"
              />
              
              <UploadCard
                icon="person-circle-outline"
                title="Selfie Verification"
                description="Clear photo of yourself for identity matching"
                status="completed"
              />
              
              <UploadCard
                icon="document-text-outline"
                title="Additional Documents"
                description="Proof of address or additional verification documents"
                status="pending"
              />
            </View>

            {isUploading && (
              <Animated.View style={s.uploadingSection}>
                <ProgressCircle />
                <Text style={s.uploadingText}>Uploading your documents...</Text>
                <Text style={s.uploadingSubtext}>
                  Please wait while we securely process your information
                </Text>
              </Animated.View>
            )}

            <TouchableOpacity 
              style={[s.uploadButton, isUploading && s.uploadButtonDisabled]}
              onPress={handleUpload}
              disabled={isUploading}
            >
              <View style={[s.gradientButton, { backgroundColor: isUploading ? '#E2E8F0' : '#000000' }]}>
                <View style={s.buttonContent}>
                  {isUploading ? (
                    <Ionicons name="sync" size={20} color="#94A3B8" />
                  ) : (
                    <Ionicons name="cloud-upload" size={20} color="#FFFFFF" />
                  )}
                  <Text style={[s.buttonText, isUploading && s.buttonTextDisabled]}>
                    {isUploading ? 'Uploading...' : 'Upload Documents'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <Animated.View style={s.successSection}>
            <View style={[s.successIcon, { backgroundColor: '#000000' }]}>
              <Ionicons name="checkmark-circle" size={64} color="#FFFFFF" />
            </View>
            
            <Text style={[s.successTitle, { color: '#000000' }]}>Documents Uploaded Successfully!</Text>
            <Text style={s.successSubtitle}>
              Your identity verification is now under review.{"\n"}
              We'll notify you once it's completed.
            </Text>
            
            <View style={s.nextStepsCard}>
              <Text style={s.nextStepsTitle}>What happens next?</Text>
              
              <View style={s.stepItem}>
                <View style={s.stepNumber}>
                  <Text style={s.stepNumberText}>1</Text>
                </View>
                <Text style={s.stepText}>We review your documents (1-2 business days)</Text>
              </View>
              
              <View style={s.stepItem}>
                <View style={s.stepNumber}>
                  <Text style={s.stepNumberText}>2</Text>
                </View>
                <Text style={s.stepText}>You'll receive an email confirmation</Text>
              </View>
              
              <View style={s.stepItem}>
                <View style={s.stepNumber}>
                  <Text style={s.stepNumberText}>3</Text>
                </View>
                <Text style={s.stepText}>Your account will be fully activated</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={s.doneButton}
              onPress={() => router.push('/' as any)}
            >
              <View style={[s.gradientButton, { backgroundColor: '#000000' }]}>
                <Text style={s.buttonText}>Done</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  documentsSection: {
    gap: 16,
    marginBottom: 32,
  },
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#000000',
  },
  uploadCardCompleted: {
    borderColor: '#000000',
  },
  cardLeft: {
    marginRight: 16,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardTitleCompleted: {
    color: '#000000',
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  cardRight: {
    marginLeft: 12,
  },
  statusBadge: {
  },
  statusBadgeGradient: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingSection: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'relative',
    marginBottom: 24,
  },
  progressTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#E2E8F0',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: '#000000',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  progressCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  uploadingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  uploadingSubtext: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  uploadButton: {
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  uploadButtonDisabled: {
    opacity: 0.7,
  },
  gradientButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonTextDisabled: {
    color: '#94A3B8',
  },
  successSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#10B981',
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  nextStepsCard: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#000000',
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  doneButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
  },
});