import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  CustomHeader,
  Card,
  EmptyState,
  GradientButton,
} from '../components/ui';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

const { width } = Dimensions.get('window');

const MyRewardsScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const rewardsData = {
    totalCommission: '0.00',
    withdrawable: '0.00',
    processing: '0.00',
    settled: '0.00',
    transactions: [] // Empty for now
  };

  const renderCommissionSummary = () => (
    <Card style={styles.summaryCard} shadow="medium">
      <Text style={styles.summaryTitle}>Total Commission (USDT)</Text>
      <Text style={styles.totalAmount}>{rewardsData.totalCommission}</Text>
      
      <View style={styles.summaryStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Withdrawable</Text>
          <Text style={styles.statValue}>{rewardsData.withdrawable}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Processing</Text>
          <View style={styles.processingContainer}>
            <Text style={styles.statValue}>{rewardsData.processing}</Text>
            <Icon name="info-outline" size={16} color={colors.text.disabled} />
          </View>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Settled</Text>
          <Text style={styles.statValue}>{rewardsData.settled}</Text>
        </View>
      </View>
    </Card>
  );

  const renderFilterHeader = () => (
    <View style={styles.filterHeader}>
      <Text style={styles.sectionTitle}>My Rewards</Text>
      <TouchableOpacity style={styles.dateFilter}>
        <Text style={styles.dateFilterText}>Date</Text>
        <Icon name="keyboard-arrow-down" size={20} color={colors.text.secondary} />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyRewards = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIllustration}>
        {/* Custom folder illustration */}
        <View style={styles.folderContainer}>
          <LinearGradient
            colors={['#F5F5F5', '#E0E0E0']}
            style={styles.folder}
          >
            <View style={styles.folderTab} />
          </LinearGradient>
          
          {/* Flying paper plane */}
          <View style={styles.planeContainer}>
            <LinearGradient
              colors={colors.gradients.primary}
              style={styles.paperPlane}
            />
            <View style={styles.planeTrail} />
          </View>
        </View>
      </View>
      
      <Text style={styles.emptyTitle}>Not found</Text>
      <Text style={styles.emptySubtitle}>
        Your reward history will appear here once you start earning commissions from referrals.
      </Text>
    </View>
  );

  const renderTransactionItem = (transaction, index) => (
    <Card key={index} style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.transactionIcon}>
          <Icon 
            name={transaction.type === 'commission' ? 'trending-up' : 'account-balance-wallet'} 
            size={20} 
            color={colors.success} 
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>{transaction.title}</Text>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
          <Text style={styles.transactionDescription}>{transaction.description}</Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text style={[styles.amountText, { color: transaction.amount.startsWith('+') ? colors.success : colors.error }]}>
            {transaction.amount} USDT
          </Text>
          <Text style={styles.transactionStatus}>{transaction.status}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradients.primary}
        style={styles.header}
      >
        <CustomHeader
          title="My Rewards"
          onBackPress={() => navigation.goBack()}
          rightIcon="person-outline"
          onRightPress={() => navigation.navigate('Profile')}
        />
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {renderCommissionSummary()}
        {renderFilterHeader()}
        
        {rewardsData.transactions.length === 0 ? (
          renderEmptyRewards()
        ) : (
          <View style={styles.transactionsList}>
            {rewardsData.transactions.map((transaction, index) => 
              renderTransactionItem(transaction, index)
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingBottom: spacing.md,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },

  // Summary Card
  summaryCard: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
  },
  summaryTitle: {
    ...typography.body1,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  totalAmount: {
    ...typography.h1,
    fontSize: 48,
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: spacing.xl,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: '600',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Filter Header
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  dateFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.text.disabled,
    backgroundColor: colors.background,
  },
  dateFilterText: {
    ...typography.body2,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.xl,
  },
  emptyIllustration: {
    marginBottom: spacing.xl,
  },
  folderContainer: {
    position: 'relative',
    width: 120,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folder: {
    width: 100,
    height: 80,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadows.light,
  },
  folderTab: {
    position: 'absolute',
    top: -8,
    left: 20,
    width: 30,
    height: 16,
    backgroundColor: '#BDBDBD',
    borderTopLeftRadius: borderRadius.sm,
    borderTopRightRadius: borderRadius.sm,
  },
  planeContainer: {
    position: 'absolute',
    top: -20,
    right: -10,
  },
  paperPlane: {
    width: 24,
    height: 24,
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },
  planeTrail: {
    position: 'absolute',
    top: 12,
    left: -15,
    width: 20,
    height: 2,
    backgroundColor: colors.text.disabled,
    opacity: 0.5,
    borderRadius: 1,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.8,
  },

  // Transaction Items
  transactionsList: {
    flex: 1,
  },
  transactionCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  transactionDate: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  transactionDescription: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    ...typography.body1,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  transactionStatus: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});

export default MyRewardsScreen;