import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { BitcoinLogo } from './Logo';

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
  onSignUp?: () => void;
  onLogin?: () => void;
  onClose?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSignUp = () => console.log('Sign Up pressed'),
  onLogin = () => console.log('Login pressed'),
  onClose = () => console.log('Close pressed'),
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
          <View style={styles.headerLeft}>
            <BitcoinLogo size={64} />
          </View>
          
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color="#1F2937" />
          </TouchableOpacity>
        </Animated.View>

        {/* Main Content */}
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Illustration Area */}
          <View style={styles.illustrationContainer}>
            <Animatable.View 
              animation="pulse" 
              iterationCount="infinite" 
              duration={3000}
              style={styles.illustrationBackground}
            >
              {/* Person illustration placeholder */}
              <View style={styles.personContainer}>
                <View style={styles.person}>
                  <View style={styles.personHead} />
                  <View style={styles.personBody} />
                </View>
              </View>
              
              {/* Floating elements */}
              <Animatable.View 
                animation="bounce" 
                iterationCount="infinite" 
                duration={2000}
                style={[styles.floatingCard, styles.card1]}
              >
                <MaterialCommunityIcons name="credit-card" size={20} color="#6366F1" />
              </Animatable.View>
              
              <Animatable.View 
                animation="bounce" 
                iterationCount="infinite" 
                duration={2500}
                delay={500}
                style={[styles.floatingCard, styles.card2]}
              >
                <MaterialCommunityIcons name="wallet" size={18} color="#10B981" />
              </Animatable.View>
              
              <Animatable.View 
                animation="bounce" 
                iterationCount="infinite" 
                duration={2200}
                delay={1000}
                style={[styles.floatingCard, styles.card3]}
              >
                <Ionicons name="cafe" size={16} color="#F59E0B" />
              </Animatable.View>
              
              {/* Coins */}
              <View style={[styles.coin, styles.coin1]} />
              <View style={[styles.coin, styles.coin2]} />
              <View style={[styles.coinStack, styles.coinStack1]}>
                <View style={styles.coinStackItem} />
                <View style={styles.coinStackItem} />
                <View style={styles.coinStackItem} />
              </View>
            </Animatable.View>
          </View>

          {/* Offer Section */}
          <Animatable.View 
            animation="fadeInUp" 
            delay={400}
            style={styles.offerSection}
          >
            <Text style={styles.offerTitle}>$5 spending credit on us</Text>
            <Text style={styles.offerSubtitle}>Exclusively for new users. Sign up now!</Text>
          </Animatable.View>

          {/* Action Buttons */}
          <Animatable.View 
            animation="fadeInUp" 
            delay={600}
            style={styles.buttonContainer}
          >
            <TouchableOpacity 
              style={styles.signUpButton}
              onPress={onSignUp}
              activeOpacity={0.85}
            >
              <Text style={styles.signUpButtonText}>Sign up</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={onLogin}
              activeOpacity={0.85}
            >
              <Text style={styles.loginButtonText}>Log in</Text>
            </TouchableOpacity>
          </Animatable.View>
        </Animated.View>

        {/* Learn Section */}
        <Animatable.View 
          animation="fadeInUp" 
          delay={800}
          style={styles.learnSection}
        >
          <View style={styles.learnHeader}>
            <Text style={styles.learnTitle}>Learn</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.learnCard}
            activeOpacity={0.7}
          >
            <View style={styles.learnContent}>
              <Text style={styles.learnCardTitle}>Refer Friends Get Rewards</Text>
              <Text style={styles.learnCardSubtitle}>3 min read</Text>
            </View>
            <View style={styles.learnIllustration}>
              <MaterialCommunityIcons name="gift" size={32} color="#1F2937" />
            </View>
          </TouchableOpacity>
        </Animatable.View>

        {/* Bottom Navigation Placeholder */}
        <View style={styles.bottomNavPlaceholder}>
          <View style={styles.navItem}>
            <Ionicons name="home" size={20} color="#EF4444" />
            <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons name="card" size={20} color="#9CA3AF" />
            <Text style={styles.navText}>Card</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons name="apps" size={20} color="#9CA3AF" />
            <Text style={styles.navText}>Hub</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.02,
    paddingBottom: height * 0.015,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.06,
  },
  illustrationContainer: {
    height: height * 0.4,
    marginVertical: height * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationBackground: {
    width: width * 0.8,
    height: height * 0.35,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  personContainer: {
    position: 'absolute',
    bottom: height * 0.05,
  },
  person: {
    alignItems: 'center',
  },
  personHead: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1D5DB',
    marginBottom: 5,
  },
  personBody: {
    width: 60,
    height: 80,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
  },
  floatingCard: {
    position: 'absolute',
    width: 50,
    height: 35,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  card1: {
    top: height * 0.08,
    right: width * 0.15,
    backgroundColor: '#F3F4F6',
  },
  card2: {
    top: height * 0.04,
    left: width * 0.1,
    backgroundColor: '#ECFDF5',
  },
  card3: {
    bottom: height * 0.15,
    left: width * 0.05,
    backgroundColor: '#FFFBEB',
  },
  coin: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FCD34D',
  },
  coin1: {
    bottom: height * 0.12,
    right: width * 0.2,
  },
  coin2: {
    bottom: height * 0.08,
    right: width * 0.25,
  },
  coinStack: {
    position: 'absolute',
    bottom: height * 0.05,
    right: width * 0.1,
  },
  coinStack1: {},
  coinStackItem: {
    width: 20,
    height: 6,
    borderRadius: 10,
    backgroundColor: '#FCD34D',
    marginBottom: 2,
  },
  offerSection: {
    alignItems: 'center',
    marginVertical: height * 0.03,
  },
  offerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  offerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: height * 0.02,
  },
  signUpButton: {
    flex: 1,
    height: Math.max(52, height * 0.065),
    borderRadius: Math.max(26, height * 0.032),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  loginButton: {
    flex: 1,
    height: Math.max(52, height * 0.065),
    borderRadius: Math.max(26, height * 0.032),
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  learnSection: {
    marginTop: height * 0.04,
    paddingHorizontal: width * 0.06,
  },
  learnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  learnTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  learnCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  learnContent: {
    flex: 1,
  },
  learnCardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  learnCardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  learnIllustration: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNavPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: width * 0.06,
    marginTop: height * 0.03,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  activeNavText: {
    color: '#EF4444',
  },
});

export default HomeScreen;