import Theme from '@/constants/Theme';
import { getBalance } from '@/services/paymentService';
import { calculateTransactionFee, getUserByIdentifier, sendToRecipient } from '@/services/transactionService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const P2PSendScreen = () => {
    const router = useRouter();
    const [sendMethod, setSendMethod] = useState('Phone');
    const [recipientInput, setRecipientInput] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USDT');
    const [chain, setChain] = useState('bnb');
    const [memo, setMemo] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [recipientFound, setRecipientFound] = useState<any>(null);
    const [balance, setBalance] = useState<any>(null);
    const [fee, setFee] = useState('0.001');

    const sendMethods = ['UID', 'Email', 'Phone'];

    React.useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const balanceData = await getBalance();
            setBalance(balanceData);
        } catch (error) {
            console.error('Failed to fetch balance:', error);
        }
    };

    const verifyRecipient = async () => {
        if (!recipientInput) return;

        setVerifying(true);
        try {
            const result = await getUserByIdentifier(recipientInput);
            if (result.found && result.user) {
                setRecipientFound(result.user);
                Alert.alert('Recipient Found', `Sending to: ${result.user.name}`);
            } else {
                Alert.alert('Not Found', result.message || 'User not found');
                setRecipientFound(null);
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to verify recipient');
            setRecipientFound(null);
        } finally {
            setVerifying(false);
        }
    };

    const calculateFee = async () => {
        if (!amount || parseFloat(amount) <= 0) return;

        try {
            const feeData = await calculateTransactionFee({
                amount,
                currency,
                chain,
            });
            setFee(feeData.fee);
        } catch (error) {
            console.error('Failed to calculate fee:', error);
        }
    };

    React.useEffect(() => {
        if (amount && parseFloat(amount) > 0) {
            calculateFee();
        }
    }, [amount, currency, chain]);

    const handleSend = async () => {
        if (!recipientInput || !amount || parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        // Check balance
        const currentBalance = balance?.[currency]?.balance || '0';
        const totalAmount = parseFloat(amount) + parseFloat(fee);

        if (parseFloat(currentBalance) < totalAmount) {
            Alert.alert('Insufficient Balance', `You need ${totalAmount} ${currency} but only have ${currentBalance} ${currency}`);
            return;
        }

        setLoading(true);
        try {
            const result = await sendToRecipient({
                recipient: recipientInput,
                amount,
                currency,
                chain,
                memo,
            });

            Alert.alert(
                'Success!',
                `Transaction sent successfully${result.transactionHash ? '\nTx: ' + result.transactionHash.substring(0, 10) + '...' : ''}`,
                [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Transaction Failed', error.message || 'Failed to send transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Send Crypto</Text>
                <TouchableOpacity style={styles.historyButton} onPress={() => router.push('/records')}>
                    <Ionicons name="time-outline" size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Recipient Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Recipient</Text>

                    {/* Method Selection */}
                    <View style={styles.methodTabs}>
                        {sendMethods.map((method) => (
                            <TouchableOpacity
                                key={method}
                                style={[
                                    styles.methodTab,
                                    sendMethod === method && styles.activeMethodTab
                                ]}
                                onPress={() => setSendMethod(method)}
                            >
                                <Text style={[
                                    styles.methodTabText,
                                    sendMethod === method && styles.activeMethodTabText
                                ]}>
                                    {method}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Input Field */}
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={`Enter ${sendMethod}`}
                            placeholderTextColor="#9CA3AF"
                            value={recipientInput}
                            onChangeText={setRecipientInput}
                            editable={!loading}
                        />
                        <TouchableOpacity
                            style={styles.verifyButton}
                            onPress={verifyRecipient}
                            disabled={!recipientInput || verifying}
                        >
                            {verifying ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                            )}
                        </TouchableOpacity>
                    </View>

                    {recipientFound && (
                        <View style={styles.recipientCard}>
                            <Ionicons name="person-circle" size={32} color={Theme.success} />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.recipientName}>{recipientFound.name}</Text>
                                <Text style={styles.recipientDetail}>
                                    {recipientFound.email || recipientFound.phone || 'Verified user'}
                                </Text>
                            </View>
                            <Ionicons name="checkmark-circle" size={24} color={Theme.success} />
                        </View>
                    )}
                </View>

                {/* Amount Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Amount</Text>
                    <View style={styles.amountContainer}>
                        <TextInput
                            style={styles.amountInput}
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="decimal-pad"
                            placeholder="0.00"
                            placeholderTextColor="#9CA3AF"
                            editable={!loading}
                        />
                        <TouchableOpacity style={styles.currencySelector}>
                            <Text style={styles.currencyText}>{currency}</Text>
                            <Ionicons name="chevron-down" size={16} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.availableText}>
                        Available: {balance?.[currency]?.balance || '0'} {currency}
                    </Text>
                </View>

                {/* Chain Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Network</Text>
                    <TouchableOpacity style={styles.chainSelector}>
                        <View style={styles.chainIcon}>
                            <Text>⛓️</Text>
                        </View>
                        <Text style={styles.chainText}>{chain.toUpperCase()}</Text>
                        <Ionicons name="chevron-down" size={16} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                {/* Memo (Optional) */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Memo (Optional)</Text>
                    <TextInput
                        style={styles.memoInput}
                        value={memo}
                        onChangeText={setMemo}
                        placeholder="Add a note..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        editable={!loading}
                    />
                </View>

                {/* Transaction Details */}
                <View style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Network Fee</Text>
                        <Text style={styles.detailValue}>{fee} {currency}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabelBold}>Total</Text>
                        <Text style={styles.detailValueBold}>
                            {(parseFloat(amount || '0') + parseFloat(fee)).toFixed(6)} {currency}
                        </Text>
                    </View>
                </View>

                {/* Send Button */}
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        (!recipientInput || !amount || parseFloat(amount) <= 0 || loading) && styles.sendButtonDisabled
                    ]}
                    onPress={handleSend}
                    disabled={!recipientInput || !amount || parseFloat(amount) <= 0 || loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={styles.sendButtonText}>Send {amount || '0'} {currency}</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.bg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Theme.border,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Theme.text,
    },
    historyButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        marginTop: 24,
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: Theme.muted,
        marginBottom: 12,
    },
    methodTabs: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 8,
    },
    methodTab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    activeMethodTab: {
        backgroundColor: Theme.text,
    },
    methodTabText: {
        fontSize: 14,
        fontWeight: '600',
        color: Theme.muted,
    },
    activeMethodTabText: {
        color: '#FFFFFF',
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
    },
    textInput: {
        flex: 1,
        backgroundColor: Theme.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Theme.border,
        paddingHorizontal: 16,
        height: 56,
        fontSize: 16,
        color: Theme.text,
    },
    verifyButton: {
        width: 56,
        height: 56,
        backgroundColor: Theme.success,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recipientCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
    },
    recipientName: {
        fontSize: 16,
        fontWeight: '700',
        color: Theme.text,
    },
    recipientDetail: {
        fontSize: 14,
        color: Theme.muted,
        marginTop: 4,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    amountInput: {
        flex: 1,
        fontSize: 32,
        fontWeight: '600',
        color: Theme.text,
        padding: 0,
    },
    currencySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
    },
    currencyText: {
        fontSize: 16,
        fontWeight: '600',
        color: Theme.text,
    },
    availableText: {
        fontSize: 14,
        color: Theme.muted,
        marginTop: 8,
    },
    chainSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Theme.border,
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    chainIcon: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chainText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: Theme.text,
    },
    memoInput: {
        backgroundColor: Theme.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Theme.border,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: Theme.text,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    detailsCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginTop: 24,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: Theme.muted,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Theme.text,
    },
    detailLabelBold: {
        fontSize: 16,
        fontWeight: '700',
        color: Theme.text,
    },
    detailValueBold: {
        fontSize: 16,
        fontWeight: '700',
        color: Theme.text,
    },
    divider: {
        height: 1,
        backgroundColor: Theme.border,
        marginVertical: 8,
    },
    sendButton: {
        backgroundColor: Theme.success,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 32,
    },
    sendButtonDisabled: {
        backgroundColor: Theme.border,
    },
    sendButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default P2PSendScreen;
