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

// Instância responsável por gerenciar a pilha de navegação nativa da aplicação.
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  // Dados de autenticação usados para decidir quais telas podem ser acessadas.
  const { isAuthenticated, isLoading } = useAuth();

  // Enquanto o token salvo está sendo restaurado, exibe somente o indicador de carregamento.
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    // Configuração global da pilha: oculta cabeçalhos e aplica transição padrão entre telas.
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#ffffff' },
      }}
    >
      {/* Usuários não autenticados acessam apenas a tela de login. */}
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          {/* Área autenticada: telas principal e das categorias de vestibulares. */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Enem" component={EnemScreen} />
          <Stack.Screen name="Usp" component={UspScreen} />
          <Stack.Screen name="Unicamp" component={UnicampScreen} />
          <Stack.Screen name="Unesp" component={UnespScreen} />
          <Stack.Screen name="Puccamp" component={PuccampScreen} />
          {/* Funcionalidades internas disponíveis após a autenticação. */}
          <Stack.Screen name="BQ" component={BQScreen} />
          <Stack.Screen name="Desempenho" component={DesempenhoScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

// Estilos da tela provisória exibida durante a restauração da sessão.
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
});
