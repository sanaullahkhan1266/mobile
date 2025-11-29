import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { BitcoinLogo } from './components/Logo';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onAutoRedirect?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onAutoRedirect = () => console.log('Auto redirect to onboarding'),
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Logo animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto redirect after 3 seconds
    const timer = setTimeout(() => {
      onAutoRedirect();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onAutoRedirect]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.splashContainer}>
        {/* Logo */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          <BitcoinLogo size={120} />
        </Animated.View>

        {/* Loading indicator */}
        <Animatable.View 
          animation="pulse" 
          iterationCount="infinite" 
          duration={1000}
          style={styles.loadingContainer}
        >
          <View style={styles.loadingDot} />
          <View style={[styles.loadingDot, { marginLeft: 8 }]} />
          <View style={[styles.loadingDot, { marginLeft: 8 }]} />
        </Animatable.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 1,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    marginTop: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
  },
});

export default WelcomeScreen;