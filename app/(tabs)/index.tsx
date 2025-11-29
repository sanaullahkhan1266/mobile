import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';
import { Logo } from '../../components/Logo';
import MoreActionsModal from '../../components/MoreActionsModal';
import ProfileButton from '../../components/ProfileButton';
import SelectSendMethodModal from '../../components/SelectSendMethodModal';
import { useBalance, useTransactionHistory } from '../../hooks/useApi';
import { getBalance } from '../../services/paymentService';
import { getTransactionHistory } from '../../services/transactionService';

const { width, height } = Dimensions.get('window');

const DashboardHome = () => {
  const router = useRouter();

  // Backend data hooks
  const { balance, loading: balanceLoading, refresh: refreshBalance } = useBalance();
  const { transactions, loading: txLoading, fetchHistory } = useTransactionHistory();

  // Force real white UI regardless of system theme
  const C = {
    bg: '#FFFFFF',
    text: '#1F2937',
    muted: '#6B7280',
    card: '#FFFFFF',
    cardAlt: '#FFFFFF',
    border: '#E5E7EB',
    accent: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
  } as const;

  const learnItems = [
    { badge: 'Learn', title: 'Refer Friends Get Rewards', subtitle: '3 min read' },
    { badge: 'New', title: 'Add EUR/GBP: Chance to Win', subtitle: 'Try Multi-Currency Wallet' },
    { badge: 'Guide', title: 'Verify Your Identity', subtitle: 'Increase account limits' },
  ];
  const [learnIndex, setLearnIndex] = useState(0);
  const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
  const [selectSendModalVisible, setSelectSendModalVisible] = useState(false);
  const [totalBalance, setTotalBalance] = useState('5.00');
  const [refreshing, setRefreshing] = useState(false);
  const horizontalPadding = Math.round(width * 0.06); // same side padding as other sections
  const learnCardWidth = width - 2 * horizontalPadding; // exact same inner width as other cards
  const learnGap = 16;

  const s = getStyles(C);

  // Calculate total balance from all currencies
  useEffect(() => {
    if (balance && !balanceLoading) {
      let total = 0;
      Object.keys(balance).forEach(currency => {
        const bal = parseFloat(balance[currency].balance || '0');
        // For simplicity, assuming 1:1 USD conversion
        // In production, you'd multiply by current price
        total += bal;
      });
      setTotalBalance(total.toFixed(2));
    }
  }, [balance, balanceLoading]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refreshBalance(),
      fetchHistory({ limit: 10 })
    ]);
    setRefreshing(false);
  };

  const onLearnScroll = (e: any) => {
    const x = e?.nativeEvent?.contentOffset?.x || 0;
    const idx = Math.round(x / (learnCardWidth + learnGap));
    if (idx !== learnIndex) setLearnIndex(Math.max(0, Math.min(idx, learnItems.length - 1)));
  };

  const handleSendModalClose = () => {
    setSelectSendModalVisible(false);
  };

  const handleFiatPayout = () => {
    handleSendModalClose();
    router.push('/fiat-payout');
  };

  const handleCardtickTransfer = () => {
    handleSendModalClose();
    router.push('/receive');
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={C.bg} />

      {/* Header */}
      <View style={s.header}>
        <ProfileButton size={36} />
        <Logo size={64} />
        <View style={s.headerActions}>
          <TouchableOpacity onPress={() => router.push('/share')} style={s.iconBtn}>
            <Ionicons name="person-add-outline" size={20} color={C.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={s.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color={C.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/scan')} style={s.iconBtn}>
            <Ionicons name="qr-code-outline" size={20} color={C.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 28 }} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Verify banner */}
        <View style={[s.verifyBanner, { backgroundColor: C.cardAlt, borderColor: C.border }]}>
          <View style={s.verifyLeft}>
            <Ionicons name="shield-checkmark" size={20} color={C.warning} />
            <Text style={[s.verifyText, { color: C.text }]}>Verify your identity</Text>
            <Text style={[s.verifySub, { color: C.muted }]}>Unverified</Text>
          </View>
          <TouchableOpacity style={[s.verifyBtn, { backgroundColor: C.text }]} activeOpacity={0.85} onPress={() => router.push('/kyc')}>
            <Text style={s.verifyBtnText}>Verify</Text>
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={[s.balanceCard, { backgroundColor: C.card, borderColor: C.border }]}>
          <View style={s.balanceHeader}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[s.balanceLabel, { color: C.muted }]}>Est. Total Value (USD)</Text>
                <TouchableOpacity style={[s.eyeButton, { marginLeft: 8, backgroundColor: 'transparent' }]} activeOpacity={0.7}>
                  <Ionicons name="eye-outline" size={18} color={C.muted} />
                </TouchableOpacity>
              </View>
              <View style={s.balanceRow}>
                {balanceLoading ? (
                  <ActivityIndicator size="small" color={C.text} style={{ marginVertical: 8 }} />
                ) : (
                  <>
                    <Text style={[s.balanceValue, { color: C.text }]}>{totalBalance}</Text>
                    <Ionicons style={{ marginLeft: 6, marginTop: 6 }} name="chevron-forward" size={18} color={C.muted} />
                  </>
                )}
              </View>
            </View>
          </View>

          <View style={s.actionInlineRow}>
            {[
              { title: 'Deposit', icon: 'add', color: '#141414', onPress: () => router.push('/receive') },
              { title: 'Send', icon: 'arrow-forward', color: '#141414', onPress: () => setSelectSendModalVisible(true) },
              { title: 'Earn', icon: 'cash-outline', color: '#141414', onPress: () => router.push('/learn') },
              { title: 'More', icon: 'ellipsis-horizontal', color: '#141414', onPress: () => setIsMoreModalVisible(true) },
            ].map((a) => (
              <TouchableOpacity key={a.title} style={s.actionInline} activeOpacity={0.85} onPress={a.onPress}>
                <View style={[s.actionInlineIcon, { backgroundColor: C.cardAlt, borderColor: C.border }]}>
                  <Ionicons name={a.icon as any} size={26} color={a.color} />
                </View>
                <Text style={[s.actionInlineTitle, { color: C.text }]}>{a.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>


        {/* Currency Cards */}
        <View style={s.cardsRow}>
          {[
            { currency: 'EUR', flag: '🇪🇺', name: 'EUR' },
            { currency: 'GBP', flag: '🇬🇧', name: 'GBP' }
          ].map((item) => (
            <TouchableOpacity key={item.currency} style={[s.currencyCard, { backgroundColor: C.card, borderColor: C.border }]} activeOpacity={0.85}>
              <View style={s.currencyHeader}>
                <Text style={s.currencyFlag}>{item.flag}</Text>
                <Text style={[s.currencyTitle, { color: C.text }]}>{item.currency}</Text>
              </View>
              <View style={s.getAccountRow}>
                <Text style={[s.getAccountTextLeft, { color: C.muted }]}>Get an Account</Text>
                <Ionicons name="chevron-forward" size={16} color={C.muted} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Customize banner */}
        <View style={[s.customizeBox, { backgroundColor: C.cardAlt, borderColor: C.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="card-outline" size={18} color={C.text} />
            <Text style={[s.customizeTitle, { color: C.text }]}>Customize your Home screen</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="close" size={18} color={C.muted} />
          </TouchableOpacity>
        </View>

        {/* Transactions */}
        <View style={s.sectionBox}>
          <View style={s.sectionHeader}>
            <Text style={[s.sectionTitle, { color: C.text }]}>Transactions</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/records')}>
              <Ionicons name="ellipsis-horizontal" size={20} color={C.muted} />
            </TouchableOpacity>
          </View>

          {txLoading ? (
            <ActivityIndicator size="small" style={{ marginVertical: 16 }} />
          ) : transactions && transactions.length > 0 ? (
            transactions.slice(0, 5).map((tx) => (
              <View key={tx.id} style={[s.txnItem, { backgroundColor: C.card, borderColor: C.border, marginBottom: 12 }]}>
                <View style={[s.txnIcon, { backgroundColor: tx.type === 'receive' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
                  <Ionicons 
                    name={tx.type === 'receive' ? 'arrow-down' : 'arrow-up'} 
                    size={20} 
                    color={tx.type === 'receive' ? C.success : '#EF4444'} 
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.txnTitle, { color: C.text }]}>{tx.type === 'receive' ? 'Received' : 'Sent'}</Text>
                  <Text style={[s.txnSub, { color: C.muted }]}>{new Date(tx.timestamp).toLocaleString()}</Text>
                </View>
                <View style={s.txnAmountContainer}>
                  <Text style={[s.txnAmount, { color: tx.type === 'receive' ? C.success : '#EF4444' }]}>
                    {tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.currency}
                  </Text>
                  <Text style={[s.txnCurrency, { color: C.muted }]}>{tx.status}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={[s.txnItem, { backgroundColor: C.card, borderColor: C.border }]}>
              <View style={[s.txnIcon, { backgroundColor: 'rgba(107, 114, 128, 0.1)' }]}>
                <Ionicons name="time-outline" size={20} color={C.muted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.txnTitle, { color: C.text }]}>No transactions yet</Text>
                <Text style={[s.txnSub, { color: C.muted }]}>Make your first deposit to see transactions</Text>
              </View>
            </View>
          )}
        </View>

        {/* Learn */}
        <View style={[s.sectionBox, s.noSideMargin]}>
          <View style={[s.sectionHeader, { paddingHorizontal: horizontalPadding }]}>
            <Text style={[s.sectionTitle, { color: C.text }]}>Learn</Text>
            <Text style={[s.learnPager, { color: C.muted }]}>{learnIndex + 1}/{learnItems.length}</Text>
          </View>
          <ScrollView
            horizontal
            pagingEnabled
            decelerationRate="fast"
            onScroll={onLearnScroll}
            scrollEventThrottle={16}
            snapToInterval={learnCardWidth + learnGap}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: horizontalPadding, columnGap: learnGap }}
          >
            {learnItems.map((it, i) => (
              <View key={i} style={[s.learnSlide, { width: learnCardWidth, backgroundColor: C.card, borderColor: C.border }]}>
                <View style={s.learnSlideLeft}>
                  <View style={s.learnBadge}><Text style={s.learnBadgeText}>{it.badge}</Text></View>
                  <Text numberOfLines={2} style={[s.learnTitle, { color: C.text }]}>{it.title}</Text>
                  <Text style={[s.learnMeta, { color: C.muted }]}>{it.subtitle}</Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={[s.promoLink, { color: C.accent, marginTop: 10 }]}>Learn more →</Text>
                  </TouchableOpacity>
                </View>
                <View style={[s.learnIcon, { borderColor: C.border }]}>
                  <Ionicons name="book-outline" size={20} color={C.text} />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Analytics */}
        <View style={s.sectionBox}>
          <Text style={[s.sectionTitle, { color: C.text }]}>Analytics</Text>
          <View style={{ height: 8 }} />
          <View style={[s.analyticsBox, { backgroundColor: C.card, borderColor: C.border }]}>
            <View style={s.analyticsLeft}>
              <View style={[s.analyticsIcon, { borderColor: C.border }]}>
                <Ionicons name="analytics-outline" size={18} color={C.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.analyticsTitle, { color: C.text }]}>No transactions yet</Text>
                <Text style={[s.analyticsSub, { color: C.muted }]}>Make your first deposit to see insights here.</Text>
                <TouchableOpacity activeOpacity={0.8} style={[s.analyticsCta, { borderColor: C.border }]}>
                  <Text style={[s.analyticsCtaText, { color: C.accent }]}>Make a deposit</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={s.analyticsBars}>
              <View style={[s.bar, { height: 8, backgroundColor: '#E5E7EB' }]} />
              <View style={[s.bar, { height: 22, backgroundColor: '#E5E7EB' }]} />
              <View style={[s.bar, { height: 12, backgroundColor: '#E5E7EB' }]} />
              <View style={[s.bar, { height: 28, backgroundColor: '#E5E7EB' }]} />
              <View style={[s.bar, { height: 10, backgroundColor: '#E5E7EB' }]} />
            </View>
          </View>
        </View>

        {/* Promo */}
        <View style={s.sectionBox}>
          <View style={[s.promoCard, { backgroundColor: C.card, borderColor: C.border }]}>
            <View style={s.promoLeft}>
              <View style={[s.promoIcon, { backgroundColor: '#FFF' }]}>
                <Text style={{ fontSize: 18 }}>🇬🇧</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={[s.promoTitle, { color: C.text }]}>Add EUR/GBP: Chance to Win Ca...</Text>
              <Text style={[s.promoSub, { color: C.muted }]}>Try the Multi-Currency Wallet</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={[s.promoLink, { color: C.accent }]}>Learn more →</Text>
              </TouchableOpacity>
            </View>
            <Text style={[s.promoPager, { color: C.muted }]}>2/3</Text>
          </View>
        </View>
      </ScrollView>

      {/* More Actions Modal */}
      <MoreActionsModal
        visible={isMoreModalVisible}
        onClose={() => setIsMoreModalVisible(false)}
      />

      {/* Send Method Selection Modal */}
      <SelectSendMethodModal
        visible={selectSendModalVisible}
        onClose={handleSendModalClose}
        onSelectFiatPayout={handleFiatPayout}
        onSelectRedotPayTransfer={handleCardtickTransfer}
      />
    </SafeAreaView>
  );
};

const getStyles = (C: { bg: string; text: string; muted: string; card: string; cardAlt: string; border: string; accent: string; success: string; warning: string }) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: width * 0.06,
      paddingTop: height * 0.015,
      paddingBottom: height * 0.012
    },
    avatarCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    avatarText: { fontWeight: '700', fontSize: 14 },
    brandText: { fontSize: 18, fontWeight: '800' },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    iconBtn: { marginLeft: 10 },

    verifyBanner: { marginHorizontal: width * 0.06, borderRadius: 14, borderWidth: 1, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    verifyLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    verifyText: { marginLeft: 10, fontWeight: '700', fontSize: 15 },
    verifySub: { marginLeft: 10, fontSize: 13 },
    verifyBtn: { borderRadius: 22, paddingHorizontal: 16, paddingVertical: 9 },
    verifyBtnText: { color: '#FFFFFF', fontWeight: '700' },

    // Enhanced Balance Card
    balanceCard: { marginHorizontal: width * 0.06, marginTop: 18, borderRadius: 22, borderWidth: 1, padding: 22 },
    balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    balanceLabel: { fontSize: 15, fontWeight: '500', marginBottom: 10 },
    balanceRow: { flexDirection: 'row', alignItems: 'baseline' },
    balanceSymbol: { fontSize: 30, fontWeight: '300', marginRight: 4, marginTop: 4 },
    balanceValue: { fontSize: 52, fontWeight: '800', letterSpacing: -1 },
    usdBadge: { marginLeft: 12, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, marginTop: 8 },
    usdText: { fontSize: 13, fontWeight: '700' },
    eyeButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    balanceFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    changeIndicator: { flexDirection: 'row', alignItems: 'center' },
    changeText: { fontSize: 13, fontWeight: '600', marginLeft: 4 },
    updateTime: { fontSize: 12 },

    // Inline actions inside balance card (Cardtick style)
    actionInlineRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14, paddingHorizontal: 16, gap: 22 },
    actionInline: { alignItems: 'center', flex: 1, paddingVertical: 8 },
    actionInlineIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    actionInlineTitle: { fontSize: 14, marginTop: 8, fontWeight: '600' },

    // Enhanced Actions (standalone row)
    actionsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: width * 0.06, marginTop: 20 },
    actionCard: { alignItems: 'center', width: (width * 0.88) / 4 },
    actionIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 1 },
    actionTitle: { fontWeight: '600', fontSize: 12 },

    // Enhanced Currency Cards
    cardsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: width * 0.06, marginTop: 20 },
    currencyCard: { width: (width * 0.88) / 2 - 8, borderWidth: 1, borderRadius: 18, padding: 18 },
    currencyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    currencyFlag: { fontSize: 22, marginRight: 10 },
    currencyTitle: { fontWeight: '800', fontSize: 18 },
    getAccountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    getAccountTextLeft: { fontSize: 15, fontWeight: '500' },

    // Customize banner
    customizeBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, marginHorizontal: width * 0.06, borderRadius: 12, borderWidth: 1, paddingVertical: 14, paddingHorizontal: 14 },
    customizeTitle: { marginLeft: 10, fontSize: 15, fontWeight: '600' },

    // Enhanced Transactions
    sectionBox: { marginTop: 24, marginHorizontal: width * 0.06 },
    noSideMargin: { marginHorizontal: 0 },
    learnHeader: { paddingHorizontal: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontWeight: '800', fontSize: 20 },
    viewAllText: { fontSize: 15, fontWeight: '600' },
    txnItem: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 18, padding: 18 },
    txnIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    txnTitle: { fontWeight: '700', fontSize: 16, marginBottom: 4 },
    txnSubRow: { flexDirection: 'row', alignItems: 'center' },
    txnSub: { fontSize: 13 },
    statusBadge: { marginLeft: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    statusText: { fontSize: 11, fontWeight: '600' },
    txnAmountContainer: { alignItems: 'flex-end' },
    txnAmount: { fontWeight: '800', fontSize: 18, marginBottom: 2 },
    txnCurrency: { fontSize: 12 },

    // Learn section (carousel)
    learnPager: { fontSize: 12, fontWeight: '600' },
    learnSlide: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 18, padding: 18 },
    learnSlideLeft: { flex: 1, paddingRight: 12 },
    learnBadge: { alignSelf: 'flex-start', backgroundColor: '#F9FAFB', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4, marginBottom: 6 },
    learnBadgeText: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
    learnTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
    learnMeta: { fontSize: 13 },
    learnIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderWidth: 1 },

    // Analytics
    analyticsBox: { borderWidth: 1, borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    analyticsLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, marginRight: 12 },
    analyticsIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, marginRight: 10 },
    analyticsTitle: { fontSize: 16, fontWeight: '700' },
    analyticsSub: { fontSize: 12, marginTop: 2 },
    analyticsCta: { alignSelf: 'flex-start', marginTop: 8, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#FFFFFF', borderWidth: 1 },
    analyticsCtaText: { fontSize: 12, fontWeight: '700' },
    analyticsBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 48 },
    bar: { width: 8, borderRadius: 4 },

    // Promo card
    promoCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 18, padding: 18 },
    promoLeft: { marginRight: 14 },
    promoIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    promoTitle: { fontSize: 17, fontWeight: '700' },
    promoSub: { fontSize: 13, marginTop: 2 },
    promoLink: { marginTop: 8, fontWeight: '700' },
    promoPager: { marginLeft: 8, fontWeight: '600' },
  });

export default DashboardHome;
