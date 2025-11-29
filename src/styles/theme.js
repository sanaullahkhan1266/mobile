export const colors = {
  primary: '#E91E63',
  primaryDark: '#C2185B',
  secondary: '#4CAF50',
  secondaryLight: '#81C784',
  accent: '#FF9800',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  error: '#F44336',
  warning: '#FF9800',
  success: '#4CAF50',
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    hint: '#9E9E9E',
    white: '#FFFFFF'
  },
  gradients: {
    primary: ['#E91E63', '#AD1457'],
    secondary: ['#4CAF50', '#388E3C'],
    accent: ['#FF9800', '#F57C00'],
    dark: ['#212121', '#424242'],
    red: ['#FF5252', '#F44336'],
    pink: ['#E91E63', '#C2185B'],
    green: ['#4CAF50', '#66BB6A']
  },
  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6.27,
      elevation: 8,
    },
    heavy: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 10.32,
      elevation: 12,
    }
  }
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999
};