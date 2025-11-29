import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, StatusBar, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import kycService, { KycState } from '@/services/KycService';
import AppHeader from '@/components/AppHeader';

export default function KycHome() {
  const router = useRouter();
  const [state, setState] = useState<KycState>({ status: 'not_started' });
  const [progress, setProgress] = useState(0);
  const [animatedValue] = useState(new Animated.Value(0));

  const refresh = async () => {
    const s = await kycService.getState();
    setState(s);
    setProgress(kycService.computeProgress(s));
  };

  useEffect(() => { 
    refresh(); 
    
    // Fade in animation
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const steps = [
    {
      id: 'country',
      title: 'Select country/region',
      description: 'Choose your country of residence',
      icon: 'globe-outline',
      route: '/kyc/country',
      completed: !!state.country,
    },
    {
      id: 'personal-info',
      title: 'Personal information',
      description: 'Enter your personal details',
      icon: 'person-outline',
      route: '/kyc/personal-info',
      completed: !!state.personalInfo,
    },
    {
      id: 'document-type',
      title: 'Document type',
      description: 'Choose your ID document type',
      icon: 'card-outline',
      route: '/kyc/document-type',
      completed: !!state.document?.type,
    },
    {
      id: 'document-capture',
      title: 'Upload document',
      description: 'Take photos of your ID',
      icon: 'camera-outline',
      route: '/kyc/document-capture',
      completed: !!(state.document?.frontUploaded && state.document?.backUploaded),
    },
    {
      id: 'selfie',
      title: 'Selfie verification',
      description: 'Take a selfie for identity matching',
      icon: 'person-circle-outline',
      route: '/kyc/selfie',
      completed: !!state.selfieDone,
    },
  ];

  const StepCard = ({ step, index, isLast }: any) => (
    <Animated.View 
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
        style={[s2.stepCard, step.completed && s2.stepCardCompleted]}
        onPress={() => router.push(step.route as any)}
      >
        <View style={s2.stepLeft}>
          <View style={s2.stepNumber}>
            {step.completed ? (
              <View style={[s2.stepNumberCompleted, { backgroundColor: '#000000' }]}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
            ) : (
              <View style={[s2.stepNumberPending, { backgroundColor: '#000000' }]}>
                <Text style={s2.stepNumberText}>{index + 1}</Text>
              </View>
            )}
          </View>
          
          {!isLast && (
            <View style={[s2.stepConnector, step.completed && s2.stepConnectorCompleted]} />
          )}
        </View>
        
        <View style={s2.stepContent}>
          <View style={s2.stepHeader}>
            <View style={[s2.stepIcon, { backgroundColor: '#000000' }]}>
              <Ionicons 
                name={step.icon as any} 
                size={20} 
                color="#FFFFFF"
              />
            </View>
            
            <View style={s2.stepTextContainer}>
              <Text style={[s2.stepTitle, step.completed && s2.stepTitleCompleted]}>
                {step.title}
              </Text>
              <Text style={s2.stepDescription}>{step.description}</Text>
            </View>
            
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color="#000000"
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={s2.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <AppHeader title="Let's verify KYC" />

      <Animated.ScrollView 
        style={[s2.content, { opacity: animatedValue }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s2.heroSection}>
          <View style={s2.heroIcon}>
            <Ionicons name="shield-checkmark-outline" size={40} color="#FFFFFF" />
          </View>
          
          <Text style={s2.heroTitle}>Verify your identity</Text>
          <Text style={s2.heroSubtitle}>
            Complete the steps below to verify your identity and secure your account.
          </Text>
          
          <View style={s2.progressContainer}>
            <View style={s2.progressHeader}>
              <Text style={s2.progressLabel}>Progress</Text>
              <Text style={s2.progressPercentage}>{progress}% completed</Text>
            </View>
            
            <View style={s2.progressBarContainer}>
              <View style={s2.progressBarTrack}>
                <Animated.View 
                  style={[
                    s2.progressBarFill,
                    { width: `${progress}%` }
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={s2.stepsContainer}>
          {steps.map((step, index) => (
            <StepCard 
              key={step.id}
              step={step} 
              index={index} 
              isLast={index === steps.length - 1}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={s2.submitButton} 
          onPress={() => router.push('/kyc/upload-proof' as any)}
        >
          <View style={[s2.gradientButton, { backgroundColor: '#000000' }]}>
            <Text style={s2.submitButtonText}>
              {state.status === 'submitted' ? 'View Submission' : 'Complete Verification'}
            </Text>
          </View>
        </TouchableOpacity>

        {state.status === 'submitted' && (
          <View style={s2.submittedCard}>
            <View style={[s2.submittedIcon, { backgroundColor: '#000000' }]}>
              <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
            </View>
            <View style={s2.submittedContent}>
              <Text style={s2.submittedTitle}>Verification Submitted</Text>
              <Text style={s2.submittedText}>
                Your documents are being reviewed. We'll notify you once it's complete.
              </Text>
            </View>
          </View>
        )}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const s2 = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderRadius: 20,
    marginBottom: 24,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#000000',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667eea',
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#667eea',
  },
  stepsContainer: {
    gap: 0,
  },
  stepCard: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 4,
  },
  stepCardCompleted: {
    borderWidth: 1,
    borderColor: '#000000',
  },
  stepLeft: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingLeft: 20,
    paddingRight: 16,
  },
  stepNumber: {
    position: 'relative',
    zIndex: 1,
  },
  stepNumberCompleted: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberPending: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  stepConnector: {
    position: 'absolute',
    top: 48,
    width: 2,
    height: 40,
    backgroundColor: '#E2E8F0',
    left: '50%',
    marginLeft: -1,
  },
  stepConnectorCompleted: {
    backgroundColor: '#10B981',
  },
  stepContent: {
    flex: 1,
    paddingVertical: 20,
    paddingRight: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  stepTitleCompleted: {
    color: '#10B981',
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  submittedCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 32,
  },
  submittedIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  submittedContent: {
    flex: 1,
  },
  submittedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  submittedText: {
    fontSize: 14,
    color: '#059669',
    lineHeight: 20,
  },
});
