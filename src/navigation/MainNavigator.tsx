import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius } from '../theme/spacing';

// Screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import WalletScreen from '../screens/wallet/WalletScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Winch screens
import RequestAcceptScreen from '../screens/winch/RequestAcceptScreen';
import ActiveJobScreen from '../screens/winch/ActiveJobScreen';
import JobCompletionScreen from '../screens/winch/JobCompletionScreen';

// Workshop screens
import CarReceptionScreen from '../screens/workshop/CarReceptionScreen';
import ProgressUpdateScreen from '../screens/workshop/ProgressUpdateScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab Icon Component
const TabIcon = ({ icon, label, focused }: { icon: string; label: string; focused: boolean }) => (
  <View style={[tabStyles.container, focused && tabStyles.containerFocused]}>
    <Text style={[tabStyles.icon, focused && tabStyles.iconFocused]}>{icon}</Text>
    <Text style={[tabStyles.label, focused && tabStyles.labelFocused]}>{label}</Text>
  </View>
);

const tabStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  containerFocused: {},
  icon: { fontSize: 22, marginBottom: 2, opacity: 0.5 },
  iconFocused: { opacity: 1 },
  label: {
    ...typography.caption,
    color: colors.tab.inactive,
  },
  labelFocused: {
    color: colors.tab.active,
    fontWeight: '700',
  },
});

// Jobs Stack (Dashboard + sub-screens)
const JobsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_left' }}>
    <Stack.Screen name="DashboardHome" component={DashboardScreen} />
    <Stack.Screen name="RequestAccept" component={RequestAcceptScreen} />
    <Stack.Screen name="ActiveJob" component={ActiveJobScreen} />
    <Stack.Screen name="JobCompletion" component={JobCompletionScreen} />
    <Stack.Screen name="CarReception" component={CarReceptionScreen} />
    <Stack.Screen name="ProgressUpdate" component={ProgressUpdateScreen} />
  </Stack.Navigator>
);

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tab.background,
          borderTopColor: colors.divider,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={JobsStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" label="الرئيسية" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="💳" label="المحفظة" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" label="حسابي" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
