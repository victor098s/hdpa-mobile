import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../constants/theme';

const UNIVERSIDADES = [
  { label: 'ENEM', route: 'Enem' },
  { label: 'USP', route: 'Usp' },
  { label: 'UNICAMP', route: 'Unicamp' },
  { label: 'UNESP', route: 'Unesp' },
  { label: 'PUC', route: 'Puccamp' },
];

export default function Menu() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {UNIVERSIDADES.map((item) => {
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
