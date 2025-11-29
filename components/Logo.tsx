import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

interface LogoProps {
  size?: number;
  style?: any;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 64,
  style
}) => {
  return (
    <View style={[
      styles.container,
      style,
      {
        width: size,
        height: size,
      }
    ]}>
      <Image 
        source={require('../assets/images/logo.png')}
        style={[
          styles.logoImage,
          {
            width: size,
            height: size,
          }
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

// Keep backward compatibility
export const BitcoinLogo = Logo;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoImage: {
    alignSelf: 'center',
  },
});

export default BitcoinLogo;