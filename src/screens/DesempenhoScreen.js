import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Circle, Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";

// Use aqui o Header da versão React Native do seu aplicativo.
// Ele não pode ser o mesmo componente HTML usado na versão web.
import Header from "../components/Header";

const COLORS = {
  page: "#f6f6f6",
  topBar: "#ececec",
  card: "#efefef",
  blue: "#0d4cff",
  blueLight: "#4f73f8",
  blueMedium: "#506aff",
  blueDark: "#1707c5",
  gray: "#c7c7c7",
  title: "#ababab",
  text: "#707070",
  muted: "#b3b3b3",
};

function DonutChart({ percentage, size = 95, strokeWidth = 11 }) {
  const radius = (size - strokeWidth) / 2;
  const progress = Math.max(0, Math.min(100, Number(percentage) || 0));
  const center = size / 2;
  const angle = (progress / 100) * 360;
  const radians = ((angle - 90) * Math.PI) / 180;
  const endX = center + radius * Math.cos(radians);
  const endY = center + radius * Math.sin(radians);
  const largeArc = angle > 180 ? 1 : 0;
  const progressArc =
    progress >= 100
      ? null
      : progress > 0
        ? `M ${center} ${center - radius} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`
        : null;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.gray}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {progress >= 100 ? (
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={COLORS.blueMedium}
            strokeWidth={strokeWidth}
            fill="none"
          />
        ) : progressArc ? (
          <Path
            d={progressArc}
            stroke={COLORS.blueMedium}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            fill="none"
          />
        ) : null}
      </Svg>
      <View style={styles.donutLabel}>
        <Text style={styles.donutPercentage}>{percentage}%</Text>
      </View>
    </View>
  );
}

function PieChart({ errors, size = 96 }) {
  const errorPercentage = Math.max(0, Math.min(100, Number(errors) || 0));
  const angle = (errorPercentage / 100) * 360;
  const radius = size / 2;
  const center = radius;

  // Cria o setor correspondente aos erros. O restante representa os acertos.
  const point = (degrees) => {
    const radians = ((degrees - 90) * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians),
    };
  };

  const start = point(0);
  const end = point(angle);
  const largeArc = angle > 180 ? 1 : 0;
  const errorPath =
    errorPercentage <= 0
      ? ""
      : errorPercentage >= 100
        ? `M ${center} ${center} L ${center} 0 A ${radius} ${radius} 0 1 1 ${center - 0.001} 0 Z`
        : `M ${center} ${center} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={center} cy={center} r={radius} fill={COLORS.blueMedium} />
      {errorPath ? <Path d={errorPath} fill={COLORS.blueDark} /> : null}
    </Svg>
  );
}

function InfoBox({ value, label }) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoValue}>{value}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
  );
}

function EvolutionRow({ month, width }) {
  return (
    <View style={styles.evolutionRow}>
      <Text style={styles.month}>{month}</Text>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width }]} />
      </View>
    </View>
  );
}

export default function Desempenho() {
  const isFocused = useIsFocused();
  const [dados, setDados] = useState({
    total: 0,
    acertos: 0,
    erros: 0,
    percentual: "0.00",
  });

  const { width: screenWidth } = useWindowDimensions();
  const isNarrow = screenWidth < 600;
  const cardWidth = isNarrow ? Math.min(screenWidth - 64, 260) : 240;

  useEffect(() => {
    async function carregarDesempenho() {
      try {
        const respostasSalvas = await AsyncStorage.getItem("respostas");
        const respostas = respostasSalvas ? JSON.parse(respostasSalvas) : [];

        const total = Array.isArray(respostas) ? respostas.length : 0;
        const acertos = Array.isArray(respostas)
          ? respostas.filter((resposta) => resposta.acertou).length
          : 0;
        const erros = total - acertos;
        const percentual =
          total > 0 ? ((acertos / total) * 100).toFixed(2) : "0.00";

        setDados({ total, acertos, erros, percentual });
      } catch (error) {
        console.error("Não foi possível carregar os dados de desempenho:", error);
        setDados({ total: 0, acertos: 0, erros: 0, percentual: "0.00" });
      }
    }

    if (isFocused) carregarDesempenho();
  }, [isFocused]);

  const porcentagemErros =
    dados.total > 0
      ? ((dados.erros / dados.total) * 100).toFixed(0)
      : "0";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header />

        <View style={styles.topBar} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.pageTitle}>Meu Desempenho</Text>
            <View style={styles.divider} />

            <View style={styles.cards}>
              {/* CARD 1 — TAXA DE ACERTOS */}
              <View style={[styles.card, { width: cardWidth }]}>
                <Text style={styles.cardTitle}>TAXA DE ACERTOS</Text>

                <View style={styles.card1Content}>
                  <DonutChart percentage={dados.percentual} />

                  <View style={styles.info}>
                    <InfoBox value={dados.total} label="Questões Respondidas" />
                    <InfoBox value={dados.acertos} label="Acertos" />
                  </View>
                </View>
              </View>

              {/* CARD 2 — GRÁFICO DE EVOLUÇÃO */}
              <View style={[styles.card, { width: cardWidth }]}>
                <Text style={styles.cardTitle}>GRÁFICO DE EVOLUÇÃO</Text>

                <View style={styles.chart}>
                  <EvolutionRow month="ABR" width="100%" />
                  <EvolutionRow month="MAR" width="80%" />
                  <EvolutionRow month="FEV" width="60%" />
                  <EvolutionRow month="JAN" width="40%" />
                </View>
              </View>

              {/* CARD 3 — RESULTADO */}
              <View style={[styles.card, { width: cardWidth }]}>
                <Text style={styles.cardTitle}>RESULTADO</Text>

                <View style={styles.pieContainer}>
                  <PieChart errors={porcentagemErros} />
                </View>

                <View style={styles.legend}>
                  <View style={[styles.legendItem, styles.correctLegend]}>
                    <Text style={styles.legendText}>ACERTOS</Text>
                    <Text style={styles.legendText}>{dados.percentual}%</Text>
                  </View>

                  <View style={[styles.legendItem, styles.errorLegend]}>
                    <Text style={styles.legendText}>ERROS</Text>
                    <Text style={styles.legendText}>{porcentagemErros}%</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <LinearGradient
            colors={["#0d4cff", "#2b63ff"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.bottomBar}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.page,
  },
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: COLORS.page,
  },
  topBar: {
    height: 38,
    backgroundColor: COLORS.topBar,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  pageTitle: {
    color: COLORS.title,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 15,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#d5d5d5",
    marginBottom: 60,
  },
  cards: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 30,
    marginTop: 20,
  },
  card: {
    height: 200,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 14,
    overflow: "hidden",
  },
  cardTitle: {
    color: COLORS.blueMedium,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 15,
  },
  card1Content: {
    height: 140,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  donutLabel: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  donutPercentage: {
    color: COLORS.blue,
    fontSize: 13,
    fontWeight: "700",
  },
  info: {
    width: 80,
    flexDirection: "column",
    gap: 16,
  },
  infoBox: {
    width: 80,
    height: 40,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
  },
  infoLabel: {
    fontSize: 7,
    color: COLORS.muted,
    textAlign: "center",
  },
  chart: {
    flexDirection: "column",
    gap: 8,
  },
  evolutionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  month: {
    width: 35,
    fontSize: 12,
    fontWeight: "700",
    color: "#a4a4a4",
  },
  barBackground: {
    width: 145,
    height: 28,
  },
  barFill: {
    height: "100%",
    backgroundColor: COLORS.blueLight,
    borderRadius: 4,
  },
  pieContainer: {
    width: 96,
    height: 96,
    alignSelf: "center",
    marginBottom: 0,
  },
  legend: {
    width: "100%",
  },
  legendItem: {
    width: 150,
    height: 18,
    marginVertical: 1,
    alignSelf: "center",
    borderRadius: 20,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  correctLegend: {
    backgroundColor: COLORS.blueMedium,
  },
  errorLegend: {
    backgroundColor: "#1707c5",
  },
  legendText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "700",
  },
  bottomBar: {
    width: "100%",
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
});
