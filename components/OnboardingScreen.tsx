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
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { BitcoinLogo } from './Logo';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onGetStarted?: () => void;
  onSkip?: () => void;
}

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  iconLibrary: 'MaterialCommunityIcons' | 'Ionicons' | 'Feather';
  gradient: string[];
  image?: any;
}

const onboardingData: OnboardingSlide[] = [
  {
    id: '1',
    title: 'All-in-one crypto payment solution',
    subtitle: '',
    description: 'Send, receive, and manage your cryptocurrency with ease. Experience the future of digital payments.',
    icon: 'card',
    iconLibrary: 'Ionicons',
    gradient: ['#F7931A', '#FF8C00'],
  },
  {
    id: '2',
    title: 'Secure & Fast Transactions',
    subtitle: '',
    description: 'Bank-level security with instant transfers. Your money moves as fast as you do.',
    icon: 'shield-checkmark',
    iconLibrary: 'Ionicons',
    gradient: ['#F7931A', '#FF8C00'],
  },
  {
    id: '3',
    title: 'Global Network Access',
    subtitle: '',
    description: 'Connect with millions of users worldwide. Send money anywhere, anytime.',
    icon: 'globe',
    iconLibrary: 'Ionicons',
    gradient: ['#F7931A', '#FF8C00'],
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onGetStarted = () => console.log('Get Started pressed'),
  onSkip = () => console.log('Skip pressed'),
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation for background elements
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: (currentIndex + 1) / onboardingData.length,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const denom = (viewSize?.width || width || 1);
    let pageNum = Math.round(contentOffset.x / denom);
    if (!Number.isFinite(pageNum)) pageNum = 0;
    pageNum = Math.min(Math.max(pageNum, 0), onboardingData.length - 1);
    setCurrentIndex(pageNum);
  };

  const goToNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      onGetStarted();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollViewRef.current?.scrollTo({
        x: prevIndex * width,
        animated: true,
      });
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Ensure we never index out of bounds when referencing onboardingData[currentIndex]
  const safeIndex = Math.min(Math.max(currentIndex, 0), onboardingData.length - 1);

  const renderIcon = (slide: OnboardingSlide, size: number = 80) => {
    const iconProps = {
      name: slide.icon,
      size,
      color: '#FFFFFF',
    };

    switch (slide.iconLibrary) {
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={slide.icon as any} size={size} color="#FFFFFF" />;
      case 'Feather':
        return <Feather name={slide.icon as any} size={size} color="#FFFFFF" />;
      default:
        return <Ionicons name={slide.icon as any} size={size} color="#FFFFFF" />;
    }
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => (
    <View key={slide.id} style={styles.slide}>
      {/* Simple Background */}
      <View style={styles.backgroundContainer}>
        <View style={[styles.illustrationArea, { backgroundColor: `${slide.gradient[0]}15` }]} />
      </View>

      {/* Main Content */}
      <Animated.View 
        style={[
          styles.slideContent,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {/* Icon Container */}
        <Animatable.View 
          animation={currentIndex === index ? "fadeInUp" : undefined}
          duration={800}
          delay={200}
          style={styles.iconContainer}
        >
          <View style={[styles.iconCircle, { backgroundColor: slide.gradient[0] }]}>
            {renderIcon(slide, 40)}
          </View>
        </Animatable.View>

        {/* Title */}
        <Animatable.Text 
          animation={currentIndex === index ? "fadeInUp" : undefined}
          delay={400}
          style={styles.title}
        >
          {slide.title}
        </Animatable.Text>

        {/* Subtitle */}
        <Animatable.Text 
          animation={currentIndex === index ? "fadeInUp" : undefined}
          delay={600}
          style={styles.subtitle}
        >
          {slide.subtitle}
        </Animatable.Text>

        {/* Description */}
        <Animatable.Text 
          animation={currentIndex === index ? "fadeInUp" : undefined}
          delay={800}
          style={styles.description}
        >
          {slide.description}
        </Animatable.Text>
      </Animated.View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
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
        <View style={styles.logoContainer}>
          <BitcoinLogo size={64} />
        </View>
        
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={onSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Progress Bar */}
      <Animated.View 
        style={[
          styles.progressContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.progressTrack}>
          <Animated.View 
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentIndex + 1} of {onboardingData.length}
        </Text>
      </Animated.View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingData.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>

      {/* Dots Indicator */}
      <Animated.View 
        style={[
          styles.dotsContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {onboardingData.map((_, index) => (
          <Animatable.View 
            key={index}
            animation={currentIndex === index ? "zoomIn" : undefined}
            duration={300}
            style={[
              styles.dot,
              {
                backgroundColor: currentIndex === index 
                  ? onboardingData[safeIndex].gradient[0] 
                  : 'rgba(255, 255, 255, 0.3)',
                transform: [{ 
                  scale: currentIndex === index ? 1.2 : 1 
                }],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Navigation Buttons */}
      <Animated.View 
        style={[
          styles.buttonContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Previous Button */}
        <TouchableOpacity 
          style={[
            styles.navButton,
            styles.previousButton,
            { opacity: currentIndex === 0 ? 0.3 : 1 }
          ]}
          onPress={goToPrevious}
          disabled={currentIndex === 0}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#6B7280" />
        </TouchableOpacity>

        {/* Main Action Button */}
        <TouchableOpacity 
          style={styles.mainButton}
          onPress={goToNext}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={onboardingData[safeIndex].gradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>
              {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Ionicons 
              name={currentIndex === onboardingData.length - 1 ? 'rocket' : 'arrow-forward'} 
              size={20} 
              color="#FFFFFF" 
              style={styles.buttonIcon}
            />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.06, // Responsive padding
    paddingTop: height * 0.025,
    paddingBottom: height * 0.015,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  skipText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.06, // Responsive padding
    marginBottom: height * 0.025, // Responsive margin
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    marginRight: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
  progressText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: width,
    flex: 1,
    position: 'relative',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationArea: {
    width: width * 0.8,
    height: height * 0.4,
    borderRadius: 20,
    opacity: 0.5,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.1, // Responsive padding (10% of screen width)
    minHeight: height * 0.5, // Ensure minimum content height
  },
  iconContainer: {
    marginBottom: 60,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6366F1',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: '400',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.06, // Responsive padding
    paddingBottom: Math.max(40, height * 0.05), // Responsive bottom padding
    gap: 16,
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  previousButton: {
    // Additional styles for previous button if needed
  },
  mainButton: {
    flex: 1,
    height: Math.max(52, height * 0.065), // Responsive height
    borderRadius: Math.max(26, height * 0.032), // Responsive border radius
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    letterSpacing: 0.3,
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default OnboardingScreen;