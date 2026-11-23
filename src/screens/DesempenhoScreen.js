import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Header from '../components/Header';
import { getRespostas } from '../utils/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/theme';

export default function DesempenhoScreen() {
  const isFocused = useIsFocused();
  const [dados, setDados] = useState({ total: 0, acertos: 0, erros: 0, percentual: '0.00' });

  const carregarDesempenho = async () => {
    try {
      const respostas = await getRespostas();
      const total = respostas.length;
      const acertos = respostas.filter((resposta) => resposta.acertou).length;
      const erros = total - acertos;
      const percentual = total > 0 ? ((acertos / total) * 100).toFixed(2) : '0.00';
      setDados({ total, acertos, erros, percentual });
    } catch {
      setDados({ total: 0, acertos: 0, erros: 0, percentual: '0.00' });
    }
  };

  useEffect(() => {
    if (isFocused) carregarDesempenho();
  }, [isFocused]);

  const porcentagemErros = dados.total > 0
    ? ((dados.erros / dados.total) * 100).toFixed(0)
    : '0';

  const resetarHistorico = () => {
    Alert.alert(
      'Limpar Histórico',
      'Deseja redefinir os dados e respostas registradas de seu desempenho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Redefinir',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('respostas');
            await carregarDesempenho();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.topBar} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Meu Desempenho</Text>
          <View style={styles.line} />
          <View style={styles.cards}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>TAXA DE ACERTOS</Text>
              <View style={styles.card1Content}>
                <View style={styles.circleOuter}>
                  <View style={styles.circleInner}>
                    <Text style={styles.circlePercentText}>{dados.percentual}%</Text>
                  </View>
                </View>
                <View style={styles.infoCol}>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoNumber}>{dados.total}</Text>
                    <Text style={styles.infoLabel}>Questões Respondidas</Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Text style={[styles.infoNumber, { color: COLORS.success }]}>{dados.acertos}</Text>
                    <Text style={styles.infoLabel}>Acertos</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>GRÁFICO DE EVOLUÇÃO</Text>
              <View style={styles.chartContainer}>
                {[
                  { mes: 'ABR', progresso: '100%' },
                  { mes: 'MAR', progresso: '80%' },
                  { mes: 'FEV', progresso: '60%' },
                  { mes: 'JAN', progresso: '40%' },
                ].map(({ mes, progresso }) => (
                  <View key={mes} style={styles.row}>
                    <Text style={styles.monthLabel}>{mes}</Text>
                    <View style={styles.bar}>
                      <View style={[styles.barFill, { width: progresso }]} />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>RESULTADO</Text>
              <View style={styles.pieContainer}>
                <View style={styles.pieOuter}>
                  <View style={styles.pieInner}>
                    <Text style={styles.pieSubText}>Total</Text>
                    <Text style={styles.pieTotalText}>{dados.total}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.legend}>
                <View style={styles.legendItemAcertos}>
                  <Text style={styles.legendText}>ACERTOS</Text>
                  <Text style={styles.legendValue}>{dados.percentual}%</Text>
                </View>
                <View style={styles.legendItemErros}>
                  <Text style={styles.legendText}>ERROS</Text>
                  <Text style={styles.legendValue}>{porcentagemErros}%</Text>
                </View>
              </View>
            </View>

            {dados.total > 0 && (
              <Pressable style={styles.resetButton} onPress={resetarHistorico}>
                <Text style={styles.resetButtonText}>Limpar Histórico de Respostas</Text>
              </Pressable>
            )}
          </View>
        </View>
        <View style={styles.bottomBar} />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  unavailableContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 26,
  },
  unavailableText: {
    fontSize: 15,
    lineHeight: 23,
    color: '#666666',
  },
  resetButton: {
    backgroundColor: '#fde8e8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  resetButtonText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '700',
  },
  topBar: {
    height: 4,
    backgroundColor: '#0d4cff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 10,
  },
  line: {
    height: 2,
    backgroundColor: '#ececec',
    marginBottom: 24,
  },
  cards: {
    gap: 20,
  },
  card: {
    backgroundColor: '#f9f9fb',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#e8e8ed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8c8c8c',
    marginBottom: 18,
    letterSpacing: 0.5,
  },
  card1Content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  circleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0d4cff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: '#94b3ff',
  },
  circleInner: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#f9f9fb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlePercentText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0d4cff',
  },
  infoCol: {
    flex: 1,
    gap: 14,
  },
  infoBox: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e2e8',
  },
  infoNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#222222',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888888',
    marginTop: 2,
  },
  chartContainer: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  monthLabel: {
    width: 42,
    fontSize: 14,
    fontWeight: '700',
    color: '#9b9b9b',
  },
  bar: {
    flex: 1,
    height: 28,
    backgroundColor: '#ececec',
    borderRadius: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#4f6fff',
    borderRadius: 8,
  },
  pieContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pieOuter: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#506aff',
    borderWidth: 10,
    borderColor: '#1707c5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieSubText: {
    fontSize: 11,
    color: '#888888',
    fontWeight: '600',
  },
  pieTotalText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#222222',
  },
  legend: {
    gap: 10,
  },
  legendItemAcertos: {
    backgroundColor: '#506aff',
    borderRadius: 20,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  legendItemErros: {
    backgroundColor: '#1707c5',
    borderRadius: 20,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  legendText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  legendValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  bottomBar: {
    height: 60,
    backgroundColor: '#0d4cff',
    marginTop: 'auto',
  },
});
