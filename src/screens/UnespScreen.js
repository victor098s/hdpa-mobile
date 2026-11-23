import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Menu from '../components/Menu';
import LogoUnesp from '../components/LogoUnesp';

export default function UnespScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <Menu />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.main}>
          <View style={styles.headingSection}>
            <Text style={styles.headingTitle}>Escolas universitárias</Text>
          </View>

          <View style={styles.imageContainer}>
            <LogoUnesp width={220} height={70} />
          </View>

          <View style={styles.textContent}>
            <Text style={styles.paragraph}>
              A Universidade Estadual Paulista, conhecida como Unesp, é uma das maiores e mais importantes universidades
              públicas do Brasil. Criada em 1976, a instituição possui diversos campus distribuídos pelo estado de São Paulo,
              oferecendo cursos de graduação e pós-graduação em diferentes áreas do conhecimento, como Ciências Biológicas,
              Engenharia, Medicina, Ciências Humanas, Tecnologia e Artes.
            </Text>

            <Text style={styles.paragraph}>
              A Unesp destaca-se pela qualidade acadêmica, pela forte atuação em pesquisas científicas e pelo compromisso
              com o desenvolvimento social e educacional. Ao longo dos anos, a universidade consolidou-se como referência
              nacional em ensino, pesquisa e extensão universitária, formando profissionais qualificados e contribuindo
              significativamente para a produção de conhecimento científico no país.
            </Text>

            <Text style={styles.paragraph}>
              Ingressar na Unesp é um objetivo bastante desejado por estudantes de todo o Brasil, principalmente devido ao
              prestígio e à qualidade reconhecida da instituição. A concorrência em diversos cursos é elevada, especialmente
              em Medicina, Direito, Engenharia e áreas da saúde, exigindo dos candidatos grande preparação acadêmica e dedicação aos estudos.
            </Text>

            <Text style={styles.paragraph}>
              O principal processo seletivo da universidade é realizado pela Fundação para o Vestibular da Unesp, responsável
              pela aplicação de provas conhecidas pelo alto nível de exigência e pela abordagem interdisciplinar dos conteúdos.
              Além do vestibular tradicional, a universidade também utiliza o ENEM como forma complementar de ingresso, ampliando
              as oportunidades para os candidatos sem reduzir a qualidade do processo seletivo.
            </Text>

            <Text style={styles.paragraph}>
              Nesse cenário, conquistar uma vaga na Unesp representa uma grande conquista pessoal e acadêmica. Muitos estudantes dedicam anos de preparação para alcançar a aprovação, enfrentando uma rotina intensa de estudos e desafios.
              Ser aprovado significa ingressar em uma universidade pública de excelência, reconhecida pela formação
              acadêmica de alto nível e pelas oportunidades de crescimento profissional e científico.
            </Text>

            <Text style={styles.paragraph}>
              Assim, a dificuldade para ingressar na Unesp valoriza ainda mais a conquista dos estudantes aprovados. Fazer parte da
              universidade significa integrar uma instituição comprometida com a produção de conhecimento, a inovação e a formação
              de profissionais preparados para contribuir com a sociedade.
            </Text>
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  scrollContent: {
    flexGrow: 1,
  },
  main: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  headingSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#afafaf',
    paddingBottom: 8,
    marginBottom: 20,
  },
  headingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#afafaf',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  textContent: {
    gap: 16,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333333',
    textAlign: 'justify',
  },
  footer: {
    backgroundColor: '#0852f5',
    height: 70,
    marginTop: 'auto',
  },
});
