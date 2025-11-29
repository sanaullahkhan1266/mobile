import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Clipboard,
  Alert,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  CustomHeader,
  GradientButton,
  Card,
  StatsCard,
  LevelProgress,
} from '../components/ui';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

const { width } = Dimensions.get('window');

const InviteFriendsScreen = ({ navigation }) => {
  const [referralCode] = useState('0nht8');
  const [referralLink] = useState('https://url.hk/i/en/0nht8');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const flatListRef = useRef(null);

  const levelData = [
    {
      id: 1,
      level: 'LV1',
      progress: 0,
      total: 10,
      cardActivation: '20',
      transaction: '0.05',
      tier2: '10',
      gradient: colors.gradients.pink,
      isExclusive: false,
    },
    {
      id: 2,
      level: 'LV2',
      progress: 0,
      total: 30,
      cardActivation: '25',
      transaction: '0.1',
      tier2: '10',
      gradient: colors.gradients.green,
      isExclusive: false,
    },
    {
      id: 3,
      level: 'LV3',
      progress: 0,
      total: 30,
      cardActivation: '30',
      transaction: '0.2',
      tier2: '10',
      gradient: colors.gradients.accent,
      isExclusive: false,
    },
    {
      id: 4,
      level: 'Exclusive',
      progress: 0,
      total: 0,
      cardActivation: '30',
      transaction: '0.2',
      tier2: '10',
      gradient: ['#424242', '#616161'],
      isExclusive: true,
    },
  ];

  const copyToClipboard = (text, type) => {
    Clipboard.setString(text);
    Alert.alert('Copied!', `${type} copied to clipboard`);
  };

  const renderGiftBoxes = () => {
    const boxes = [1, 2, 3];
    return (
      <View style={styles.giftContainer}>
        {boxes.map((box, index) => (
          <View
            key={box}
            style={[
              styles.giftBox,
              {
                transform: [
                  { rotate: `${(index - 1) * 15}deg` },
                  { scale: index === 1 ? 1.2 : 0.9 }
                ],
                zIndex: index === 1 ? 3 : 1,
              },
            ]}
          >
            <LinearGradient
              colors={index === 1 ? colors.gradients.red : colors.gradients.accent}
              style={styles.giftBoxGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.giftRibbon} />
            </LinearGradient>
          </View>
        ))}
      </View>
    );
  };

  const renderLevelCard = ({ item, index }) => {
    const isActive = index === currentLevelIndex;
    
    return (
      <View style={[styles.levelCardContainer, { width: width - spacing.lg * 2 }]}>
        <Card 
          gradient={item.gradient} 
          style={[
            styles.levelSliderCard,
            isActive && styles.activeLevelCard
          ]}
          shadow={isActive ? 'medium' : 'light'}
        >
          {item.isExclusive ? (
            <View style={styles.exclusiveContent}>
              <View style={styles.exclusiveHeader}>
                <Text style={styles.exclusiveTitle}>{item.level}</Text>
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>Join now</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.exclusiveStats}>
                <View style={styles.exclusiveStat}>
                  <Text style={styles.exclusiveStatLabel}>Card activation</Text>
                  <Text style={styles.exclusiveStatValue}>{item.cardActivation}%</Text>
                </View>
                <View style={styles.exclusiveStat}>
                  <Text style={styles.exclusiveStatLabel}>Transaction</Text>
                  <Text style={styles.exclusiveStatValue}>{item.transaction}%</Text>
                </View>
                <View style={styles.exclusiveStat}>
                  <Text style={styles.exclusiveStatLabel}>Tier 2</Text>
                  <Text style={styles.exclusiveStatValue}>{item.tier2}%</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.levelCardContent}>
              <View style={styles.levelCardHeader}>
                <View style={styles.levelBadge}>
                  <Icon name="diamond" size={20} color={colors.text.white} />
                  <Text style={styles.levelText}>{item.level}</Text>
                </View>
                <Text style={styles.currentLevelText}>Current Level</Text>
                <Text style={styles.progressText}>{item.progress}/{item.total}</Text>
              </View>
              
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: item.total > 0 ? `${(item.progress/item.total) * 100}%` : '0%' }
                  ]} 
                />
              </View>
              
              <View style={styles.levelStats}>
                <View style={styles.levelStat}>
                  <Text style={styles.levelStatLabel}>Card activation</Text>
                  <Text style={styles.levelStatValue}>{item.cardActivation}%</Text>
                </View>
                <View style={styles.levelStat}>
                  <Text style={styles.levelStatLabel}>Transaction</Text>
                  <Text style={styles.levelStatValue}>{item.transaction}%</Text>
                </View>
                <View style={styles.levelStat}>
                  <Text style={styles.levelStatLabel}>Tier 2</Text>
                  <Text style={styles.levelStatValue}>{item.tier2}%</Text>
                </View>
              </View>
            </View>
          )}
        </Card>
      </View>
    );
  };

  const renderLevelSlider = () => (
    <View style={styles.levelSliderContainer}>
      <FlatList
        ref={flatListRef}
        data={levelData}
        renderItem={renderLevelCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={width - spacing.md}
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / (width - spacing.lg * 2)
          );
          setCurrentLevelIndex(index);
        }}
        contentContainerStyle={styles.levelSliderContent}
        ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
      />
      
      {/* Progress Dots */}
      <View style={styles.progressDots}>
        {levelData.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.progressDot,
              currentLevelIndex === index && styles.activeDot
            ]}
            onPress={() => {
              flatListRef.current?.scrollToIndex({ index, animated: true });
              setCurrentLevelIndex(index);
            }}
          />
        ))}
      </View>
    </View>
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']}
        style={styles.headerBackground}
      >
        <CustomHeader
          title="Invite Friends"
          onBackPress={() => navigation.goBack()}
          rightIcon="help-outline"
          onRightPress={() => Alert.alert('Help', 'Referral program information')}
        />
        
        <View style={styles.headerContent}>
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>
              Refer & Earn Up{'\n'}to{' '}
              <Text style={styles.highlightText}>40%</Text>{'\n'}
              Commission
            </Text>
            <Text style={styles.subtitle}>
              The more you invite, the more{'\n'}reward you will receive.
            </Text>
            
            <GradientButton
              title="Referral Rules"
              onPress={() => Alert.alert('Rules', 'Referral program rules')}
              gradient={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.rulesButton}
              textStyle={styles.rulesButtonText}
            />
          </View>
          
          {renderGiftBoxes()}
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Level Slider */}
        {renderLevelSlider()}

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <StatsCard
            title="Ready to claim (USDT)"
            value="0.00"
            color={colors.success}
            icon="account-balance-wallet"
          />
          
          <View style={styles.claimButtonContainer}>
            <GradientButton
              title="Claim"
              onPress={() => Alert.alert('Claim', 'No rewards to claim')}
              gradient={colors.gradients.dark}
              style={styles.claimButton}
              icon="file-download"
            />
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatsCard
            title="Invited friends"
            value="0"
            color={colors.primary}
            icon="group"
          />
          <StatsCard
            title="Processing (USDT)"
            value="0.00"
            color={colors.warning}
            icon="hourglass-empty"
          />
          <StatsCard
            title="Settled (USDT)"
            value="0.00"
            color={colors.success}
            icon="check-circle"
          />
        </View>

        {/* Invitation Methods */}
        <Card style={styles.invitationCard} shadow="medium">
          <Text style={styles.sectionTitle}>Invitation Method</Text>
          
          <View style={styles.invitationMethod}>
            <View style={styles.methodHeader}>
              <Text style={styles.methodLabel}>Referral Code</Text>
              <GradientButton
                title=""
                onPress={() => copyToClipboard(referralCode, 'Referral Code')}
                gradient={colors.gradients.accent}
                style={styles.copyButton}
                icon="content-copy"
              />
            </View>
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{referralCode}</Text>
            </View>
          </View>

          <View style={styles.invitationMethod}>
            <View style={styles.methodHeader}>
              <Text style={styles.methodLabel}>Referral Link</Text>
              <GradientButton
                title=""
                onPress={() => copyToClipboard(referralLink, 'Referral Link')}
                gradient={colors.gradients.accent}
                style={styles.copyButton}
                icon="content-copy"
              />
            </View>
            <View style={styles.codeContainer}>
              <Text style={styles.linkText} numberOfLines={1}>
                {referralLink}
              </Text>
            </View>
          </View>
        </Card>

        {/* Invite Now Button */}
        <GradientButton
          title="Invite Now"
          onPress={() => Alert.alert('Invite', 'Share referral with friends')}
          gradient={colors.gradients.primary}
          style={styles.inviteButton}
          icon="share"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerBackground: {
    paddingBottom: spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    alignItems: 'flex-end',
  },
  titleSection: {
    flex: 1,
  },
  mainTitle: {
    ...typography.h1,
    color: colors.text.white,
    lineHeight: 40,
    marginBottom: spacing.md,
  },
  highlightText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  subtitle: {
    ...typography.body1,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  rulesButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  rulesButtonText: {
    ...typography.body2,
  },
  giftContainer: {
    position: 'relative',
    width: width * 0.4,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftBox: {
    position: 'absolute',
    width: 60,
    height: 60,
  },
  giftBoxGradient: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  giftRibbon: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: 'rgba(255,215,0,0.8)',
    marginTop: -4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  claimButtonContainer: {
    flex: 1,
    marginLeft: spacing.sm,
    marginBottom: spacing.sm,
  },
  claimButton: {
    paddingVertical: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    marginVertical: spacing.sm,
  },
  invitationCard: {
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  invitationMethod: {
    marginBottom: spacing.lg,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  methodLabel: {
    ...typography.body1,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    padding: 0,
  },
  codeContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.text.disabled,
  },
  codeText: {
    ...typography.h3,
    color: colors.text.primary,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  linkText: {
    ...typography.body1,
    color: colors.text.primary,
  },
  inviteButton: {
    marginVertical: spacing.xl,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },

  // Level Slider Styles
  levelSliderContainer: {
    marginVertical: spacing.md,
  },
  levelSliderContent: {
    paddingHorizontal: spacing.lg,
  },
  levelCardContainer: {
    alignItems: 'center',
  },
  levelSliderCard: {
    marginVertical: spacing.md,
    width: '100%',
    transform: [{ scale: 0.95 }],
  },
  activeLevelCard: {
    transform: [{ scale: 1 }],
  },
  levelCardContent: {
    // Same as existing level card styles
  },
  levelCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  // Exclusive Card Styles
  exclusiveContent: {
    paddingVertical: spacing.lg,
  },
  exclusiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  exclusiveTitle: {
    ...typography.h2,
    color: colors.text.white,
    fontWeight: 'bold',
  },
  joinButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  joinButtonText: {
    ...typography.body2,
    color: colors.text.white,
    fontWeight: '600',
  },
  exclusiveStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exclusiveStat: {
    alignItems: 'center',
  },
  exclusiveStatLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.xs,
  },
  exclusiveStatValue: {
    ...typography.h4,
    color: colors.text.white,
  },
  
  // Progress Dots
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.disabled,
    marginHorizontal: spacing.xs,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.text.primary,
  },
});

export default InviteFriendsScreen;