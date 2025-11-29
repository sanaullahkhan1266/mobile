import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

interface SelectSendMethodModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectFiatPayout: () => void;
  onSelectRedotPayTransfer: () => void;
}

const SelectSendMethodModal: React.FC<SelectSendMethodModalProps> = ({
  visible,
  onClose,
  onSelectFiatPayout,
  onSelectRedotPayTransfer,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select the Way to Send</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Options */}
          <View style={styles.content}>
            {/* Fiat Payout Option */}
            <TouchableOpacity
              style={styles.option}
              onPress={onSelectFiatPayout}
              activeOpacity={0.7}
            >
              <View style={styles.optionIcon}>
                <Ionicons name="business" size={24} color="#EF4444" />
              </View>
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <Text style={styles.optionTitle}>Fiat Payout</Text>
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>New</Text>
                  </View>
                </View>
                <Text style={styles.optionDescription}>
                  Send crypto and receive fiat to your own bank account or e-wallet
                </Text>
              </View>
            </TouchableOpacity>

            {/* Transfer to RedotPay Option */}
            <TouchableOpacity
              style={styles.option}
              onPress={onSelectRedotPayTransfer}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIcon, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="swap-horizontal" size={24} color="#10B981" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Transfer to other's RedotPay</Text>
                <Text style={styles.optionDescription}>Instant Transfer</Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#FEE2E2',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  newBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  newBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default SelectSendMethodModal;