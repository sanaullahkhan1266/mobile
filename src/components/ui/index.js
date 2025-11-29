import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

// Custom Header Component
export const CustomHeader = ({ title, onBackPress, rightIcon, onRightPress, backgroundColor = 'transparent' }) => (
  <View style={[styles.header, { backgroundColor }]}>
    <TouchableOpacity style={styles.headerButton} onPress={onBackPress}>
      <Icon name="arrow-back" size={24} color={colors.text.white} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
    {rightIcon && (
      <TouchableOpacity style={styles.headerButton} onPress={onRightPress}>
        <Icon name={rightIcon} size={24} color={colors.text.white} />
      </TouchableOpacity>
    )}
  </View>
);

// Gradient Button Component
export const GradientButton = ({ 
  title, 
  onPress, 
  gradient = colors.gradients.primary, 
  style = {},
  textStyle = {},
  disabled = false,
  icon = null
}) => (
  <TouchableOpacity 
    style={[styles.buttonContainer, style]} 
    onPress={onPress} 
    disabled={disabled}
    activeOpacity={0.8}
  >
    <LinearGradient
      colors={disabled ? ['#BDBDBD', '#9E9E9E'] : gradient}
      style={styles.gradientButton}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      {icon && <Icon name={icon} size={20} color={colors.text.white} style={styles.buttonIcon} />}
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

// Card Component
export const Card = ({ children, style = {}, gradient = null, shadow = 'light' }) => {
  if (gradient) {
    return (
      <LinearGradient
        colors={gradient}
        style={[styles.card, colors.shadows[shadow], style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    );
  }
  
  return (
    <View style={[styles.card, colors.shadows[shadow], style]}>
      {children}
    </View>
  );
};

// Stats Card Component
export const StatsCard = ({ title, value, subtitle, color = colors.primary, icon }) => (
  <Card style={[styles.statsCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
    <View style={styles.statsHeader}>
      {icon && <Icon name={icon} size={24} color={color} />}
      <Text style={[styles.statsTitle, { color }]}>{title}</Text>
    </View>
    <Text style={styles.statsValue}>{value}</Text>
    {subtitle && <Text style={styles.statsSubtitle}>{subtitle}</Text>}
  </Card>
);

// Level Progress Component
export const LevelProgress = ({ 
  level, 
  progress, 
  total, 
  cardActivation, 
  transaction, 
  tier2,
  gradient = colors.gradients.pink 
}) => (
  <Card gradient={gradient} style={styles.levelCard}>
    <View style={styles.levelHeader}>
      <View style={styles.levelBadge}>
        <Icon name="diamond" size={20} color={colors.text.white} />
        <Text style={styles.levelText}>LV{level}</Text>
      </View>
      <Text style={styles.currentLevelText}>Current Level</Text>
      <Text style={styles.progressText}>{progress}/{total}</Text>
    </View>
    
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: `${(progress/total) * 100}%` }]} />
    </View>
    
    <View style={styles.levelStats}>
      <View style={styles.levelStat}>
        <Text style={styles.levelStatLabel}>Card activation</Text>
        <Text style={styles.levelStatValue}>{cardActivation}%</Text>
      </View>
      <View style={styles.levelStat}>
        <Text style={styles.levelStatLabel}>Transaction</Text>
        <Text style={styles.levelStatValue}>{transaction}%</Text>
      </View>
      <View style={styles.levelStat}>
        <Text style={styles.levelStatLabel}>Tier 2</Text>
        <Text style={styles.levelStatValue}>{tier2}%</Text>
      </View>
    </View>
  </Card>
);

// Tab Component
export const TabBar = ({ tabs, activeTab, onTabPress }) => (
  <View style={styles.tabBar}>
    {tabs.map((tab, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.tab,
          activeTab === index && styles.activeTab
        ]}
        onPress={() => onTabPress(index)}
      >
        <Text style={[
          styles.tabText,
          activeTab === index && styles.activeTabText
        ]}>
          {tab}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

// Setting Item Component
export const SettingItem = ({ 
  icon, 
  title, 
  subtitle = null, 
  value = null, 
  onPress, 
  showArrow = true,
  valueColor = colors.text.secondary,
  iconColor = colors.text.secondary,
  dangerous = false
}) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingLeft}>
      <View style={[styles.settingIcon, dangerous && { backgroundColor: colors.error + '20' }]}>
        <Icon 
          name={icon} 
          size={24} 
          color={dangerous ? colors.error : iconColor} 
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, dangerous && { color: colors.error }]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <View style={styles.settingRight}>
      {value && (
        <Text style={[styles.settingValue, { color: valueColor }]}>
          {value}
        </Text>
      )}
      {showArrow && (
        <Icon name="chevron-right" size={24} color={colors.text.disabled} />
      )}
    </View>
  </TouchableOpacity>
);

// Empty State Component
export const EmptyState = ({ 
  icon, 
  title, 
  subtitle, 
  action = null,
  style = {}
}) => (
  <View style={[styles.emptyState, style]}>
    <View style={styles.emptyIcon}>
      <Icon name={icon} size={64} color={colors.text.disabled} />
    </View>
    <Text style={styles.emptyTitle}>{title}</Text>
    {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
    {action}
  </View>
);

const styles = StyleSheet.create({
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    height: 80,
  },
  headerButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
  },
  headerTitle: {
    ...typography.h4,
    color: colors.text.white,
    flex: 1,
    textAlign: 'center',
  },

  // Button Styles
  buttonContainer: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  buttonText: {
    ...typography.button,
    color: colors.text.white,
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },

  // Card Styles
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.sm,
  },
  
  // Stats Card
  statsCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statsTitle: {
    ...typography.caption,
    marginLeft: spacing.sm,
    textTransform: 'uppercase',
  },
  statsValue: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  statsSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
  },

  // Level Progress
  levelCard: {
    marginVertical: spacing.md,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  levelText: {
    ...typography.button,
    color: colors.text.white,
    marginLeft: spacing.xs,
  },
  currentLevelText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    flex: 1,
    textAlign: 'center',
  },
  progressText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.text.white,
    borderRadius: borderRadius.sm,
  },
  levelStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelStat: {
    alignItems: 'center',
  },
  levelStatLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  levelStatValue: {
    ...typography.h4,
    color: colors.text.white,
    marginTop: spacing.xs,
  },

  // Tab Styles
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.text.white,
    fontWeight: '600',
  },

  // Setting Item
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body1,
    color: colors.text.primary,
  },
  settingSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    ...typography.body2,
    marginRight: spacing.sm,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h4,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});