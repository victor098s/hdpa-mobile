import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import Header from '../components/Header';
import LogoUnesp from '../components/LogoUnesp';
import { COLORS } from '../constants/theme';
import Svg, { Circle, Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Define um tamanho máximo e mínimo para o gráfico circular conforme a largura da tela.
const PIE_SIZE = Math.min(280, Math.max(200, SCREEN_WIDTH - 80));

export default function HomeScreen() {
  // Navegação e referências responsáveis pelo controle da página e do carrossel.
  const navigation = useNavigation();
  const carouselScrollRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  // Lista centralizada das instituições exibidas nos cards da tela inicial.
  const universityCards = [
    { nome: 'ENEM', image: require('../../assets/enem.png'), route: 'Enem' },
    { nome: 'USP', image: require('../../assets/usp.png'), route: 'Usp' },
    { nome: 'UNICAMP', image: require('../../assets/unicamp.png'), route: 'Unicamp' },
    { nome: 'UNESP', isSvg: true, route: 'Unesp' },
    { nome: 'PUC', image: require('../../assets/puc.png'), route: 'Puccamp' },
  ];

  // Move o carrossel entre os cards sem ultrapassar o primeiro ou o último item disponível.
  const handleScroll = (direction) => {
    const cardWidth = 160;
    const nextIndex =
      direction === 'next'
        ? Math.min(scrollIndex + 1, universityCards.length - 2)
        : Math.max(scrollIndex - 1, 0);

    setScrollIndex(nextIndex);
    carouselScrollRef.current?.scrollTo({
      x: nextIndex * cardWidth,
      animated: true,
    });
  };

  return (
    // Estrutura principal da tela inicial da aplicação.
    <View style={styles.container}>
      <Header />

      {/* Área rolável que reúne banner, universidades, gráficos e avaliações. */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner Hero */}
        <View style={styles.heroSection}>
          <Image
            source={require('../../assets/banner2.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* Seção Escolas Universitárias */}
        <View style={[styles.section, SCREEN_WIDTH > 1200 && styles.wideSection]}>
          <Text style={styles.sectionTitle}>Escolas Universitárias</Text>

          {/* Carrossel com botões laterais e navegação para a página de cada instituição. */}
          <View style={styles.carouselContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.arrowButton,
                pressed && styles.arrowButtonPressed,
              ]}
              onPress={() => handleScroll('prev')}
            >
              <ChevronLeft size={22} color={COLORS.primary} />
            </Pressable>

            <ScrollView
              ref={carouselScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselTrack}
              snapToInterval={160}
              decelerationRate="fast"
            >
              {universityCards.map((uni) => (
                <Pressable
                  key={uni.nome}
                  style={({ pressed }) => [
                    styles.uniCard,
                    pressed && styles.uniCardPressed,
                  ]}
                  onPress={() => navigation.navigate(uni.route)}
                >
                  {uni.isSvg ? (
                    <LogoUnesp width={120} height={42} />
                  ) : (
                    <Image
                      source={uni.image}
                      style={styles.uniLogo}
                      resizeMode="contain"
                    />
                  )}
                </Pressable>
              ))}
            </ScrollView>

            <Pressable
              style={({ pressed }) => [
                styles.arrowButton,
                pressed && styles.arrowButtonPressed,
              ]}
              onPress={() => handleScroll('next')}
            >
              <ChevronRight size={22} color={COLORS.primary} />
            </Pressable>
          </View>
        </View>

        {/* Resumo visual do desempenho mensal e da evolução dos estudos. */}
        <View style={[styles.section, SCREEN_WIDTH > 1200 && styles.wideSection]}>
          <Text style={styles.sectionTitle}>Visão Geral</Text>
          <View style={[styles.overview, SCREEN_WIDTH >= 900 && styles.overviewWide]}>
            <View style={[styles.overviewCard, SCREEN_WIDTH >= 900 && styles.overviewCardWide]}>
              <Text style={styles.cardHeader}>ABRIL</Text>
              <View style={styles.pieContainer}>
                <Svg width={PIE_SIZE} height={PIE_SIZE} viewBox="0 0 280 280" style={styles.pieChart}>
                  <Circle cx="140" cy="140" r="140" fill="#4d6dff" />
                  <Path d="M140 140 L140 0 A140 140 0 0 1 242.2 44.2 Z" fill="#1b2cff" />
                </Svg>
              </View>
              <View style={styles.progressArea}>
                <View style={[styles.progressBar, styles.progressCorrect]}>
                  <Text style={styles.progressText}>ACERTOS</Text>
                  <Text style={styles.progressValue}>87%</Text>
                </View>
                <View style={[styles.progressBar, styles.progressWrong]}>
                  <Text style={styles.progressText}>ERROS</Text>
                  <Text style={styles.progressValue}>13%</Text>
                </View>
              </View>
            </View>
            <View style={[styles.overviewCard, SCREEN_WIDTH >= 900 && styles.overviewCardWide]}>
            <Text style={styles.cardHeader}>GRÁFICO DE EVOLUÇÃO</Text>
            <View style={styles.evolutionChart}>
              {[
                { mes: 'ABR', progresso: '100%' },
                { mes: 'MAR', progresso: '85%' },
                { mes: 'FEV', progresso: '66%' },
                { mes: 'JAN', progresso: '42%' },
              ].map(({ mes, progresso }) => (
                <View key={mes} style={styles.barRow}>
                  <Text style={styles.monthLabel}>{mes}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: progresso }]} />
                  </View>
                </View>
              ))}
            </View>
            </View>
          </View>
        </View>

        {/* Área de avaliação publicada por um usuário da plataforma. */}
        <View style={[styles.section, SCREEN_WIDTH > 1200 && styles.wideSection]}>
          <Text style={styles.sectionTitle}>Avaliações</Text>
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image source={require('../../assets/tupi.png')} style={styles.reviewAvatar} />
              <View style={styles.reviewMeta}>
                <Text style={styles.reviewerName}>ANTÔNIO TUPINAMBÁ</Text>
                <Text style={styles.reviewStars}>★★★★★</Text>
              </View>
            </View>
            <Text style={styles.reviewBody}>
              Usei recentemente um site de questões de vestibulares focado em Linguagens e tive uma experiência muito positiva. A plataforma é bem organizada, com exercícios atualizados e separados por temas.
            </Text>
          </View>
        </View>
        {/* Rodapé Visual */}
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

// Folha de estilos dos blocos, carrossel, gráficos, avaliações e rodapé.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  scrollContent: {
    paddingBottom: 0,
  },
  heroSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  heroImage: {
    width: '100%',
    height: 160,
    borderRadius: 24,
  },
  section: {
    marginTop: 26,
    paddingHorizontal: 16,
  },
  wideSection: {
    paddingHorizontal: 60,
  },
  unavailableText: {
    color: '#777777',
    fontSize: 14,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#8f8f8f',
    marginBottom: 16,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrowButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowButtonPressed: {
    backgroundColor: '#e0e0e0',
  },
  carouselTrack: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
  },
  uniCard: {
    width: 145,
    height: 80,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  uniCardPressed: {
    transform: [{ scale: 0.97 }],
    backgroundColor: '#f8f8f8',
  },
  uniLogo: {
    width: 110,
    height: 48,
  },
  overview: {
    flexDirection: 'column',
    gap: 24,
  },
  overviewWide: {
    flexDirection: 'row',
    gap: 32,
  },
  overviewCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 40,
    padding: SCREEN_WIDTH >= 900 ? 40 : 20,
    paddingBottom: SCREEN_WIDTH >= 900 ? 40 : 28,
    minHeight: SCREEN_WIDTH >= 900 ? 560 : undefined,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  overviewCardWide: {
    flex: 1,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#9d9d9d',
    marginBottom: 20,
  },
  pieContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  pieChart: {
    maxWidth: '100%',
  },
  progressArea: {
    gap: 12,
  },
  progressBar: {
    height: 44,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  progressCorrect: {
    backgroundColor: '#466dff',
  },
  progressWrong: {
    backgroundColor: '#1707c5',
  },
  progressText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  progressValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  evolutionChart: {
    gap: 28,
    paddingVertical: 14,
    marginTop: 20,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  monthLabel: {
    width: 60,
    fontSize: 20,
    fontWeight: '700',
    color: '#9b9b9b',
  },
  barTrack: {
    flex: 1,
    height: 42,
    backgroundColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#4f6fff',
    borderRadius: 10,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  reviewAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  reviewMeta: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#777777',
    marginBottom: 4,
  },
  reviewStars: {
    fontSize: 18,
    color: COLORS.starYellow,
    letterSpacing: 2,
  },
  reviewBody: {
    fontSize: 14,
    lineHeight: 22,
    color: '#888888',
  },
  footer: {
    height: 60,
    backgroundColor: COLORS.primary,
    marginTop: 36,
  },
});
