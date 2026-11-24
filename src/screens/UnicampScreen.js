import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Menu from '../components/Menu';

export default function UnicampScreen() {
  return (
    // Estrutura principal da página informativa da Unicamp.
    <View style={styles.container}>
      {/* Cabeçalho global e menu de navegação entre instituições. */}
      <Header />
      <Menu />

      {/* Área rolável que reúne o conteúdo institucional da universidade. */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.main}>
          {/* Título principal da seção de universidades. */}
          <View style={styles.headingSection}>
            <Text style={styles.headingTitle}>Escolas universitárias</Text>
          </View>

          {/* Logotipo da Unicamp centralizado no início do conteúdo. */}
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/unicamp.png')}
              style={styles.institutionImage}
              resizeMode="contain"
            />
          </View>

          {/* Texto dividido em parágrafos sobre história, vestibular e ingresso na Unicamp. */}
          <View style={styles.textContent}>
            <Text style={styles.paragraph}>
              A Universidade Estadual de Campinas, conhecida como Unicamp, é uma das instituições de ensino superior mais
              prestigiadas do Brasil, destacando-se principalmente pela excelência em pesquisa científica, inovação tecnológica e
              qualidade acadêmica. Fundada em 1966, a universidade está localizada em Campinas, no estado de São Paulo,
              e oferece diversos cursos de graduação, pós-graduação e programas de pesquisa em áreas como Saúde, Engenharia,
              Ciências Exatas, Humanas e Artes.
            </Text>

            <Text style={styles.paragraph}>
              Ao longo de sua trajetória, a Unicamp consolidou-se como referência nacional e internacional em produção
              científica, sendo responsável por importantes pesquisas e avanços tecnológicos que impactam diretamente a
              sociedade. A universidade também possui forte ligação com centros de inovação e empresas, incentivando o
              desenvolvimento científico, empreendedor e tecnológico de seus estudantes e pesquisadores.
            </Text>

            <Text style={styles.paragraph}>
              Ingressar na Unicamp é um grande objetivo para milhares de estudantes devido ao reconhecimento e à qualidade
              da instituição. Entretanto, o alto nível acadêmico da universidade está diretamente relacionado à intensa
              concorrência de seus cursos, especialmente Medicina, Engenharia, Ciência da Computação e Arquitetura, que
              apresentam elevada relação candidato por vaga. Esse cenário exige dos candidatos uma preparação aprofundada,
              domínio dos conteúdos escolares e grande capacidade de interpretação e raciocínio.
            </Text>

            <Text style={styles.paragraph}>
              O principal processo seletivo da universidade é realizado pela Comissão Permanente para os Vestibulares, responsável por
              aplicar provas conhecidas pelo alto nível de dificuldade e pela valorização do pensamento crítico e interdisciplinaridade.
              Além do vestibular tradicional, a Unicamp também disponibiliza formas alternativas de ingresso, incluindo vagas destinadas
              ao ENEM e programas de inclusão social, ampliando o acesso ao ensino superior sem diminuir o rigor acadêmico exigido.
            </Text>

            <Text style={styles.paragraph}>
              Nesse contexto, conquistar uma vaga na Unicamp representa muito mais do que apenas aprovação em um vestibular.
              Significa alcançar um objetivo construído com esforço, disciplina e dedicação aos estudos. Para muitos estudantes,
              essa conquista simboliza a realização de um sonho e a oportunidade de estudar em uma das universidades mais
              respeitadas do país, reconhecida por estimular a pesquisa, a criatividade e a formação de profissionais altamente
              qualificados.
            </Text>

            <Text style={styles.paragraph}>
              Assim, a dificuldade para ingressar na Unicamp não deve ser vista apenas como um desafio, mas também como um elemento
              que valoriza ainda mais a conquista dos estudantes aprovados. Fazer parte da universidade significa estar preparado para
              enfrentar uma formação acadêmica exigente e aproveitar as inúmeras oportunidades oferecidas pela instituição.
            </Text>
          </View>
        </View>

        {/* Rodapé visual exibido ao final da página. */}
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

// Folha de estilos da página, dos textos, da imagem e do rodapé.
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
    width: 220,
    height: 90,
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
