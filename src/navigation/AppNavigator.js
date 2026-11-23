import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import EnemScreen from '../screens/EnemScreen';
import UspScreen from '../screens/UspScreen';
import UnicampScreen from '../screens/UnicampScreen';
import UnespScreen from '../screens/UnespScreen';
import PuccampScreen from '../screens/PuccampScreen';
import BQScreen from '../screens/BQScreen';
import DesempenhoScreen from '../screens/DesempenhoScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#ffffff' },
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Enem" component={EnemScreen} />
          <Stack.Screen name="Usp" component={UspScreen} />
          <Stack.Screen name="Unicamp" component={UnicampScreen} />
          <Stack.Screen name="Unesp" component={UnespScreen} />
          <Stack.Screen name="Puccamp" component={PuccampScreen} />
          <Stack.Screen name="BQ" component={BQScreen} />
          <Stack.Screen name="Desempenho" component={DesempenhoScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
});
