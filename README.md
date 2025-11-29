# EnPaying Mobile App

An attractive mobile application with referral system, notifications, and user profile screens built with React Native.

## Features

### 🎁 Invite Friends Screen
- Beautiful gradient header with animated gift boxes
- Level progress system with visual indicators
- Referral statistics cards with icons
- Easy copy-to-clipboard functionality for referral codes and links
- Attractive "Invite Now" call-to-action button

### 🔔 Notifications Screen  
- Tabbed interface (All, Transaction, System)
- Custom empty state with attractive illustrations
- Clean notification item cards
- Smooth tab transitions

### 👤 Profile Screen
- Gradient profile header with avatar
- Referral promotion card with call-to-action
- Organized settings sections (Security, Payment, General)
- Consistent iconography and styling
- Sign-out functionality

## Design System

### Color Palette
- **Primary**: Pink gradient (#E91E63 → #AD1457)
- **Secondary**: Green (#4CAF50)
- **Accent**: Orange (#FF9800)
- **Error**: Red (#F44336)
- **Surface**: Light gray (#F5F5F5)

### Components
- **CustomHeader**: Reusable header with back navigation
- **GradientButton**: Animated gradient buttons
- **Card**: Flexible card component with shadow options
- **StatsCard**: Statistics display with icons
- **LevelProgress**: Progress tracking with visual indicators
- **TabBar**: Smooth tab navigation
- **SettingItem**: Consistent settings list items
- **EmptyState**: Attractive empty state illustrations

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

2. **iOS Setup**:
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Android Setup**:
   Make sure you have Android Studio and SDK installed.

4. **Vector Icons Setup**:
   - **iOS**: Run `cd ios && pod install`
   - **Android**: The icons should work automatically

## Running the App

### Development
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS  
npm run ios
```

## Dependencies

### Core
- `react-native`: ^0.72.6
- `@react-navigation/native`: ^6.1.9
- `@react-navigation/stack`: ^6.3.20

### UI & Styling
- `react-native-linear-gradient`: ^2.8.3
- `react-native-vector-icons`: ^10.0.2
- `react-native-gesture-handler`: ^2.13.4
- `react-native-screens`: ^3.27.0

### Utilities
- `react-native-clipboard`: ^1.5.1

## Project Structure

```
src/
├── components/
│   └── ui/
│       └── index.js          # Reusable UI components
├── screens/
│   ├── InviteFriendsScreen.js # Referral and invitation screen
│   ├── NotificationsScreen.js # Notifications with tabs
│   └── ProfileScreen.js       # User profile and settings
├── styles/
│   └── theme.js              # Design system constants
└── App.js                    # Main navigation setup
```

## Key Features Implemented

### 🎨 Visual Design
- **Gradient backgrounds** for headers and cards
- **Custom illustrations** for empty states
- **Animated elements** like rotating gift boxes
- **Consistent shadows** and elevation
- **Modern card-based** layouts

### 🚀 User Experience
- **Smooth navigation** between screens
- **Intuitive tab system** for notifications
- **One-tap copying** for referral codes
- **Visual feedback** for user interactions
- **Responsive layouts** for different screen sizes

### 📱 Mobile-First
- **Touch-friendly** button sizes
- **Proper spacing** and typography
- **Status bar** styling
- **Safe area** handling
- **Gesture navigation** support

## Customization

### Colors
Edit `src/styles/theme.js` to customize:
- Primary/secondary colors
- Gradient combinations  
- Text colors
- Shadow styles

### Typography
Modify typography scales in the theme file:
- Font sizes
- Font weights
- Line heights

### Components
All UI components are modular and can be easily customized or extended.

## Screen Navigation

The app uses React Navigation v6 with stack navigator:

- **Profile** (Initial screen)
- **InviteFriends** (Referral system)
- **Notifications** (Tabbed notifications)

Navigation is handled through the custom header back buttons and programmatic navigation calls.

---

## Preview

The app replicates the design from the provided screenshots with:
- ✅ Exact color schemes and gradients
- ✅ Matching typography and spacing
- ✅ Interactive elements and animations
- ✅ Responsive and mobile-optimized layouts
- ✅ Modern React Native architecture

Ready for development and further customization!