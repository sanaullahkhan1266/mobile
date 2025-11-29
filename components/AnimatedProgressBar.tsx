import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AnimatedProgressBarProps {
  progress: number; // 0-100
  height?: number;
  showPercentage?: boolean;
  animated?: boolean;
  duration?: number;
  colors?: string[];
  trackColor?: string;
  style?: ViewStyle;
  label?: string;
}

const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  progress,
  height = 8,
  showPercentage = true,
  animated = true,
  duration = 1000,
  colors = ['#667eea', '#764ba2'],
  trackColor = '#E2E8F0',
  style,
  label,
}) => {
  const [animatedWidth] = useState(new Animated.Value(0));
  const [animatedOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in animation
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Progress animation
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: progress,
        duration: duration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(progress);
    }
  }, [progress, animated, duration, animatedWidth, animatedOpacity]);

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.container, { opacity: animatedOpacity }, style]}>
      {(label || showPercentage) && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercentage && (
            <Text style={styles.percentage}>{Math.round(progress)}%</Text>
          )}
        </View>
      )}
      
      <View style={[styles.track, { height, backgroundColor: trackColor }]}>
        <Animated.View
          style={[
            styles.progressContainer,
            { 
              width: widthInterpolate,
              height: height,
            }
          ]}
        >
          <LinearGradient
            colors={colors}
            style={styles.progressFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>
        
        {/* Animated shimmer effect */}
        {progress > 0 && progress < 100 && (
          <View style={styles.shimmerContainer}>
            <LinearGradient
              colors={[
                'transparent',
                'rgba(255, 255, 255, 0.3)',
                'transparent',
              ]}
              style={styles.shimmer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const CircularProgress: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  colors?: string[];
  trackColor?: string;
  showPercentage?: boolean;
  animated?: boolean;
}> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  colors = ['#667eea', '#764ba2'],
  trackColor = '#E2E8F0',
  showPercentage = true,
  animated = true,
}) => {
  const [animatedValue] = useState(new Animated.Value(0));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: progress,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(progress);
    }
  }, [progress, animated, animatedValue]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[styles.circularContainer, { width: size, height: size }]}>
      {/* Track Circle */}
      <View style={styles.circularTrack}>
        <View 
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: trackColor,
            }
          ]}
        />
      </View>
      
      {/* Progress Circle */}
      <View style={styles.circularProgress}>
        <LinearGradient
          colors={colors}
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: 'transparent',
            }
          ]}
        />
      </View>
      
      {showPercentage && (
        <View style={styles.circularCenter}>
          <Text style={styles.circularPercentage}>
            {Math.round(progress)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  percentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667eea',
  },
  track: {
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  progressContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    flex: 1,
    borderRadius: 8,
  },
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    borderRadius: 8,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '20%',
    left: '-20%',
  },
  circularContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circularTrack: {
    position: 'absolute',
  },
  circularProgress: {
    position: 'absolute',
  },
  circle: {
    backgroundColor: 'transparent',
  },
  circularCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularPercentage: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
});

export default AnimatedProgressBar;
export { CircularProgress };