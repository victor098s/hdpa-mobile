import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { COLORS } from '../constants/theme';

export default function EnemScreen() {
  return (
    // Estrutura principal da página informativa do ENEM.
    <View style={styles.container}>
      {/* Cabeçalho global e menu de seleção das universidades. */}
      <Header />
      <Menu />

      {/* Área rolável que contém todo o conteúdo institucional e informativo. */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.main}>
          {/* Título principal da seção exibida no topo da página. */}
          <View style={styles.headingSection}>
            <Text style={styles.headingTitle}>Escolas universitárias</Text>
          </View>

          {/* Identificação visual da instituição por meio de uma imagem centralizada. */}
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/enem.png')}
              style={styles.institutionImage}
              resizeMode="contain"
            />
          </View>

          {/* Texto explicativo dividido em parágrafos sobre o ENEM e seu papel no ensino superior. */}
          <View style={styles.textContent}>
            <Text style={styles.paragraph}>
              O Exame Nacional do Ensino Médio, conhecido como ENEM, é uma das principais formas de acesso ao
              ensino superior no Brasil. Criado em 1998, o exame foi inicialmente desenvolvido para avaliar o desempenho
              dos estudantes ao final da educação básica, mas ao longo dos anos passou a desempenhar um papel fundamental.
            </Text>

            <Text style={styles.paragraph}>
              Atualmente, o ENEM é utilizado como critério de seleção em programas educacionais como o Sistema de Seleção
              Unificada (SISU), o Programa Universidade para Todos (PROUNI) e o Fundo de Financiamento Estudantil (FIES), além
              de servir como forma de ingresso em diversas instituições de ensino superior. Dessa forma, o exame tornou-se uma
              oportunidade importante para milhões de estudantes que desejam ingressar na faculdade.
            </Text>

            <Text style={styles.paragraph}>
              A prova é composta por questões de Linguagens, Ciências Humanas, Ciências da Natureza, Matemática e uma redação,
              exigindo dos candidatos não apenas conhecimento dos conteúdos escolares, mas também interpretação, raciocínio
              lógico e capacidade crítica. Por isso, muitos estudantes dedicam meses ou até anos de preparação para alcançar
              uma boa pontuação, principalmente aqueles que desejam concorrer a cursos altamente disputados, como Medicina,
              Direito e Engenharia.
            </Text>

            <Text style={styles.paragraph}>
              Além da ampla concorrência, o ENEM também se destaca pelo nível de exigência da redação, que avalia competências
              relacionadas à argumentação, organização das ideias e domínio da norma padrão da língua portuguesa. A nota obtida no
              exame pode definir o acesso dos estudantes às principais universidades do país, tornando o desempenho na prova extremamente
              importante para o futuro acadêmico e profissional dos candidatos. Nesse contexto, alcançar uma boa nota no ENEM representa
              muito mais do que um simples resultado em uma prova.
            </Text>

            <Text style={styles.paragraph}>
              Para muitos estudantes, significa a oportunidade de transformar a própria realidade por meio da educação, conquistando
              acesso ao ensino superior e ampliando as possibilidades profissionais. O exame também simboliza dedicação, persistência
              e preparação diante de um processo altamente competitivo.
            </Text>

            <Text style={styles.paragraph}>
              Assim, o ENEM tornou-se um dos principais caminhos para o ingresso no ensino superior brasileiro, sendo reconhecido não
              apenas pela sua importância acadêmica, mas também pelo impacto social que proporciona ao ampliar o acesso à educação em
              todo o país.
            </Text>
          </View>
        </View>

        {/* Rodapé visual fixado ao final do conteúdo rolável. */}
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

// Folha de estilos da página, dos blocos de texto, da imagem e do rodapé.
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
