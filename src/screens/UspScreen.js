import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Menu from '../components/Menu';

export default function UspScreen() {
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
            <Image
              source={require('../../assets/usp.png')}
              style={styles.institutionImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textContent}>
            <Text style={styles.paragraph}>
              A Universidade de São Paulo (USP) é amplamente reconhecida como uma das maiores e mais importantes instituições de ensino superior do Brasil e
              da América Latina. Desde sua fundação, em 1934, a universidade tem desempenhado um papel fundamental no desenvolvimento científico, tecnológico, cultural e social do país,
              consolidando-se como referência em excelência acadêmica e pesquisa.
            </Text>

            <Text style={styles.paragraph}>
              Ao longo de décadas, a USP construiu uma reputação de prestígio internacional graças à qualidade de seus cursos, à competência de seu corpo docente e à relevância de suas pesquisas. A universidade
              reúne diversas faculdades, institutos e centros de pesquisa distribuídos em diferentes cidades do estado de São Paulo, formando milhares de profissionais todos os anos. Muitos de seus ex-alunos tornaram-se líderes
              empresariais, cientistas, médicos, engenheiros, advogados, políticos e pesquisadores
              de destaque, contribuindo significativamente para o desenvolvimento do Brasil e do mundo.
            </Text>

            <Text style={styles.paragraph}>
              Uma das maiores conquistas da USP é sua expressiva produção científica. A universidade é responsável por uma parcela considerável das pesquisas acadêmicas realizadas
              no país, desenvolvendo estudos que impactam áreas como medicina, tecnologia, sustentabilidade, inteligência artificial, agricultura, educação e ciências sociais. Seus laboratórios e
              centros de pesquisa são reconhecidos internacionalmente, atraindo parcerias com
              instituições de diversos países e fortalecendo a presença da ciência brasileira no cenário global.
            </Text>

            <Text style={styles.paragraph}>
              A fama da USP também está relacionada à sua capacidade de inovação e à qualidade da formação oferecida aos estudantes. Frequentemente presente entre as melhores universidades latino-americanas
              em rankings internacionais, a instituição é vista como um símbolo de excelência educacional. Seu diploma possui grande reconhecimento no mercado de trabalho,
              sendo valorizado por empresas, órgãos públicos e instituições de pesquisa.
            </Text>

            <Text style={styles.paragraph}>
              Apesar de todo esse prestígio, ingressar na USP é um desafio para milhares de estudantes. O processo seletivo é conhecido por ser um dos mais concorridos do país, exigindo alto desempenho acadêmico e
              intensa preparação. Todos os anos, candidatos de diferentes regiões do Brasil disputam vagas em cursos renomados, especialmente em áreas como Medicina, Direito, Engenharia, Psicologia, Arquitetura
              e Relações Internacionais. A concorrência elevada faz com
              que os vestibulares da universidade sejam considerados um verdadeiro teste de conhecimento, raciocínio e dedicação.
            </Text>

            <Text style={styles.paragraph}>
              A principal forma de ingresso ocorre por meio da Fuvest, vestibular tradicional da universidade, além da seleção por meio das notas do ENEM através do SiSU.
              Em ambos os casos, os candidatos precisam demonstrar domínio dos conteúdos do ensino médio e capacidade de interpretar, analisar e resolver problemas complexos.
              Para muitos estudantes, conquistar uma vaga na USP representa anos de preparação, disciplina e esforço contínuo.
            </Text>

            <Text style={styles.paragraph}>
              Além do rigor acadêmico para entrar na universidade, os alunos também enfrentam uma rotina exigente durante a graduação. Os cursos são reconhecidos por seu alto
              nível de qualidade e profundidade, incentivando o desenvolvimento intelectual, a pesquisa científica e a participação em projetos de extensão. Essa exigência contribui para a
              formação de profissionais altamente qualificados e preparados para atuar em diferentes áreas do conhecimento.
            </Text>

            <Text style={styles.paragraph}>
              Portanto, a USP não é apenas uma universidade de grande tradição, mas uma instituição que simboliza excelência, inovação e produção de conhecimento.
              Suas conquistas científicas, seu reconhecimento internacional e a dificuldade de ingresso reforçam sua posição como uma das universidades mais respeitadas do continente.
              Para milhares de jovens brasileiros, estudar na USP representa a realização de um sonho acadêmico
              e a oportunidade de fazer parte de uma comunidade que contribui ativamente para o avanço da sociedade.
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
  institutionImage: {
    width: 200,
    height: 80,
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
