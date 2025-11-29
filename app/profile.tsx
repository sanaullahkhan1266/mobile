import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Dimensions, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getUserProfile, updateUserProfile } from '@/services/profileService';

const { width, height } = Dimensions.get('window');

const ProfilePage = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [backendProfile, setBackendProfile] = useState<any>(null);

  useEffect(() => {
    fetchBackendProfile();
  }, []);

  const fetchBackendProfile = async () => {
    try {
      const profile = await getUserProfile();
      setBackendProfile(profile);
    } catch (error) {
      console.error('Failed to fetch backend profile:', error);
    }
  };

  const onSave = async () => {
    try {
      setSaving(true);

      // Update backend profile only
      await updateUserProfile({
        name: `${firstName} ${lastName}`.trim(),
      });

      Alert.alert('Profile updated', 'Your profile has been saved');
      fetchBackendProfile(); // Refresh backend profile
    } catch (e: any) {
      const msg = e?.message || 'Failed to update profile';
      Alert.alert('Update failed', msg);
    } finally {
      setSaving(false);
    }
  };

  const onPickAvatar = async () => {
    Alert.alert('Avatar', 'Profile pictures are not connected to the server yet.');
  };

  if (!backendProfile && saving) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.center}> 
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={onSave} disabled={saving} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={onPickAvatar} activeOpacity={0.8}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>
                {(backendProfile?.name?.[0] || 'U').toUpperCase()}
              </Text>
            </View>
            <View style={styles.editIconContainer}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.userName}>{firstName || backendProfile?.name}</Text>
          <Text style={styles.userEmail}>{backendProfile?.email}</Text>
          
          <TouchableOpacity style={styles.editProfileButton} onPress={onSave} disabled={saving}>
            <Text style={styles.editProfileText}>{saving ? 'Saving…' : 'Edit Profile'}</Text>
          </TouchableOpacity>
        </View>

        {/* Invite Section */}
        <TouchableOpacity style={styles.inviteSection} onPress={() => router.push('/invite-friends')}>
          <View style={styles.inviteContent}>
            <Text style={styles.inviteTitle}>Invite your friends</Text>
            <Text style={styles.inviteSubtitle}>Earn $20 both of you</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* KYC Status */}
        {backendProfile && (
          <View style={styles.kycBanner}>
            <View style={styles.kycIcon}>
              <Ionicons 
                name={backendProfile.kycStatus === 'approved' ? 'checkmark-circle' : 'warning-outline'} 
                size={24} 
                color={backendProfile.kycStatus === 'approved' ? '#10B981' : '#F59E0B'} 
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.kycTitle}>KYC Status</Text>
              <Text style={styles.kycSubtitle}>
                {backendProfile.kycStatus === 'approved' ? 'Verified' : 
                 backendProfile.kycStatus === 'pending' ? 'Pending Review' : 'Not Verified'}
              </Text>
            </View>
            {backendProfile.kycStatus !== 'approved' && (
              <TouchableOpacity onPress={() => router.push('/kyc')} style={styles.kycButton}>
                <Text style={styles.kycButtonText}>Verify</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="person-outline" size={20} color="#000000" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Personal Details</Text>
              <Text style={styles.menuSubtitle}>View and edit personal details</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="card-outline" size={20} color="#000000" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Cards</Text>
              <Text style={styles.menuSubtitle}>View and manage connected cards</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#000000" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Security and Privacy</Text>
              <Text style={styles.menuSubtitle}>Manage your security and privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="notifications-outline" size={20} color="#000000" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Notification</Text>
              <Text style={styles.menuSubtitle}>Manage notification settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="help-circle-outline" size={20} color="#000000" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Support</Text>
              <Text style={styles.menuSubtitle}>Get help and support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="close-circle-outline" size={20} color="#000000" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Close Account</Text>
              <Text style={styles.menuSubtitle}>Permanently close your account</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <Text style={styles.logoutText}>log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  center: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000000',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  editProfileButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  inviteSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  inviteContent: {
    flex: 1,
  },
  inviteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  inviteSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 25,
    paddingVertical: 16,
    marginBottom: 40,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  kycBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  kycIcon: {
    marginRight: 12,
  },
  kycTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  kycSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  kycButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  kycButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfilePage;
