import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/constants/Theme';
import ProfileButton from './ProfileButton';

interface AppHeaderProps {
  title: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  showProfile?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, rightIcon, onRightPress, showProfile = true }) => {
  const router = useRouter();
  const T = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: T.border, backgroundColor: T.bg }]}> 
      <StatusBar barStyle={T.text === '#F9FAFB' ? 'light-content' : 'dark-content'} />
      
      {/* Left side - Back button and Profile */}
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={T.text} />
        </TouchableOpacity>
        {showProfile && (
          <View style={styles.profileContainer}>
            <ProfileButton size={32} />
          </View>
        )}
      </View>
      
      {/* Center - Title */}
      <Text style={[styles.title, { color: T.text }]} numberOfLines={1}>{title}</Text>
      
      {/* Right side - Icon, Notifications, or spacer */}
      <View style={styles.rightSection}>
        {rightIcon ? (
          <TouchableOpacity onPress={onRightPress} style={styles.rightBtn}>
            <Ionicons name={rightIcon as any} size={20} color={T.text} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={() => router.push('/notifications')} 
            style={styles.rightBtn}
          >
            <Ionicons name="notifications-outline" size={20} color={T.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderBottomWidth: StyleSheet.hairlineWidth 
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: { 
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  profileContainer: {
    marginLeft: 8,
  },
  title: { 
    fontSize: 18, 
    fontWeight: '800',
    flex: 2,
    textAlign: 'center'
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  rightBtn: { 
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
});

export default AppHeader;
