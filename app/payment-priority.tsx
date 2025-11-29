import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

export default function PaymentPriorityScreen() {
  const router = useRouter();
  const [preferredPaymentEnabled, setPreferredPaymentEnabled] = useState(false);
  const [dragInstruction, setDragInstruction] = useState('Hold to drag');
  const [editMode, setEditMode] = useState(false);
  const [methods, setMethods] = useState<Array<{ id: string; name: string; type: string; icon: string; balance: string }>>([]);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('payment.priority.order');
      const enabled = await AsyncStorage.getItem('payment.priority.enabled');
      if (enabled === 'true') setPreferredPaymentEnabled(true);
      const defaultList = [
        { id: '1', name: 'USD', type: 'Fiat', icon: '🇺🇸', balance: '$5.00' },
        { id: '2', name: 'EUR', type: 'Fiat', icon: '🇪🇺', balance: '€0.00' },
        { id: '3', name: 'BTC', type: 'Crypto', icon: '🟠', balance: '0.00000000' },
        { id: '4', name: 'ETH', type: 'Crypto', icon: '⚫', balance: '0.00000000' },
        { id: '5', name: 'GBP', type: 'Fiat', icon: '🇬🇧', balance: '£0.00' },
      ];
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length) {
            setMethods(parsed);
            return;
          }
        } catch {}
      }
      setMethods(defaultList);
    })();
  }, []);

  const persist = useCallback(async (enabled: boolean, list: typeof methods) => {
    await AsyncStorage.setItem('payment.priority.enabled', String(enabled));
    await AsyncStorage.setItem('payment.priority.order', JSON.stringify(list));
  }, []);

  const handleTogglePreferredPayment = (value: boolean) => {
    setPreferredPaymentEnabled(value);
    persist(value, methods);

    if (value) {
      Alert.alert(
        'Preferred Payment Enabled',
        'You can now set the primary currency of your currencies.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Preferred Payment Disabled',
        'The system will automatically set your preferred currency.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleDragStart = () => {
    setDragInstruction('Reorder mode');
    setEditMode(true);
  };

  const moveItem = useCallback((index: number, direction: 'up' | 'down') => {
    setMethods((prev) => {
      const next = [...prev];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      const tmp = next[index];
      next[index] = next[target];
      next[target] = tmp;
      persist(preferredPaymentEnabled, next);
      return next;
    });
  }, [persist, preferredPaymentEnabled]);

  const exitEditMode = () => {
    setEditMode(false);
    setDragInstruction('Hold to drag');
  };

  const renderToggleSwitch = () => (
    <Switch
      value={preferredPaymentEnabled}
      onValueChange={handleTogglePreferredPayment}
      trackColor={{
        false: '#E5E5E5',
        true: '#34D399'
      }}
      thumbColor={preferredPaymentEnabled ? '#FFFFFF' : '#FFFFFF'}
      ios_backgroundColor="#E5E5E5"
      style={styles.switch}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Priority</Text>
        <TouchableOpacity onPress={editMode ? exitEditMode : handleDragStart} style={styles.placeholder}>
          {preferredPaymentEnabled && (
            <Ionicons name={editMode ? 'checkmark-done-outline' : 'reorder-three-outline'} size={22} color="#999999" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Preferred Payment Setting */}
        <View style={styles.settingCard}>
          <View style={styles.settingContent}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Set preferred payment</Text>
              <Text style={styles.settingDescription}>
                When enabled, you can set the primary currency of your currencies. When disabled, the system will automatically set your preferred currency.
              </Text>
            </View>
            <View style={styles.settingControl}>
              {renderToggleSwitch()}
            </View>
          </View>
        </View>

        {/* Drag Instruction */}
        <View style={styles.dragInstructionContainer}>
          <Text style={styles.dragInstructionText}>{dragInstruction}</Text>
        </View>

        {/* Payment Methods List */}
        {preferredPaymentEnabled && (
          <View style={styles.paymentMethodsContainer}>
            <Text style={styles.sectionTitle}>Currency Priority</Text>
            <Text style={styles.sectionDescription}>
              Drag to reorder your preferred payment methods
            </Text>

            {/* Methods with simple reorder controls */}
            <View style={styles.paymentMethodsList}>
              {methods.map((method, index) => (
                <View
                  key={method.id}
                  style={[
                    styles.paymentMethodItem,
                    index === 0 && styles.primaryPaymentMethod
                  ]}
                >
                  <View style={styles.paymentMethodLeft}>
                    <View style={styles.dragHandle}>
                      <Ionicons name={editMode ? 'swap-vertical' : 'reorder-three-outline'} size={20} color="#999999" />
                    </View>
                    <View style={styles.currencyIcon}>
                      <Text style={styles.currencyEmoji}>{method.icon}</Text>
                    </View>
                    <View style={styles.currencyInfo}>
                      <Text style={styles.currencyName}>{method.name}</Text>
                      <Text style={styles.currencyType}>{method.type}</Text>
                    </View>
                  </View>
                  <View style={styles.paymentMethodRight}>
                    <Text style={styles.currencyBalance}>{method.balance}</Text>
                    {index === 0 && (
                      <View style={styles.primaryBadge}>
                        <Text style={styles.primaryBadgeText}>Primary</Text>
                      </View>
                    )}
                    {editMode && (
                      <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
                        <TouchableOpacity onPress={() => moveItem(index, 'up')} disabled={index === 0}>
                          <Ionicons name="chevron-up" size={20} color={index === 0 ? '#DDD' : '#111'} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => moveItem(index, 'down')} disabled={index === methods.length - 1}>
                          <Ionicons name="chevron-down" size={20} color={index === methods.length - 1 ? '#DDD' : '#111'} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <View style={styles.instructionItem}>
                <Ionicons name="information-circle-outline" size={16} color="#666666" />
                <Text style={styles.instructionText}>
                  The first currency will be used as your primary payment method
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Ionicons name="swap-vertical-outline" size={16} color="#666666" />
                <Text style={styles.instructionText}>
                  Drag items to reorder payment priority
                </Text>
              </View>
              <View style={styles.instructionItem}>
                <Ionicons name="card-outline" size={16} color="#666666" />
                <Text style={styles.instructionText}>
                  Available balance will be considered for transactions
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Empty State */}
        {!preferredPaymentEnabled && (
          <View style={styles.emptyState}>
            <Ionicons name="settings-outline" size={48} color="#CCCCCC" />
            <Text style={styles.emptyStateTitle}>Automatic Payment Selection</Text>
            <Text style={styles.emptyStateDescription}>
              The system will automatically choose the best payment method based on availability and transaction requirements.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  settingControl: {
    alignItems: 'flex-end',
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  dragInstructionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  dragInstructionText: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '500',
  },
  paymentMethodsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  paymentMethodsList: {
    marginBottom: 20,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  primaryPaymentMethod: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dragHandle: {
    paddingRight: 12,
    paddingVertical: 4,
  },
  currencyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  currencyEmoji: {
    fontSize: 18,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  currencyType: {
    fontSize: 12,
    color: '#666666',
  },
  paymentMethodRight: {
    alignItems: 'flex-end',
  },
  currencyBalance: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  primaryBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  primaryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  instructionsContainer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  instructionText: {
    flex: 1,
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
  },
});