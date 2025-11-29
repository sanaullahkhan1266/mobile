import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SelectSendMethodModal from './SelectSendMethodModal';
import SelectWithdrawMethodModal from './SelectWithdrawMethodModal';

const { width, height } = Dimensions.get('window');

interface MoreActionsModalProps {
  visible: boolean;
  onClose: () => void;
}

const MoreActionsModal: React.FC<MoreActionsModalProps> = ({ visible, onClose }) => {
  const router = useRouter();
  const [selectSendModalVisible, setSelectSendModalVisible] = useState(false);
  const [selectWithdrawModalVisible, setSelectWithdrawModalVisible] = useState(false);

  const actions = [
    {
      id: 'p2p',
      title: 'P2P',
      icon: 'people-outline',
      onPress: () => {
        onClose();
        router.push('/receive');
      }
    },
    {
      id: 'credit',
      title: 'Credit',
      icon: 'card-outline',
      onPress: () => {
        onClose();
        router.push('/credit-account');
      }
    },
    {
      id: 'swap',
      title: 'Swap',
      icon: 'swap-horizontal-outline',
      onPress: () => {
        onClose();
        router.push('/swap');
      }
    },
    {
      id: 'payment-priority',
      title: 'Payment Priority',
      icon: 'swap-vertical-outline',
      onPress: () => {
        onClose();
        router.push('/payment-priority');
      }
    },
    {
      id: 'withdraw',
      title: 'Withdraw',
      icon: 'remove-outline',
      onPress: () => {
        onClose();
        setSelectWithdrawModalVisible(true);
      }
    },
    {
      id: 'gift',
      title: 'Gift',
      icon: 'gift-outline',
      onPress: () => {
        onClose();
        // Gift functionality can be added later
        console.log('Gift pressed');
      }
    }
  ];

  const handleSendModalClose = () => {
    setSelectSendModalVisible(false);
  };

  const handleWithdrawModalClose = () => {
    setSelectWithdrawModalVisible(false);
  };

  const handleFiatPayout = () => {
    handleSendModalClose();
    router.push('/fiat-payout');
  };

  const handleRedotPayTransfer = () => {
    handleSendModalClose();
    router.push('/receive');
  };

  const handleWithdrawOnChain = () => {
    handleWithdrawModalClose();
    router.push('/select-currency');
  };

  const handleWithdrawFiatPayout = () => {
    handleWithdrawModalClose();
    router.push('/fiat-payout');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View style={styles.modalContainer}>
          <SafeAreaView>
            {/* Handle bar */}
            <View style={styles.handleBar} />
            
            {/* Close button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
            
            {/* Actions list */}
            <View style={styles.actionsContainer}>
              {actions.map((action, index) => (
                <TouchableOpacity
                  key={action.id}
                  style={[
                    styles.actionItem,
                    index === actions.length - 1 && styles.lastActionItem
                  ]}
                  onPress={action.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.actionLeft}>
                    <View style={styles.iconContainer}>
                      <Ionicons name={action.icon as any} size={24} color="#374151" />
                    </View>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </SafeAreaView>
        </View>
      </View>

      {/* Send Method Selection Modal */}
      <SelectSendMethodModal
        visible={selectSendModalVisible}
        onClose={handleSendModalClose}
        onSelectFiatPayout={handleFiatPayout}
        onSelectRedotPayTransfer={handleRedotPayTransfer}
      />

      {/* Withdraw Method Selection Modal */}
      <SelectWithdrawMethodModal
        visible={selectWithdrawModalVisible}
        onClose={handleWithdrawModalClose}
        onSelectWithdrawOnChain={handleWithdrawOnChain}
        onSelectFiatPayout={handleWithdrawFiatPayout}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: height * 0.6,
  },
  handleBar: {
    width: 32,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  actionsContainer: {
    paddingHorizontal: 0,
    paddingTop: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 0,
  },
  lastActionItem: {
    borderBottomWidth: 0,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
});

export default MoreActionsModal;