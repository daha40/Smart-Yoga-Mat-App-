// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen.js';
import ConnectionScreen from './screens/ConnectionScreen.js';
import ControlPanel from './screens/ControlPanel.js';
import MusicScreen from './screens/MusicScreen.js';
import ProductsScreen from './screens/ProductsScreen.js';
import UpdatesScreen from './screens/UpdatesScreen.js';
import AnalyticsScreen from './screens/AnalyticsScreen.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6200ee',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerShown: false 
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Smart Yoga Mat' }} 
          />
          <Stack.Screen 
            name="Connection" 
            component={ConnectionScreen}
            options={{ title: 'Connect to Mat' }} 
          />
          <Stack.Screen 
            name="ControlPanel" 
            component={ControlPanel}
            options={{ title: 'Mat Controls' }} 
          />
          <Stack.Screen 
            name="Music" 
            component={MusicScreen}
            options={{ title: 'Sound Options' }} 
          />
          <Stack.Screen 
            name="Products" 
            component={ProductsScreen}
            options={{ title: 'Products & Features' }} 
          />
          <Stack.Screen 
            name="Updates" 
            component={UpdatesScreen}
            options={{ title: 'Mat Updates' }} 
          />
          <Stack.Screen 
            name="Analytics" 
            component={AnalyticsScreen}
            options={{ title: 'Your Progress' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}