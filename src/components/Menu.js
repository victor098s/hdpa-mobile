import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../constants/theme';

// Lista das universidades exibidas como opções de navegação no menu horizontal.
const UNIVERSIDADES = [
  { label: 'ENEM', route: 'Enem' },
  { label: 'USP', route: 'Usp' },
  { label: 'UNICAMP', route: 'Unicamp' },
  { label: 'UNESP', route: 'Unesp' },
  { label: 'PUC', route: 'Puccamp' },
];

export default function Menu() {
  // Objetos usados para navegar entre telas e identificar a rota atualmente ativa.
  const navigation = useNavigation();
  const route = useRoute();

  return (
    {/* Container externo que aplica o fundo cinza e a borda inferior do menu. */}
    <View style={styles.container}>
      {/* Área horizontal rolável que mantém todos os itens lado a lado. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Gera um botão de navegação para cada universidade da lista. */}
        {UNIVERSIDADES.map((item) => {
          // Destaca o item cuja rota corresponde à tela aberta no momento.
          const isActive = route.name === item.route;
          return (
            <Pressable
              key={item.route}
              onPress={() => navigation.navigate(item.route)}
              style={({ pressed }) => [
                styles.navItem,
                isActive && styles.activeNavItem,
                pressed && styles.pressedNavItem,
              ]}
            >
              {/* Texto da universidade com estilo diferente quando a rota está ativa. */}
              <Text style={[styles.navText, isActive && styles.activeNavText]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

// Folha de estilos do menu, dos itens de navegação e das suas interações.
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f3f3',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  scrollContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    minWidth: '100%',
  },
  navItem: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  activeNavItem: {
    backgroundColor: '#e6edff',
  },
  pressedNavItem: {
    opacity: 0.7,
  },
  navText: {
    color: '#0852f5',
    fontWeight: 'bold',
    fontSize: 18,
  },
  activeNavText: {
    color: '#002980',
    textDecorationLine: 'underline',
  },
});
