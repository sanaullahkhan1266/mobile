import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import context providers
import { ThemeProvider } from './contexts/ThemeContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Import screens
import InviteFriendsScreen from './screens/InviteFriendsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import MyRewardsScreen from './screens/MyRewardsScreen';
import LowBalanceAlertScreen from './screens/LowBalanceAlertScreen';
import SecurityScreen from './screens/SecurityScreen';
import SecurityAdvancedScreen from './screens/SecurityAdvancedScreen';
import AppLockScreen from './screens/AppLockScreen';
import SelectCurrencyScreen from './screens/SelectCurrencyScreen';
import AccountPriorityScreen from './screens/AccountPriorityScreen';
import SettingsScreen from './screens/SettingsScreen';
import AppearanceScreen from './screens/AppearanceScreen';
import LanguageSelectionScreen from './screens/LanguageSelectionScreen';
import PermissionsScreen from './screens/PermissionsScreen';
import NetworkDiagnosticsScreen from './screens/NetworkDiagnosticsScreen';
import HelpScreen from './screens/HelpScreen';
import MessagesScreen from './screens/MessagesScreen';
import HelpSupportScreen from './screens/HelpSupportScreen';
import HelpCollectionScreen from './screens/HelpCollectionScreen';
import HelpSearchScreen from './screens/HelpSearchScreen';

// Import theme
import { colors } from './styles/theme';

const Stack = createStackNavigator();

const App = () => {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <LanguageProvider>
          <NavigationContainer>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor={colors.primary} 
          translucent={false}
        />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: colors.surface },
          }}
          initialRouteName="Profile"
        >
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
              title: 'Profile'
            }}
          />
          <Stack.Screen 
            name="InviteFriends" 
            component={InviteFriendsScreen}
            options={{
              title: 'Invite Friends'
            }}
          />
          <Stack.Screen 
            name="Notifications" 
            component={NotificationsScreen}
            options={{
              title: 'Notifications'
            }}
          />
          <Stack.Screen 
            name="MyRewards" 
            component={MyRewardsScreen}
            options={{
              title: 'My Rewards'
            }}
          />
          <Stack.Screen 
            name="LowBalanceAlert" 
            component={LowBalanceAlertScreen}
            options={{
              title: 'Low Balance Alert'
            }}
          />
          <Stack.Screen 
            name="Security" 
            component={SecurityScreen}
            options={{
              title: 'Security'
            }}
          />
          <Stack.Screen 
            name="SecurityAdvanced" 
            component={SecurityAdvancedScreen}
            options={{
              title: 'Security Advanced'
            }}
          />
          <Stack.Screen 
            name="AppLock" 
            component={AppLockScreen}
            options={{
              title: 'App Lock'
            }}
          />
          <Stack.Screen 
            name="SelectCurrency" 
            component={SelectCurrencyScreen}
            options={{
              title: 'Select Currency'
            }}
          />
          <Stack.Screen 
            name="AccountPriority" 
            component={AccountPriorityScreen}
            options={{
              title: 'Account Priority'
            }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              title: 'Settings'
            }}
          />
          <Stack.Screen 
            name="Appearance" 
            component={AppearanceScreen}
            options={{
              title: 'Appearance'
            }}
          />
          <Stack.Screen 
            name="LanguageSelection" 
            component={LanguageSelectionScreen}
            options={{
              title: 'Language Selection'
            }}
          />
          <Stack.Screen 
            name="Permissions" 
            component={PermissionsScreen}
            options={{
              title: 'Permissions'
            }}
          />
          <Stack.Screen 
            name="NetworkDiagnostics" 
            component={NetworkDiagnosticsScreen}
            options={{
              title: 'Network Diagnostics'
            }}
          />
          <Stack.Screen 
            name="Help" 
            component={HelpScreen}
            options={{
              title: 'Help'
            }}
          />
          <Stack.Screen 
            name="Messages" 
            component={MessagesScreen}
            options={{
              title: 'Messages'
            }}
          />
          <Stack.Screen 
            name="HelpSupport" 
            component={HelpSupportScreen}
            options={{
              title: 'Help Support'
            }}
          />
          <Stack.Screen 
            name="HelpCollection" 
            component={HelpCollectionScreen}
            options={{
              title: 'Help Collection'
            }}
          />
          <Stack.Screen 
            name="HelpSearch" 
            component={HelpSearchScreen}
            options={{
              title: 'Search Help'
            }}
          />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
        </LanguageProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
};

export default App;