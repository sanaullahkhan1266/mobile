import type { ExpoConfig } from 'expo/config';

// Use a typed config file to safely inject environment variables
const config: ExpoConfig = {
  name: 'mobile',
  slug: 'mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/new-icon.png',
  scheme: 'mobile',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/new-splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    infoPlist: {
      NSPhotoLibraryUsageDescription: 'Allow EnPaying to access your photos to set a profile picture.',
      NSCameraUsageDescription: 'Allow EnPaying to use your camera to take a profile photo.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/new-adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: 'com.anonymous.mobile',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/new-icon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-font'
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
};

export default config;
