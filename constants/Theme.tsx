import React from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeTokens = {
  bg: string;
  text: string;
  muted: string;
  card: string;
  cardAlt: string;
  border: string;
  accent: string;
  success: string;
  warning: string;
};

const light: ThemeTokens = {
  bg: '#FFFFFF',
  text: '#000000',
  muted: '#666666',
  card: '#FFFFFF',
  cardAlt: '#F8F8F8',
  border: '#E0E0E0',
  accent: '#000000',
  success: '#10B981',
  warning: '#000000',
};

const dark: ThemeTokens = {
  bg: '#000000',
  text: '#FFFFFF',
  muted: '#AAAAAA',
  card: '#111111',
  cardAlt: '#222222',
  border: '#333333',
  accent: '#FFFFFF',
  success: '#10B981',
  warning: '#FFFFFF',
};

const ThemeContext = React.createContext<ThemeTokens | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scheme = useColorScheme();
  const [tokens, setTokens] = React.useState<ThemeTokens>(scheme === 'dark' ? dark : light);

  React.useEffect(() => {
    (async () => {
      try {
        const mode = await AsyncStorage.getItem('settings.themeMode'); // system|light|dark
        // we ignore accent here for brevity; could be used to tint accent
        const isDark = mode === 'dark' ? true : mode === 'light' ? false : scheme === 'dark';
        setTokens(isDark ? dark : light);
      } catch (e) {
        setTokens(scheme === 'dark' ? dark : light);
      }
    })();
  }, [scheme]);

  return <ThemeContext.Provider value={tokens}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeTokens => {
  const ctx = React.useContext(ThemeContext);
  if (ctx) return ctx;
  const scheme = useColorScheme();
  return scheme === 'dark' ? dark : light;
};

// Default export keeps backward compatibility (light theme)
const Theme = light;
export default Theme;
