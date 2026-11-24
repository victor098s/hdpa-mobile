import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import { useIsFocused } from "@react-navigation/native";
import Header from "../components/Header";
import { getRespostas } from "../utils/auth";

const AZUL = "#506aff";
const AZUL_ESCURO = "#1707c5";

function PieChart({ erros }) {
  const size = 110;
  const center = size / 2;
  const radius = center;
  const angle = (erros / 100) * 360;
  const radians = ((angle - 90) * Math.PI) / 180;
  const endX = center + radius * Math.cos(radians);
  const endY = center + radius * Math.sin(radians);
  const largeArc = angle > 180 ? 1 : 0;

  if (erros <= 0) {
    return <Svg width={size} height={size}><Circle cx={center} cy={center} r={radius} fill={AZUL} /></Svg>;
  }
  if (erros >= 100) {
    return <Svg width={size} height={size}><Circle cx={center} cy={center} r={radius} fill={AZUL_ESCURO} /></Svg>;
  }

  return (
    <Svg width={size} height={size}>
      <Circle cx={center} cy={center} r={radius} fill={AZUL} />
      <Path
        d={`M ${center} ${center} L ${center} 0 A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`}
        fill={AZUL_ESCURO}
      />
    </Svg>
  );
}

function AccuracyRing({ percentual }) {
  const size = 95;
  const center = size / 2;
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, Number(percentual)));
  return (
    <View style={styles.accuracyRing}>
      <Svg width={size} height={size}>
        <Circle cx={center} cy={center} r={radius} stroke="#c7c7c7" strokeWidth={6} fill="none" />
        {progress > 0 && (
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#506aff"
            strokeWidth={6}
            fill="none"
            strokeDasharray={`${(progress / 100) * circumference} ${circumference}`}
            rotation={-90}
            origin={`${center}, ${center}`}
          />
        )}
      </Svg>
      <Text style={styles.circlePercentText}>{percentual}%</Text>
    </View>
  );
}

function FooterBar() {
  return (
    <View style={styles.bottomBar}>
      <Svg width="100%" height="90" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="footerGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#0d4cff" />
            <Stop offset="1" stopColor="#2b63ff" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="90" fill="url(#footerGradient)" />
      </Svg>
    </View>
  );
}

export default function DesempenhoScreen() {
  const isFocused = useIsFocused();
  const { width } = useWindowDimensions();
  const emGrade = width > 1000;
  const [dados, setDados] = useState({ total: 0, acertos: 0, erros: 0, percentual: "0.00" });

  const carregarDesempenho = async () => {
    try {
      const respostas = await getRespostas();
      const total = respostas.length;
      const acertos = respostas.filter((resposta) => resposta.acertou).length;
      const erros = total - acertos;
      const percentual = total > 0 ? ((acertos / total) * 100).toFixed(2) : "0.00";
      setDados({ total, acertos, erros, percentual });
    } catch {
      setDados({ total: 0, acertos: 0, erros: 0, percentual: "0.00" });
    }
  };

  useEffect(() => {
    if (isFocused) carregarDesempenho();
  }, [isFocused]);

  const porcentagemErros = dados.total > 0 ? ((dados.erros / dados.total) * 100).toFixed(0) : "0";
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.topBar} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.content, !emGrade && styles.contentMobile, emGrade && styles.contentWide]}>
          <Text style={styles.title}>Meu Desempenho</Text>
          <View style={styles.line} />
          <View style={[styles.cards, emGrade && styles.cardsWide]}>
            <View style={[styles.card, emGrade && styles.cardWide]}>
              <Text style={styles.cardTitle}>TAXA DE ACERTOS</Text>
              <View style={styles.card1Content}>
                <AccuracyRing percentual={dados.percentual} />
                <View style={styles.infoCol}>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoNumber}>{dados.total}</Text>
                    <Text style={styles.infoLabel}>Questões Respondidas</Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoNumber}>{dados.acertos}</Text>
                    <Text style={styles.infoLabel}>Acertos</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={[styles.card, emGrade && styles.cardWide]}>
              <Text style={styles.cardTitle}>GRÁFICO DE EVOLUÇÃO</Text>
              <View style={styles.chartContainer}>
                {[
                  { mes: "ABR", progresso: "100%" },
                  { mes: "MAR", progresso: "80%" },
                  { mes: "FEV", progresso: "60%" },
                  { mes: "JAN", progresso: "40%" },
                ].map(({ mes, progresso }) => (
                  <View key={mes} style={styles.row}>
                    <Text style={styles.monthLabel}>{mes}</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: progresso }]} />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.card, emGrade && styles.cardWide]}>
              <Text style={styles.cardTitle}>RESULTADO</Text>
              <View style={styles.pieContainer}>
                <PieChart erros={Number(porcentagemErros)} />
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

          </View>
        </View>
        <FooterBar />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f6f6" },
  topBar: { height: 38, backgroundColor: "#ececec" },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, width: "100%", maxWidth: 1200, alignSelf: "center", paddingHorizontal: 20, paddingTop: 50, paddingBottom: 50 },
  contentMobile: { paddingTop: 50, paddingBottom: 50 },
  contentWide: { paddingHorizontal: 50, paddingTop: 70, paddingBottom: 70 },
  title: { fontSize: 28, fontWeight: "700", color: "#ababab", marginBottom: 15 },
  line: { height: 1, backgroundColor: "#d5d5d5", marginBottom: 60 },
  cards: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start", gap: 30, marginTop: 20 },
  cardsWide: { flexWrap: "nowrap" },
  card: { width: 260, height: 210, backgroundColor: "#efefef", borderRadius: 20, padding: 14, overflow: "hidden" },
  cardWide: { width: 260, flexGrow: 0, flexShrink: 0 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#0d4cff", marginBottom: 15 },
  cardTitleMobile: { fontSize: 14, marginBottom: 15 },
  card1Content: { height: 140, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  accuracyRing: { width: 95, height: 95, alignItems: "center", justifyContent: "center" },
  circlePercentText: { position: "absolute", alignSelf: "center", top: 40, fontSize: 13, fontWeight: "700", color: "#506aff" },
  infoCol: { width: 80, gap: 16 },
  infoBox: { width: 80, height: 40, backgroundColor: "#f8f8f8", borderRadius: 10, alignItems: "center", justifyContent: "center" },
  infoNumber: { fontSize: 12, color: "#707070" },
  infoLabel: { fontSize: 7, color: "#b3b3b3", textAlign: "center" },
  chartContainer: { gap: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  monthLabel: { width: 35, fontSize: 12, fontWeight: "700", color: "#a4a4a4" },
  barTrack: { width: 145, height: 28 },
  barFill: { height: "100%", backgroundColor: "#4f73f8", borderRadius: 4 },
  pieContainer: { alignItems: "center", marginBottom: 10 },
  legend: { width: "100%" },
  legendItemAcertos: { width: 150, alignSelf: "center", backgroundColor: "#506aff", borderRadius: 20, height: 18, marginVertical: 2.5, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 8 },
  legendItemErros: { width: 150, alignSelf: "center", backgroundColor: "#1707c5", borderRadius: 20, height: 18, marginVertical: 2.5, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 8 },
  legendText: { color: "#ffffff", fontSize: 9, fontWeight: "700" },
  legendValue: { color: "#ffffff", fontSize: 9, fontWeight: "800" },
  bottomBar: { width: "100%", height: 90, marginTop: "auto", shadowColor: "#0d4cff", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
});
