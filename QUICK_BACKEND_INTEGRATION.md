# Quick Backend Integration for receive.tsx

## ✅ Simple 3-Step Integration

### Step 1: Update line 11-17 (Add imports)

Replace line 17 with:
```typescript
import { getWalletAddresses, getRecipients, getBalance } from '@/services/paymentService';
import { sendToRecipient } from '@/services/transactionService';
```

And add `Alert` to the import on line 2-12:
```typescript
  Alert,
} from 'react-native';
```

### Step 2: Add state variables (after line 28)

Add these new states:
```typescript
  const [sendAmount, setSendAmount] = useState('');
  const [sendCurrency, setSendCurrency] = useState('USDT');
  const [balance, setBalance] = useState<any>(null);
  const [sendLoading, setSendLoading] = useState(false);
```

### Step 3: Update fetchData function (lines 38-52)

Add balance fetching at the end:
```typescript
  const fetchData = async () => {
    setLoading(true);
    try {
      const addresses = await getWalletAddresses();
      setWalletAddress(addresses.bnb || '');
      
      const recipientsList = await getRecipients();
      setRecip ients(recipientsList || []);

      // ADD THIS:
      const balanceData = await getBalance();
      setBalance(balanceData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };
```

### Step 4: Add handleSend function (after fetchData)

```typescript
  const handleSend = async () => {
    if (!recipientInput || !sendAmount || parseFloat(sendAmount) <= 0) {
      Alert.alert('Error', 'Please enter recipient and amount');
      return;
    }

    const currentBalance = balance?.[sendCurrency]?.balance || '0';
    if (parseFloat(currentBalance) < parseFloat(sendAmount)) {
      Alert.alert('Insufficient Balance');
      return;
    }

    setSendLoading(true);
    try {
      await sendToRecipient({
        recipient: recipientInput,
        amount: sendAmount,
        currency: sendCurrency,
        chain: 'bnb',
      });

      Alert.alert('Success!', `Sent ${sendAmount} ${sendCurrency}`);
      setSendAmount('');
      setRecipientInput('');
      fetchData();
    } catch (error: any) {
      Alert.alert('Failed', error.message);
    } finally {
      setSendLoading(false);
    }
  };
```

### Step 5: Add Amount Input (after line 182 - after `</View>` that closes inputContainer)

```tsx
{/* Amount Input */}
<View style={{ marginTop: 16 }}>
  <Text style={{ fontSize: 14, fontWeight: '600', color: Theme.muted, marginBottom: 8 }}>Amount</Text>
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
    <TextInput
      style={{ flex: 1, fontSize: 24, fontWeight: '600', color: Theme.text }}
      placeholder="0.00"
      value={sendAmount}
      onChangeText={setSendAmount}
      keyboardType="decimal-pad"
    />
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, gap: 8 }}>
      <Text style={{ fontSize: 14, fontWeight: '600', color: Theme.text }}>{sendCurrency}</Text>
    </View>
  </View>
  <Text style={{ fontSize: 14, color: Theme.muted, marginTop: 8 }}>
    Available: {balance?.[sendCurrency]?.balance || '0'} {sendCurrency}
  </Text>
</View>
```

### Step 6: Replace "Next" button (lines 185-199) with Send button

```tsx
<TouchableOpacity 
  style={[
    styles.nextButton,
    (!recipientInput || !sendAmount || sendLoading) && styles.nextButtonDisabled
  ]}
  disabled={!recipientInput || !sendAmount || sendLoading}
  onPress={handleSend}
>
  {sendLoading ? (
    <ActivityIndicator size="small" color="#FFFFFF" />
  ) : (
    <Text style={styles.nextButtonText}>
      Send {sendAmount || '0'} {sendCurrency}
    </Text>
  )}
</TouchableOpacity>
```

## That's it! Your P2P send is now connected to the backend! 🎉

Just make these changes and your Send functionality will work with real transactions.
