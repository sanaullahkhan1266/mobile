import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export type StatusType = 'pending' | 'processing' | 'completed' | 'error' | 'warning';

interface StatusIndicatorProps {
  status: StatusType;
  title: string;
  description?: string;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  style?: ViewStyle;
  showIcon?: boolean;
  customIcon?: keyof typeof Ionicons.glyphMap;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  title,
  description,
  size = 'medium',
  animated = true,
  style,
  showIcon = true,
  customIcon,
}) => {
  const [scaleAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Initial scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 3,
      useNativeDriver: true,
    }).start();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Pulse animation for processing status
    if (animated && status === 'processing') {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => pulse());
      };
      pulse();
    }
  }, [status, animated, scaleAnim, pulseAnim, fadeAnim]);

  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          colors: ['#F59E0B', '#D97706'],
          backgroundColor: '#FEF3C7',
          borderColor: '#F59E0B',
          icon: customIcon || 'time-outline',
          textColor: '#92400E',
        };
      case 'processing':
        return {
          colors: ['#3B82F6', '#1D4ED8'],
          backgroundColor: '#DBEAFE',
          borderColor: '#3B82F6',
          icon: customIcon || 'sync-outline',
          textColor: '#1E40AF',
        };
      case 'completed':
        return {
          colors: ['#10B981', '#059669'],
          backgroundColor: '#D1FAE5',
          borderColor: '#10B981',
          icon: customIcon || 'checkmark-circle-outline',
          textColor: '#065F46',
        };
      case 'error':
        return {
          colors: ['#EF4444', '#DC2626'],
          backgroundColor: '#FEE2E2',
          borderColor: '#EF4444',
          icon: customIcon || 'close-circle-outline',
          textColor: '#991B1B',
        };
      case 'warning':
        return {
          colors: ['#F59E0B', '#D97706'],
          backgroundColor: '#FEF3C7',
          borderColor: '#F59E0B',
          icon: customIcon || 'warning-outline',
          textColor: '#92400E',
        };
      default:
        return {
          colors: ['#6B7280', '#4B5563'],
          backgroundColor: '#F3F4F6',
          borderColor: '#6B7280',
          icon: customIcon || 'information-circle-outline',
          textColor: '#374151',
        };
    }
  };

  const config = getStatusConfig();

  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'medium': return 20;
      case 'large': return 24;
      default: return 20;
    }
  };

  const getTitleFontSize = () => {
    switch (size) {
      case 'small': return 14;
      case 'medium': return 16;
      case 'large': return 18;
      default: return 16;
    }
  };

  const getDescriptionFontSize = () => {
    switch (size) {
      case 'small': return 12;
      case 'medium': return 14;
      case 'large': return 16;
      default: return 14;
    }
  };

  const getBadgeSize = () => {
    switch (size) {
      case 'small': return { width: 32, height: 32, borderRadius: 16 };
      case 'medium': return { width: 40, height: 40, borderRadius: 20 };
      case 'large': return { width: 48, height: 48, borderRadius: 24 };
      default: return { width: 40, height: 40, borderRadius: 20 };
    }
  };

  const badgeSize = getBadgeSize();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    >
      {showIcon && (
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: status === 'processing' ? [{ scale: pulseAnim }] : [],
            },
          ]}
        >
          <LinearGradient
            colors={config.colors}
            style={[styles.iconBadge, badgeSize]}
          >
            <Ionicons
              name={config.icon as any}
              size={getIconSize()}
              color="#FFFFFF"
            />
          </LinearGradient>
        </Animated.View>
      )}

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: config.textColor,
              fontSize: getTitleFontSize(),
            },
          ]}
        >
          {title}
        </Text>
        {description && (
          <Text
            style={[
              styles.description,
              {
                fontSize: getDescriptionFontSize(),
              },
            ]}
          >
            {description}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

// Compact badge variant
export const StatusBadge: React.FC<{
  status: StatusType;
  text: string;
  size?: 'small' | 'medium';
  style?: ViewStyle;
}> = ({ status, text, size = 'small', style }) => {
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);

  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return { backgroundColor: '#FEF3C7', textColor: '#92400E', dotColor: '#F59E0B' };
      case 'processing':
        return { backgroundColor: '#DBEAFE', textColor: '#1E40AF', dotColor: '#3B82F6' };
      case 'completed':
        return { backgroundColor: '#D1FAE5', textColor: '#065F46', dotColor: '#10B981' };
      case 'error':
        return { backgroundColor: '#FEE2E2', textColor: '#991B1B', dotColor: '#EF4444' };
      case 'warning':
        return { backgroundColor: '#FEF3C7', textColor: '#92400E', dotColor: '#F59E0B' };
      default:
        return { backgroundColor: '#F3F4F6', textColor: '#374151', dotColor: '#6B7280' };
    }
  };

  const config = getStatusConfig();
  const isSmall = size === 'small';

  return (
    <Animated.View
      style={[
        styles.badge,
        {
          backgroundColor: config.backgroundColor,
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        },
        style,
      ]}
    >
      <View
        style={[
          styles.statusDot,
          {
            backgroundColor: config.dotColor,
            width: isSmall ? 6 : 8,
            height: isSmall ? 6 : 8,
            borderRadius: isSmall ? 3 : 4,
          },
        ]}
      />
      <Text
        style={[
          styles.badgeText,
          {
            color: config.textColor,
            fontSize: isSmall ? 12 : 14,
          },
        ]}
      >
        {text}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  iconBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    marginBottom: 2,
  },
  description: {
    color: '#6B7280',
    lineHeight: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  badgeText: {
    fontWeight: '600',
  },
});

export default StatusIndicator;