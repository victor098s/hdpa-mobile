import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Menu from '../components/Menu';

export default function PuccampScreen() {
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
              source={require('../../assets/puc.png')}
              style={styles.institutionImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textContent}>
            <Text style={styles.paragraph}>
              A Pontifícia Universidade Católica de Campinas, conhecida como PUC-CAMP, é uma das instituições privadas de
              ensino superior mais tradicionais e reconhecidas do Brasil. Fundada em 1946, a universidade possui grande destaque
              nas áreas de Ciências Humanas, Direito, Comunicação, Psicologia, Administração e Tecnologia, sendo referência
              pela qualidade de ensino e pela formação crítica e humanizada de seus estudantes.
            </Text>

            <Text style={styles.paragraph}>
              Ao longo de sua história, a PUC-CAMP consolidou-se como uma universidade de grande importância acadêmica, cultural
              e social, contribuindo para a formação de profissionais altamente qualificados e para o desenvolvimento do pensamento
              crítico e científico no país. A instituição também é conhecida por incentivar debates, pesquisas e projetos voltados às
              questões sociais, culturais e econômicas da sociedade brasileira.
            </Text>

            <Text style={styles.paragraph}>
              Ingressar na PUC-CAMP é o objetivo de muitos estudantes que buscam uma formação de excelência em uma universidade
              reconhecida nacionalmente. Apesar de ser uma instituição privada, diversos cursos apresentam alta concorrência, principalmente
              Direito, Relações Internacionais, Psicologia e Comunicação Social. Dessa forma, os candidatos precisam
              demonstrar bom desempenho acadêmico e preparação adequada para enfrentar os processos seletivos.
            </Text>

            <Text style={styles.paragraph}>
              O ingresso na universidade ocorre principalmente por meio do vestibular próprio, além da utilização da nota do ENEM
              em determinados cursos e programas de bolsas. A PUC-CAMP também oferece oportunidades de financiamento
              estudantil e bolsas de estudo, permitindo que mais estudantes tenham acesso ao ensino superior de qualidade.
              Ainda assim, a exigência acadêmica permanece elevada, refletindo o compromisso da instituição com a excelência.
            </Text>

            <Text style={styles.paragraph}>
              Nesse contexto, conquistar uma vaga na PUC-CAMP representa uma importante realização acadêmica e pessoal. Para
              muitos estudantes, estudar na universidade significa fazer parte de uma instituição tradicional, reconhecida pelo ambiente
              intelectual e pela formação diferenciada oferecida aos seus alunos. Além disso, a universidade proporciona diversas
              oportunidades de desenvolvimento profissional, científico e cultural.
            </Text>

            <Text style={styles.paragraph}>
              Assim, o ingresso na PUC-CAMP representa não apenas o acesso ao ensino superior, mas também a oportunidade de construir
              uma trajetória acadêmica sólida em uma das universidades privadas mais respeitadas do Brasil. A dedicação necessária para
              alcançar esse objetivo torna a conquista ainda mais significativa para os estudantes aprovados.
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
