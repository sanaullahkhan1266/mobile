import React from 'react';
import { TouchableOpacity, View, StyleSheet, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/constants/Theme';

interface ProfileButtonProps {
  size?: number;
  showBorder?: boolean;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ size = 32, showBorder = true }) => {
  const router = useRouter();
  const T = useTheme();

  const handlePress = () => {
    router.push('/profile');
  };

  const avatarSize = size;
  const iconSize = Math.round(size * 0.6);

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.avatarCircle,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: T.card,
          borderColor: showBorder ? T.border : 'transparent',
          borderWidth: showBorder ? 1 : 0,
        }
      ]}>
        <Ionicons name="person-outline" size={iconSize} color={T.text} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    resizeMode: 'cover',
  },
  avatarInitials: {
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default ProfileButton;