import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  icon,
  loading = false,
  style,
  textStyle,
  fullWidth = true,
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [rotateAnim] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    if (!disabled && !loading) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  // Loading animation
  React.useEffect(() => {
    if (loading) {
      const rotate = () => {
        rotateAnim.setValue(0);
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => rotate());
      };
      rotate();
    }
  }, [loading, rotateAnim]);

  const getBackgroundColor = () => {
    if (disabled || loading) return '#E2E8F0';
    
    switch (variant) {
      case 'primary':
        return '#000000';
      case 'secondary':
        return '#F1F5F9';
      case 'success':
        return '#000000';
      case 'danger':
        return '#000000';
      default:
        return '#000000';
    }
  };

  const getTextColor = () => {
    if (disabled || loading) return '#94A3B8';
    return variant === 'secondary' ? '#1E293B' : '#FFFFFF';
  };

  const getButtonHeight = () => {
    switch (size) {
      case 'small':
        return 40;
      case 'medium':
        return 48;
      case 'large':
        return 56;
      default:
        return 48;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'medium':
        return 16;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  const buttonStyle = [
    styles.button,
    fullWidth && styles.fullWidth,
    { opacity: disabled && !loading ? 0.6 : 1 },
    style,
  ];

  const gradientStyle = [
    styles.gradient,
    { height: getButtonHeight() }
  ];

  const textStyles = [
    styles.text,
    { 
      color: getTextColor(),
      fontSize: getFontSize(),
    },
    textStyle,
  ];

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[buttonStyle, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={styles.touchable}
      >
        <View
          style={[gradientStyle, { backgroundColor: getBackgroundColor() }]}
        >
          <View style={styles.content}>
            {loading ? (
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Ionicons name="sync" size={20} color={getTextColor()} />
              </Animated.View>
            ) : icon ? (
              <Ionicons name={icon} size={20} color={getTextColor()} />
            ) : null}
            
            {(!loading || !icon) && (
              <Text style={textStyles}>
                {loading ? 'Loading...' : title}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  touchable: {
    width: '100%',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontWeight: '700',
  },
});

export default AnimatedButton;