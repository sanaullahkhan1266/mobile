import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
  onLogin?: (credentials: { email: string; password: string }) => void;
  onBack?: () => void;
  onSignUp?: () => void;
  onGoogle?: () => void;
  onMetamask?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin = (credentials) => console.log('Login pressed with:', credentials.email),
  onBack = () => console.log('Back pressed'),
  onSignUp = () => console.log('Sign Up pressed'),
  onGoogle = () => console.log('Google pressed'),
  onMetamask = () => console.log('MetaMask pressed'),
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      await onLogin?.({ email: email.trim(), password: password });
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons name="help-circle-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        </Animated.View>

        {/* Main Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Log in</Text>
          </View>

          {/* Email/password login */}

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Next Button */}
            <TouchableOpacity 
              style={[styles.nextButton, (!email || !password || isLoading) && styles.disabledButton]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={!email || !password || isLoading}
            >
              {isLoading ? (
                <Animatable.View animation="rotate" iterationCount="infinite" duration={1000}>
                  <Ionicons name="refresh" size={20} color="#9CA3AF" />
                </Animatable.View>
              ) : (
                <Text style={[styles.nextButtonText, !email && styles.disabledButtonText]}>
                  Next
                </Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={onSignUp} activeOpacity={0.7}>
                <Text style={styles.signUpLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
          </Animated.View>
        </ScrollView>

        {/* Social Login */}
        <Animated.View 
          style={[
            styles.socialContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.socialTitle}>Or continue with</Text>
          
          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={styles.socialButton}
              activeOpacity={0.7}
              onPress={onGoogle}
            >
              <Text style={styles.socialButtonText}>G</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.socialButton}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-apple" size={24} color="#1F2937" />
            </TouchableOpacity>

            {/* Web-only MetaMask connect */}
            <TouchableOpacity 
              style={styles.socialButton}
              activeOpacity={0.7}
              onPress={onMetamask}
            >
              <Ionicons name="logo-electron" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.06, // Responsive padding
    paddingTop: height * 0.025, // Responsive top padding
    paddingBottom: height * 0.025,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    paddingHorizontal: width * 0.06, // Responsive padding
    minHeight: height * 0.7, // Ensure minimum content height for ScrollView
  },
  titleSection: {
    marginBottom: height * 0.04, // Responsive margin
    paddingTop: height * 0.02,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: height * 0.04, // Responsive margin
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: '#1F2937',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  activeToggleText: {
    color: '#FFFFFF',
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: height * 0.04, // Responsive margin
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: width * 0.04, // Responsive padding
    height: Math.max(52, height * 0.065), // Responsive height with minimum
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    paddingVertical: 0,
  },
  nextButton: {
    height: Math.max(52, height * 0.065), // Responsive height
    borderRadius: Math.max(26, height * 0.032), // Responsive border radius
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.03,
    marginTop: height * 0.02,
  },
  disabledButton: {
    backgroundColor: '#F3F4F6',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  signUpLink: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  socialContainer: {
    paddingHorizontal: width * 0.06,
    paddingBottom: Math.max(40, height * 0.05), // Responsive bottom padding
    marginTop: 'auto', // Push to bottom
  },
  socialTitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
});

export default LoginScreen;