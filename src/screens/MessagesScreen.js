import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { CustomHeader, GradientButton } from '../components/ui';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

const MessagesScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [messages, setMessages] = useState([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const message = {
        id: Date.now(),
        text: newMessage.trim(),
        timestamp: new Date(),
        sender: 'user',
        status: 'sent'
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setShowMessageModal(false);
      
      Alert.alert('Success', 'Your message has been sent to our support team');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message) => {
    return (
      <View key={message.id} style={[
        styles.messageItem,
        { backgroundColor: isDarkMode ? theme.colors.surface : '#FFFFFF' }
      ]}>
        <View style={styles.messageContent}>
          <Text style={[
            styles.messageText,
            { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
          ]}>
            {message.text}
          </Text>
          <Text style={[
            styles.messageTime,
            { color: isDarkMode ? theme.colors.text.secondary : colors.text.secondary }
          ]}>
            {message.timestamp.toLocaleTimeString()}
          </Text>
        </View>
        <View style={[
          styles.messageStatus,
          { backgroundColor: message.status === 'sent' ? colors.success : colors.warning }
        ]}>
          <Icon name="check" size={12} color="#FFFFFF" />
        </View>
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyStateContainer}>
        <View style={styles.emptyIconContainer}>
          <Icon 
            name="chat-bubble-outline" 
            size={80} 
            color={isDarkMode ? theme.colors.text.disabled : colors.text.disabled} 
          />
        </View>
        <Text style={[
          styles.emptyTitle,
          { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
        ]}>
          No messages
        </Text>
        <Text style={[
          styles.emptySubtitle,
          { color: isDarkMode ? theme.colors.text.secondary : colors.text.secondary }
        ]}>
          Messages from the team will be shown here
        </Text>
      </View>
    );
  };

  const renderSendMessageModal = () => {
    return (
      <Modal
        visible={showMessageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMessageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContainer,
            { backgroundColor: isDarkMode ? theme.colors.surface : '#FFFFFF' }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[
                styles.modalTitle,
                { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
              ]}>
                Send us a message
              </Text>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setShowMessageModal(false)}
              >
                <Icon name="close" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <TextInput
                style={[
                  styles.messageInput,
                  { 
                    backgroundColor: isDarkMode ? theme.colors.gray[800] : '#F5F5F5',
                    color: isDarkMode ? theme.colors.text.primary : colors.text.primary,
                    borderColor: isDarkMode ? theme.colors.gray[700] : colors.text.disabled,
                  }
                ]}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Type your message here..."
                placeholderTextColor={isDarkMode ? theme.colors.text.secondary : colors.text.secondary}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  { backgroundColor: isDarkMode ? theme.colors.gray[700] : colors.text.disabled }
                ]}
                onPress={() => setShowMessageModal(false)}
              >
                <Text style={[
                  styles.cancelButtonText,
                  { color: isDarkMode ? theme.colors.text.primary : '#FFFFFF' }
                ]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <GradientButton
                title={isLoading ? "Sending..." : "Send"}
                onPress={sendMessage}
                disabled={isLoading || !newMessage.trim()}
                gradient={colors.gradients.primary}
                style={styles.sendButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDarkMode ? theme.colors.background.primary : colors.surface }
    ]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? theme.colors.background.primary : colors.surface}
      />
      
      <CustomHeader
        title="Messages"
        onBackPress={() => navigation.goBack()}
        backgroundColor={isDarkMode ? theme.colors.background.primary : colors.surface}
      />

      <View style={styles.content}>
        {messages.length === 0 ? (
          <>
            {renderEmptyState()}
            <View style={styles.sendButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.sendMessageButton,
                  { 
                    backgroundColor: isDarkMode ? theme.colors.surface : '#FFFFFF',
                    borderColor: isDarkMode ? theme.colors.gray[700] : colors.text.disabled,
                  }
                ]}
                onPress={() => setShowMessageModal(true)}
              >
                <Text style={[
                  styles.sendMessageButtonText,
                  { color: isDarkMode ? theme.colors.text.primary : colors.text.primary }
                ]}>
                  Send us a message
                </Text>
                <Icon name="send" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <ScrollView style={styles.messagesList} showsVerticalScrollIndicator={false}>
            {messages.map(message => renderMessage(message))}
          </ScrollView>
        )}
      </View>

      {renderSendMessageModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIconContainer: {
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  sendButtonContainer: {
    paddingVertical: spacing.lg,
  },
  sendMessageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    ...colors.shadows.light,
  },
  sendMessageButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  messagesList: {
    flex: 1,
    paddingTop: spacing.md,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    ...colors.shadows.light,
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.xs,
  },
  messageTime: {
    fontSize: 12,
  },
  messageStatus: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    paddingTop: spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalClose: {
    padding: spacing.sm,
  },
  modalContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    minHeight: 120,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  sendButton: {
    flex: 1,
  },
});

export default MessagesScreen;