# Backend Integration Guide

## Overview
This document outlines all the changes needed to integrate backend APIs into components currently using hardcoded data.

---

## ✅ Integration Status

### **ALREADY INTEGRATED** ✅
- Authentication (Login, Signup, Logout, Password Reset)
- 2FA (Enable, Disable, Verify)
- All Service Files (authService, paymentService, cardService, transactionService, profileService)
- Custom Hooks in `/hooks/useApi.ts`

### **NEEDS INTEGRATION** ❌
1. Dashboard Home Balance Display
2. Dashboard Transactions
3. Card Screen
4. Profile Screen (Backend Sync)
5. Settings Screen (Backend Sync)

---

## 1️⃣ Dashboard Home (`app/(tabs)/index.tsx`)

### **Current Status**: Hardcoded balance (5.00) and transactions

### **Required Changes**:

#### Step 1: Add imports at the top of the file
```typescript
// Add ActivityIndicator to imports
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';

// Add hook imports after component imports
import { useBalance, useRecentTransactions } from '../../hooks/useApi';
```

#### Step 2: Add hooks after component state declarations
```typescript
const DashboardHome = () => {
  const router = useRouter();
  const { user } = useUser();

  // ADD THESE LINES:
  const { balance, loading: balanceLoading, refresh: refreshBalance } = useBalance();
  const { transactions: recentTxs, loading: txLoading, refresh: refreshTxs } = useRecentTransactions(5);

  // Calculate total balance
  const calculateTotalBalance = () => {
    if (!balance) return '0.00';
    try {
      if (typeof balance === 'object') {
        const total = Object.values(balance).reduce((sum: number, item: any) => {
          return sum + (parseFloat(item?.balance || 0) * parseFloat(item?.usdPrice || 0));
        }, 0);
        return total.toFixed(2);
      }
      return '0.00';
    } catch {
      return '0.00';
    }
  };
```

#### Step 3: Replace hardcoded balance (around line 109)
**FIND:**
```typescript
<Text style={[s.balanceValue, { color: C.text }]}>5.00</Text>
```

**REPLACE WITH:**
```typescript
{balanceLoading ? (
  <ActivityIndicator size="small" color={C.text} />
) : (
  <Text style={[s.balanceValue, { color: C.text }]}>{calculateTotalBalance()}</Text>
)}
```

#### Step 4: Replace hardcoded transaction (around line 172-184)
**FIND:**
```typescript
<View style={[s.txnItem, { backgroundColor: C.card, borderColor: C.border }]}>
  <View style={[s.txnIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }] }>
    <Ionicons name="gift" size={20} color={C.success} />
  </View>
  <View style={{ flex: 1 }}>
    <Text style={[s.txnTitle, { color: C.text }]}>Reward</Text>
    <Text style={[s.txnSub, { color: C.muted }]}>2025-10-02 22:47:56</Text>
  </View>
  <View style={s.txnAmountContainer}>
    <Text style={[s.txnAmount, { color: C.success }]}>+5.00 USD</Text>
    <Text style={[s.txnCurrency, { color: C.muted }]}>Received</Text>
  </View>
</View>
```

**REPLACE WITH:**
```typescript
{txLoading ? (
  <View style={[s.txnItem, { backgroundColor: C.card, borderColor: C.border }]}>
    <ActivityIndicator size="small" color={C.text} />
    <Text style={[s.txnTitle, { color: C.text, marginLeft: 10 }]}>Loading transactions...</Text>
  </View>
) : recentTxs && recentTxs.length > 0 ? (
  recentTxs.slice(0, 1).map((tx: any, index: number) => (
    <View key={index} style={[s.txnItem, { backgroundColor: C.card, borderColor: C.border }]}>
      <View style={[s.txnIcon, { backgroundColor: tx.type === 'receive' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
        <Ionicons name={tx.type === 'receive' ? 'arrow-down' : 'arrow-up'} size={20} color={tx.type === 'receive' ? C.success : '#EF4444'} />
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
    <View style={[s.txnIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
      <Ionicons name="gift" size={20} color={C.success} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={[s.txnTitle, { color: C.text }]}>Welcome Reward</Text>
      <Text style={[s.txnSub, { color: C.muted }]}>No transactions yet</Text>
    </View>
    <View style={s.txnAmountContainer}>
      <Text style={[s.txnAmount, { color: C.success }]}>+5.00 USD</Text>
      <Text style={[s.txnCurrency, { color: C.muted }]}>Received</Text>
    </View>
  </View>
)}
```

---

## 2️⃣ Card Screen (`app/(tabs)/card.tsx`)

### **Current Status**: Static UI with no backend data

### **Required Changes**:

#### Step 1: Add imports
```typescript
import { ActivityIndicator } from 'react-native';
import { useCards } from '../../hooks/useApi';
```

#### Step 2: Add hook after component declaration
```typescript
const CardScreen = () => {
  const router = useRouter();
  
  // ADD THIS:
  const { cards, loading, refresh, createCard } = useCards();
```

#### Step 3: Handle card creation
```typescript
const handleApplyCard = async () => {
  try {
    await createCard({
      currency: 'USD',
      cardType: 'virtual',
      fundingAmount: '10'
    });
    Alert.alert('Success', 'Virtual card created successfully!');
  } catch (error: any) {
    Alert.alert('Error', error?.message || 'Failed to create card');
  }
};
```

#### Step 4: Display actual cards instead of static UI
```typescript
{loading ? (
  <ActivityIndicator size="large" color="#DC2626" />
) : cards && cards.length > 0 ? (
  cards.map((card, index) => (
    <View key={index} style={s.cardContainer}>
      <View style={[s.cardImage, s.virtualCard]}>
        <Text style={s.cardBrand}>EnPaying</Text>
        <Text style={s.cardNumber}>**** **** **** {card.lastFour}</Text>
        <Text style={s.visa}>VISA</Text>
      </View>
    </View>
  ))
) : (
  // Show default card UI with "Apply Card" button
  <View style={s.cardContainer}>
    <View style={[s.cardImage, s.virtualCard]}>
      <Text style={s.cardBrand}>EnPaying</Text>
      <Text style={s.visa}>VISA</Text>
    </View>
  </View>
)}
```

---

## 3️⃣ Profile Screen (`app/profile.tsx`)

### **Current Status**: Uses Clerk only, doesn't sync with backend

### **Required Changes**:

#### Step 1: Add backend imports
```typescript
import { getUserProfile, updateUserProfile } from '../services/profileService';
import { useState, useEffect } from 'react';
```

#### Step 2: Add backend state
```typescript
const [backendProfile, setBackendProfile] = useState<any>(null);
const [syncing, setSyncing] = useState(false);
```

#### Step 3: Fetch backend profile on mount
```typescript
useEffect(() => {
  const loadBackendProfile = async () => {
    try {
      const profile = await getUserProfile();
      setBackendProfile(profile);
    } catch (error) {
      console.error('Failed to load backend profile:', error);
    }
  };
  
  if (user) {
    loadBackendProfile();
  }
}, [user]);
```

#### Step 4: Sync updates to both Clerk and Backend
```typescript
const onSave = async () => {
  if (!user) return;
  try {
    setSaving(true);
    setSyncing(true);
    
    // Update Clerk
    await user.update({ 
      firstName, 
      lastName, 
      username: username || undefined 
    });
    
    // Update Backend
    await updateUserProfile({
      name: `${firstName} ${lastName}`,
      phone: backendProfile?.phone,
    });
    
    Alert.alert('Profile updated', 'Your profile has been saved');
  } catch (e: any) {
    const msg = e?.errors?.[0]?.message || e?.message || 'Failed to update profile';
    Alert.alert('Update failed', msg);
  } finally {
    setSaving(false);
    setSyncing(false);
  }
};
```

---

## 4️⃣ Settings Screen (`app/settings.tsx`)

### **Current Status**: Saves to AsyncStorage only

### **Required Changes**:

#### Step 1: Add backend imports
```typescript
import { updateNotificationPreferences, getNotificationPreferences } from '../services/profileService';
```

#### Step 2: Sync settings with backend
```typescript
const onToggle = async (key: 'darkMode' | 'notifications', value: boolean) => {
  // Update local storage
  if (key === 'darkMode') setDarkMode(value); 
  else setNotifications(value);
  await AsyncStorage.setItem(`settings.${key}`, String(value));
  
  // Sync to backend
  try {
    if (key === 'notifications') {
      await updateNotificationPreferences({
        push: value,
        email: value,
      });
    }
  } catch (error) {
    console.error('Failed to sync settings to backend:', error);
  }
};
```

#### Step 3: Load settings from backend on mount
```typescript
useEffect(() => {
  const loadSettings = async () => {
    try {
      //Load from local storage first
      const dm = await AsyncStorage.getItem('settings.darkMode');
      const nt = await AsyncStorage.getItem('settings.notifications');
      setDarkMode(dm === 'true');
      setNotifications(nt !== 'false');
      
      // Load from backend and sync
      const backendPrefs = await getNotificationPreferences();
      if (backendPrefs) {
        setNotifications(backendPrefs.push || false);
        await AsyncStorage.setItem('settings.notifications', String(backendPrefs.push));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };
  
  loadSettings();
}, []);
```

---

## 🧪 Testing

After making these changes, test each feature:

1. **Dashboard**: 
   - Check if balance loads from backend
   - Verify transactions display correctly
   - Test refresh functionality

2. **Cards**:
   - Verify card list loads from backend
   - Test card creation
   - Check card details display

3. **Profile**:
   - Verify profile updates sync to both Clerk and backend
   - Test avatar upload

4. **Settings**:
   - Verify notification settings sync to backend
   - Test dark mode toggle

---

## 📋 Verification Checklist

- [ ] Dashboard balance shows real data
- [ ] Dashboard transactions show real data
- [ ] Card screen loads actual cards
- [ ] Card creation works
- [ ] Profile updates sync to backend
- [ ] Settings sync to backend
- [ ] All loading states work correctly
- [ ] Error handling displays properly

---

## 🚀 Next Steps

1. **Fix the file**: Manually apply changes to `app/(tabs)/index.tsx` using the guide above
2. **Test on device**: Run `npm start` and test on your device/emulator
3. **Check API endpoints**: Ensure your backend at `http://23.22.178.240` is running
4. **Monitor network**: Use React Native Debugger to see API calls
5. **Handle errors**: Add proper error boundaries and user feedback

---

## 📞 Support

If backend returns errors:
- Check your backend is running
- Verify JWT tokens are valid
- Check API endpoints match your backend
- Review network logs in React Native Debugger
