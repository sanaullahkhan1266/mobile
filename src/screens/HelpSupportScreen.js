import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { GradientButton } from '../components/ui';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

const HelpSupportScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();

  const supportOptions = [
    {
      id: 1,
      title: 'Messages',
      description: 'Send us a message and get help',
      icon: 'message',
      action: () => navigation.navigate('Messages')
    },
    {
      id: 2,
      title: 'Help',
      description: 'Browse our help articles',
      icon: 'help',
      action: () => navigation.navigate('Help')
    },
    {
      id: 3,
      title: 'Send us a message',
      description: 'Contact our support team directly',
      icon: 'send',
      action: () => navigation.navigate('Messages', { openCompose: true })
    },
    {
      id: 4,
      title: 'Search for help',
      description: 'Find specific help topics',
      icon: 'search',
      action: () => navigation.navigate('HelpSearch')
    }
  ];

  const teamMembers = [
    { id: 1, avatar: '👨‍💼', color: '#4A90E2', name: 'Support Team' },
    { id: 2, avatar: '👩‍💼', color: '#F5A623', name: 'Technical Team' },
    { id: 3, avatar: '👨‍💻', color: '#7ED321', name: 'Developer Team' },
  ];

  const renderTeamMember = (member) => {
    return (
      <View key={member.id} style={[
        styles.teamMember,
        { backgroundColor: member.color }
      ]}>
        <Text style={styles.teamMemberAvatar}>{member.avatar}</Text>
      </View>
    );
  };

  const renderSupportOption = (option) => {
    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.supportOption,
          { 
            backgroundColor: isDarkMode ? theme.colors.surface : '#FFFFFF',
            borderColor: isDarkMode ? theme.colors.gray[700] : '#E0E0E0',
          }
        ]}
        onPress={option.action}
        activeOpacity={0.7}
      >
        <View style={styles.supportOptionContent}>
          <View style={[
            styles.supportOptionIcon,
            { backgroundColor: isDarkMode ? theme.colors.gray[700] : '#F5F5F5' }
          ]}>
            <Icon 
              name={option.icon} 
              size={24} 
              color={isDarkMode ? theme.colors.text.primary : colors.text.secondary} 
            />
          </View>
          <View style={styles.supportOptionText}>
            <Text style={[
              styles.supportOptionTitle,
              { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
            ]}>
              {option.title}
            </Text>
            <Text style={[
              styles.supportOptionDescription,
              { color: isDarkMode ? theme.colors.text.secondary : colors.text.secondary }
            ]}>
              {option.description}
            </Text>
          </View>
        </View>
        <Icon name="chevron-right" size={20} color={colors.text.disabled} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDarkMode ? theme.colors.background.primary : '#F0F0F0' }
    ]}>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      
      {/* Header with Gradient Background */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#1A1A2E', '#16213E', '#0F3460']}
          style={styles.gradientHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Team Members */}
          <View style={styles.teamMembersContainer}>
            {teamMembers.map((member, index) => (
              <View 
                key={member.id}
                style={[
                  styles.teamMemberWrapper,
                  { 
                    marginLeft: index > 0 ? -spacing.sm : 0,
                    zIndex: teamMembers.length - index,
                  }
                ]}
              >
                {renderTeamMember(member)}
              </View>
            ))}
          </View>

          {/* Welcome Message */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeEmoji}>👋</Text>
            <Text style={styles.welcomeTitle}>Hi there</Text>
            <Text style={styles.welcomeSubtitle}>How can we help?</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Support Options */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.supportOptionsContainer}>
          {supportOptions.map(option => renderSupportOption(option))}
        </View>

        {/* Additional Help Text */}
        <View style={styles.helpTextContainer}>
          <Text style={[
            styles.helpText,
            { color: isDarkMode ? theme.colors.text.secondary : colors.text.secondary }
          ]}>
            Our support team is available 24/7 to help you with any questions or issues you may have.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 320,
  },
  gradientHeader: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: spacing.lg,
    padding: spacing.sm,
    zIndex: 10,
  },
  teamMembersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  teamMemberWrapper: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 30,
  },
  teamMember: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamMemberAvatar: {
    fontSize: 24,
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  supportOptionsContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    ...colors.shadows.light,
    marginBottom: spacing.sm,
  },
  supportOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  supportOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  supportOptionText: {
    flex: 1,
  },
  supportOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
  },
  supportOptionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  helpTextContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  helpText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
});

export default HelpSupportScreen;