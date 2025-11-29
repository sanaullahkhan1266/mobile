import React from 'react';
import { Platform } from 'react-native';

// Web-only invisible container for Clerk Smart CAPTCHA.
// Having this element present lets Clerk render the Turnstile widget
// and avoids the fallback warning. We keep it display:none to avoid layout shifts.
const CaptchaContainer = () => {
  if (Platform.OS !== 'web') return null;
  return React.createElement('div', { id: 'clerk-captcha', style: { display: 'none' } });
};

export default CaptchaContainer;
