import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Dimensions, Switch, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Theme from '@/constants/Theme';
import { logoutFromBackend } from '@/services/authService';

const { width, height } = Dimensions.get('window');

const SettingsPage = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    (async () => {
      const dm = await AsyncStorage.getItem('settings.darkMode');
      const nt = await AsyncStorage.getItem('settings.notifications');
      setDarkMode(dm === 'true');
      setNotifications(nt !== 'false');
    })();
  }, []);

  const onToggle = async (key: 'darkMode' | 'notifications', value: boolean) => {
    if (key === 'darkMode') setDarkMode(value); else setNotifications(value);
    await AsyncStorage.setItem(`settings.${key}`, String(value));
  };

  const handleSignOut = async () => {
    try {
      await logoutFromBackend();
      // After signing out, redirect to home page where login/signup buttons are shown
      router.replace('/home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.bg} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Toggles */}
        <View style={styles.row}> 
          <Text style={styles.rowTitle}>Dark mode</Text>
          <Switch value={darkMode} onValueChange={(v) => onToggle('darkMode', v)} />
        </View>
        <View style={styles.row}> 
          <Text style={styles.rowTitle}>Notifications</Text>
          <Switch value={notifications} onValueChange={(v) => onToggle('notifications', v)} />
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/language-selection')} activeOpacity={0.7}>
            <Text style={styles.linkText}>Language</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/coming-soon?title=Appearance&icon=color-palette-outline')} activeOpacity={0.7}>
            <Text style={styles.linkText}>Appearance</Text>
          </TouchableOpacity>
        </View>

        {/* Payments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payments</Text>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/payment-priority')} activeOpacity={0.7}>
            <Text style={styles.linkText}>Payment Priority</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/select-currency')} activeOpacity={0.7}>
            <Text style={styles.linkText}>Select Currency</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/credit-account')} activeOpacity={0.7}>
            <Text style={styles.linkText}>Credit Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/account-priority')} activeOpacity={0.7}>
            <Text style={styles.linkText}>Account Priority</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/low-balance-alert')} activeOpacity={0.7}>
            <Text style={styles.linkText}>Low Balance Alert</Text>
          </TouchableOpacity>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/app-lock')} activeOpacity={0.7}>
            <Text style={styles.linkText}>App Lock</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/security')} activeOpacity={0.7}>
            <Text style={styles.linkText}>Security</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/permissions')} activeOpacity={0.7}>
            <Text style={styles.linkText}>Permissions</Text>
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/help')} activeOpacity={0.7}>
            <Text style={styles.linkText}>Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/network-diagnostics')} activeOpacity={0.7}>
            <Text style={styles.linkText}>Network Diagnostics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/about')} activeOpacity={0.7}>
            <Text style={styles.linkText}>About</Text>
          </TouchableOpacity>
        </View>

        {/* Social & Rewards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social & Rewards</Text>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/invite-friends')} activeOpacity={0.7}>
            <Text style={styles.linkText}>Invite Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/my-rewards')} activeOpacity={0.7}>
            <Text style={styles.linkText}>My Rewards</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/messages')} activeOpacity={0.7}>
            <Text style={styles.linkText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/notifications')} activeOpacity={0.7}>
            <Text style={styles.linkText}>Notifications</Text>
          </TouchableOpacity>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.linkRow} onPress={handleSignOut} activeOpacity={0.7}>
            <Text style={[styles.linkText, { color: '#EF4444' }]}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bg },
  header: { paddingHorizontal: width * 0.06, paddingTop: height * 0.02, paddingBottom: height * 0.015 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: Theme.text },
  content: { flex: 1, paddingHorizontal: width * 0.06 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Theme.border },
  rowTitle: { fontSize: 16, color: Theme.text },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 14, color: Theme.muted, marginBottom: 12 },
  linkRow: { paddingVertical: 12 },
  linkText: { fontSize: 16, color: Theme.text, fontWeight: '600' },
});

export default SettingsPage;
