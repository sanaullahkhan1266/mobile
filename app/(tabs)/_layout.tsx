import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 84,
          justifyContent: 'center',
          paddingHorizontal: 0,
        },
        tabBarItemStyle: {
          gap: 40,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarActiveTintColor: '#3D38ED',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="card"
        options={{
          title: 'Card',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'card' : 'card-outline'} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'apps' : 'apps-outline'} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />
      {/* Hide Benefits tab from the tab bar while keeping the route accessible */}
    </Tabs>
  );
}
