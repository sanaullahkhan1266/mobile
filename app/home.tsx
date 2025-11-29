import React from 'react';
import { HomeScreen } from '../components/HomeScreen';
import { useRouter } from 'expo-router';

const HomePage = () => {
  const router = useRouter();

  const handleSignUp = () => {
    console.log('Navigating to signup from home...');
    router.push('/signup');
  };

  const handleLogin = () => {
    console.log('Navigating to login from home...');
    router.push('/login');
  };

  const handleClose = () => {
    // This could navigate to onboarding or close the app
    console.log('Close pressed - navigating to onboarding...');
    router.push('/onboarding');
  };

  return (
    <HomeScreen
      onSignUp={handleSignUp}
      onLogin={handleLogin}
      onClose={handleClose}
    />
  );
};

export default HomePage;