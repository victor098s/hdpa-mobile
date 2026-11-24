import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Circle,
  XCircle,
  Filter,
} from 'lucide-react-native';
import Header from '../components/Header';
import {
  agruparQuestoes,
  opcoesUnicas,
} from '../utils/questions';
import { getTokenAsync, salvarResposta } from '../utils/auth';
import { ENDPOINTS } from '../constants/config';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function BQScreen() {
  // Obtém a ação de logout para encerrar sessões que falham na autorização.
  const { logout } = useAuth();

  // Dados da API e estados gerais usados por toda a tela.
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tela, setTela] = useState('filtros'); // 'filtros' | 'questoes'
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostas, setRespostas] = useState({});

  // Filtros ativos
  const [filtros, setFiltros] = useState({
    tema: '',
    banca: 'Todos',
    dificuldade: 'Todas',
    assunto1: '',
    assunto2: '',
    assunto3: '',
  });

  // Modal para seleção de Tema e Assuntos em mobile
  const [modalSeletor, setModalSeletor] = useState({
    visivel: false,
    campo: null,
    titulo: '',
    opcoes: [],
  });

  // Ao montar a tela, busca o banco de questões e valida o token do usuário.
  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        const token = await getTokenAsync();
        const resposta = await fetch(ENDPOINTS.POR_VEST, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!resposta.ok) {
          if (resposta.status === 401) {
            await logout();
          }
          throw new Error(resposta.status === 401
            ? 'Sessão expirada. Faça login novamente.'
            : 'Não foi possível buscar as questões no servidor.');
        }
        const lista = await resposta.json();
        if (!Array.isArray(lista)) {
          throw new Error('A API retornou um formato de questões inválido.');
        }
        setDados(lista);
      } catch (err) {
        setErro(err.message || 'Erro ao carregar banco de questões.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  // Extrai opções únicas para preencher disciplinas, bancas e níveis de relevância.
  const temas = useMemo(() => opcoesUnicas(dados, 'nome_do_tema'), [dados]);
  const bancas = useMemo(
    () => ['Todos', ...opcoesUnicas(dados, 'nome_do_vestibular')],
    [dados]
  );
  const relevancias = useMemo(
    () => ['Todas', ...opcoesUnicas(dados, 'relevancia_da_questao')],
    [dados]
  );

  const assuntos = useMemo(() => {
    if (!filtros.tema) return [];
    const dadosFiltrados = dados.filter(
      (item) => item.nome_do_tema === filtros.tema
    );
    return opcoesUnicas(dadosFiltrados, 'nome_topico');
  }, [dados, filtros.tema]);

  // Combina todos os filtros ativos e agrupa as respostas no formato usado pela tela.
  const questoesFiltradas = useMemo(() => {
    const assuntoSelecionado = [
      filtros.assunto1,
      filtros.assunto2,
      filtros.assunto3,
    ].filter(Boolean);

    const linhasFiltradas = dados.filter((item) => {
      const temaOk = !filtros.tema || item.nome_do_tema === filtros.tema;
      const bancaOk =
        filtros.banca === 'Todos' || item.nome_do_vestibular === filtros.banca;
      const dificuldadeOk =
        filtros.dificuldade === 'Todas' ||
        item.relevancia_da_questao === filtros.dificuldade;
      const assuntoOk =
        assuntoSelecionado.length === 0 ||
        assuntoSelecionado.includes(item.nome_topico);

      return temaOk && bancaOk && dificuldadeOk && assuntoOk;
    });

    return agruparQuestoes(linhasFiltradas);
  }, [dados, filtros]);

  const questaoAtual = questoesFiltradas[indiceAtual];
  const respostaAtual = questaoAtual ? respostas[questaoAtual.id] : null;

  // Atualiza um campo específico sem sobrescrever os demais filtros.
  function atualizarFiltro(campo, valor) {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  }

  // Configura e abre o modal usado pelos seletores de tema e assunto.
  function abrirSeletor(campo, titulo, opcoes) {
    setModalSeletor({
      visivel: true,
      campo,
      titulo,
      opcoes,
    });
  }

  // Aplica a escolha feita no modal ou limpa o filtro selecionado.
  function selecionarOpcao(valor) {
    if (modalSeletor.campo) {
      atualizarFiltro(modalSeletor.campo, valor);
    }
    setModalSeletor({ visivel: false, campo: null, titulo: '', opcoes: [] });
  }

  // Reinicia a posição e as respostas antes de abrir a tela de resolução.
  function filtrarQuestoes() {
    setIndiceAtual(0);
    setRespostas({});
    setTela('questoes');
  }

  // Guarda a alternativa selecionada e registra o resultado no armazenamento da aplicação.
  async function responder(questaoId, letra, alternativaCorreta) {
    setRespostas((prev) => ({ ...prev, [questaoId]: letra }));
    await salvarResposta({ questaoId, letra, acertou: alternativaCorreta });
  }

  // Navega pelas questões dentro dos limites da lista filtrada.
  function proximaQuestao() {
    setIndiceAtual((atual) =>
      Math.min(atual + 1, questoesFiltradas.length - 1)
    );
  }

  function questaoAnterior() {
    setIndiceAtual((atual) => Math.max(atual - 1, 0));
  }

  return (
    // Estrutura principal da tela, incluindo cabeçalho e conteúdo rolável.
    <View style={styles.container}>
      <Header />

      {/* Permite alternar entre configuração dos filtros e resolução das questões. */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tela === 'filtros' ? (
          /* ========================================================= */
          /* TELA 1: FILTROS DE QUESTÕES                              */
          /* ========================================================= */
          <View style={styles.content}>
            <View style={styles.heading}>
              <Text style={styles.headingTitle}>Banco de Questões</Text>
              <Text style={styles.headingDesc}>
                Aqui você encontra todas as questões disponíveis na plataforma
                para praticar quando quiser. Explore por disciplinas, assuntos
                ou dificuldade e responda no seu ritmo.
              </Text>
            </View>

            <View style={styles.filterPanel}>
              {/* Filtro de Temas/Disciplina */}
              <View style={styles.fieldSection}>
                <Text style={styles.fieldLabel}>TEMAS</Text>
                <Text style={styles.fieldHint}>
                  Selecione uma disciplina para ativar os filtros de assunto.
                </Text>
                <Pressable
                  style={styles.selectBox}
                  onPress={() =>
                    abrirSeletor('tema', 'Selecione uma disciplina', [
                      '',
                      ...temas,
                    ])
                  }
                >
                  <Text style={styles.selectText}>
                    {filtros.tema || 'Selecione uma disciplina'}
                  </Text>
                  <ChevronDown size={20} color="#8d8d8d" />
                </Pressable>
              </View>

              {/* Filtro de Banca */}
              <View style={styles.fieldSection}>
                <Text style={styles.fieldLabel}>BANCA</Text>
                <View style={styles.radioGrid}>
                  {bancas.map((banca) => {
                    const isSelected = filtros.banca === banca;
                    return (
                      <Pressable
                        key={banca}
                        style={[
                          styles.radioButton,
                          isSelected && styles.radioButtonSelected,
                        ]}
                        onPress={() => atualizarFiltro('banca', banca)}
                      >
                        <View
                          style={[
                            styles.radioCircle,
                            isSelected && styles.radioCircleSelected,
                          ]}
                        >
                          {isSelected && <View style={styles.radioInnerDot} />}
                        </View>
                        <Text
                          style={[
                            styles.radioText,
                            isSelected && styles.radioTextSelected,
                          ]}
                        >
                          {banca}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Filtro de Relevância */}
              <View style={styles.fieldSection}>
                <Text style={styles.fieldLabel}>RELEVÂNCIA DA QUESTÃO</Text>
                <View style={styles.radioGrid}>
                  {relevancias.map((rel) => {
                    const isSelected = filtros.dificuldade === rel;
                    return (
                      <Pressable
                        key={rel}
                        style={[
                          styles.radioButton,
                          isSelected && styles.radioButtonSelected,
                        ]}
                        onPress={() => atualizarFiltro('dificuldade', rel)}
                      >
                        <View
                          style={[
                            styles.radioCircle,
                            isSelected && styles.radioCircleSelected,
                          ]}
                        >
                          {isSelected && <View style={styles.radioInnerDot} />}
                        </View>
                        <Text
                          style={[
                            styles.radioText,
                            isSelected && styles.radioTextSelected,
                          ]}
                        >
                          {rel}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Assuntos */}
              <View style={styles.fieldSection}>
                <Text style={styles.fieldLabel}>ASSUNTOS</Text>
                <Text style={styles.fieldHint}>
                  Selecione os assuntos primários ou secundários para filtrar
                  questões.
                </Text>

                <View style={styles.subjectColumns}>
                  {['assunto1', 'assunto2', 'assunto3'].map((campo, index) => {
                    const tipo = ['primário', 'secundário', 'terciário'][index];
                    return (
                      <View key={campo} style={styles.subjectBox}>
                        <View style={styles.subjectBadge}>
                          <Text style={styles.subjectBadgeText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.subjectSubtitle}>
                          Assunto {tipo}
                        </Text>
                        <Pressable
                          style={styles.selectBox}
                          onPress={() =>
                            abrirSeletor(
                              campo,
                              `Assunto ${tipo}`,
                              ['', ...assuntos]
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.selectText,
                              !filtros[campo] && { color: '#a0a0a0' },
                            ]}
                            numberOfLines={1}
                          >
                            {filtros[campo] || 'Selecione assunto'}
                          </Text>
                          <ChevronDown size={18} color="#8d8d8d" />
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Mensagem exibida quando a carga inicial ou aplicação dos filtros falha. */}
            {erro ? <Text style={styles.errorMessage}>{erro}</Text> : null}

            {/* Botão Filtrar Questões */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && { opacity: 0.85 },
                (carregando || questoesFiltradas.length === 0) &&
                  styles.primaryButtonDisabled,
              ]}
              onPress={filtrarQuestoes}
              disabled={carregando || questoesFiltradas.length === 0}
            >
              {carregando ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Filter size={18} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.primaryButtonText}>
                    Filtrar questões ({questoesFiltradas.length})
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        ) : (
          /* ========================================================= */
          /* TELA 2: RESOLUÇÃO DE QUESTÕES E GABARITO                  */
          /* ========================================================= */
          <View style={styles.content}>
            <View style={styles.heading}>
              <Text style={styles.headingTitle}>Questões</Text>
            </View>

            {/* Gabarito de Questões */}
            <View style={styles.answerKeySection}>
              <Text style={styles.answerKeyTitle}>Gabarito de Questões</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.keyTrack}
              >
                {questoesFiltradas.map((questao, idx) => {
                  const resposta = respostas[questao.id];
                  const correta = questao.alternativas.find((a) => a.correta);
                  const isCorrect = resposta && correta?.letra === resposta;
                  const isWrong = resposta && !isCorrect;
                  const isCurrent = idx === indiceAtual;

                  return (
                    <Pressable
                      key={questao.id}
                      style={[
                        styles.keyDot,
                        isCorrect && styles.keyDotCorrect,
                        isWrong && styles.keyDotWrong,
                        isCurrent && styles.keyDotCurrent,
                      ]}
                      onPress={() => setIndiceAtual(idx)}
                    >
                      <Text
                        style={[
                          styles.keyDotText,
                          (isCorrect || isWrong) && { color: '#ffffff' },
                        ]}
                      >
                        {idx + 1}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {!questaoAtual ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  Nenhuma questão encontrada para os filtros selecionados.
                </Text>
                <Pressable
                  style={styles.primaryButton}
                  onPress={() => setTela('filtros')}
                >
                  <Text style={styles.primaryButtonText}>Voltar aos filtros</Text>
                </Pressable>
              </View>
            ) : (
              <>
                {/* Navegação Entre Questões */}
                <View style={styles.questionNav}>
                  <Pressable
                    style={[
                      styles.navButton,
                      indiceAtual === 0 && styles.navButtonDisabled,
                    ]}
                    onPress={questaoAnterior}
                    disabled={indiceAtual === 0}
                  >
                    <ArrowLeft size={18} color="#8a8a8a" />
                    <Text style={styles.navButtonText}>Anterior</Text>
                  </Pressable>

                  <Text style={styles.navStatusText}>
                    Questão {indiceAtual + 1} de {questoesFiltradas.length}
                  </Text>

                  <Pressable
                    style={[
                      styles.navButton,
                      indiceAtual === questoesFiltradas.length - 1 &&
                        styles.navButtonDisabled,
                    ]}
                    onPress={proximaQuestao}
                    disabled={indiceAtual === questoesFiltradas.length - 1}
                  >
                    <Text style={styles.navButtonText}>Próxima</Text>
                    <ArrowRight size={18} color="#8a8a8a" />
                  </Pressable>
                </View>

                {/* Card da Questão */}
                <View style={styles.questionCard}>
                  {/* Metadados */}
                  <View style={styles.metaRow}>
                    {questaoAtual.vestibular ? (
                      <View style={styles.metaTag}>
                        <Text style={styles.metaTagText}>
                          {questaoAtual.vestibular}
                        </Text>
                      </View>
                    ) : null}
                    {questaoAtual.ano ? (
                      <View style={styles.metaTag}>
                        <Text style={styles.metaTagText}>{questaoAtual.ano}</Text>
                      </View>
                    ) : null}
                    {questaoAtual.topico ? (
                      <View style={styles.metaTag}>
                        <Text style={styles.metaTagText}>
                          {questaoAtual.topico}
                        </Text>
                      </View>
                    ) : null}
                    {questaoAtual.dificuldade ? (
                      <View style={styles.metaTag}>
                        <Text style={styles.metaTagText}>
                          {questaoAtual.dificuldade}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Texto de Apoio */}
                  {questaoAtual.textoApoio && (
                    <View style={styles.supportBox}>
                      <Text style={styles.supportText}>
                        {questaoAtual.textoApoio.texto}
                      </Text>
                    </View>
                  )}

                  {/* Enunciado */}
                  <Text style={styles.enunciadoText}>
                    {questaoAtual.enunciado}
                  </Text>

                  {/* Alternativas */}
                  <View style={styles.alternativesList}>
                    {questaoAtual.alternativas.map((alt) => {
                      const selecionada = respostaAtual === alt.letra;
                      const mostrarErrada = selecionada && !alt.correta;
                      const mostrarCorreta =
                        respostaAtual && alt.correta && !mostrarErrada;

                      return (
                        <Pressable
                          key={alt.letra || alt.texto}
                          style={({ pressed }) => [
                            styles.alternativeItem,
                            selecionada && styles.altSelected,
                            mostrarCorreta && styles.altCorrect,
                            mostrarErrada && styles.altWrong,
                            pressed && { opacity: 0.8 },
                          ]}
                          onPress={() =>
                            responder(questaoAtual.id, alt.letra, alt.correta)
                          }
                        >
                          <View style={styles.altIconContainer}>
                            {mostrarCorreta ? (
                              <CheckCircle2 size={20} color={COLORS.success} />
                            ) : mostrarErrada ? (
                              <XCircle size={20} color={COLORS.danger} />
                            ) : (
                              <Circle size={20} color="#bcbcbc" />
                            )}
                          </View>
                          <Text style={styles.altText}>
                            <Text style={styles.altLetter}>{alt.letra}) </Text>
                            {alt.texto}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  {/* Feedback / Comentário do Especialista */}
                  {respostaAtual && questaoAtual.comentario ? (
                    <View style={styles.feedbackBox}>
                      <Text style={styles.feedbackTitle}>Comentário do Especialista</Text>
                      <Text style={styles.feedbackText}>
                        {questaoAtual.comentario}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Botões de Ação Final */}
                <View style={styles.actionsRow}>
                  <Pressable
                    style={styles.actionButtonSecondary}
                    onPress={() => setTela('filtros')}
                  >
                    <Text style={styles.actionButtonSecondaryText}>
                      Responder outros filtros
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.actionButtonPrimary,
                      indiceAtual === questoesFiltradas.length - 1 && {
                        opacity: 0.5,
                      },
                    ]}
                    onPress={proximaQuestao}
                    disabled={indiceAtual === questoesFiltradas.length - 1}
                  >
                    <Text style={styles.actionButtonPrimaryText}>
                      Próxima questão
                    </Text>
                    <ArrowRight size={18} color="#ffffff" />
                  </Pressable>
                </View>
              </>
            )}
          </View>
        )}

        <View style={styles.footer} />
      </ScrollView>

      {/* Modal Genérico para Seleção de Itens */}
      <Modal
        visible={modalSeletor.visivel}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setModalSeletor({ visivel: false, campo: null, titulo: '', opcoes: [] })
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalPickerCard}>
            <Text style={styles.modalPickerTitle}>{modalSeletor.titulo}</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {modalSeletor.opcoes.map((opcao, i) => (
                <Pressable
                  key={i}
                  style={styles.modalPickerItem}
                  onPress={() => selecionarOpcao(opcao)}
                >
                  <Text style={styles.modalPickerItemText}>
                    {opcao || 'Limpar seleção (Todos)'}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              style={styles.modalPickerClose}
              onPress={() =>
                setModalSeletor({
                  visivel: false,
                  campo: null,
                  titulo: '',
                  opcoes: [],
                })
              }
            >
              <Text style={styles.modalPickerCloseText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 40,
  },
  heading: {
    borderBottomWidth: 2,
    borderBottomColor: '#d8d8d8',
    paddingBottom: 16,
    marginBottom: 24,
  },
  headingTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#b5b5b5',
    marginBottom: 10,
  },
  headingDesc: {
    fontSize: 14,
    lineHeight: 22,
    color: '#a5a5a5',
  },
  filterPanel: {
    backgroundColor: '#f0f0f0',
    borderRadius: 28,
    padding: 20,
    gap: 22,
  },
  fieldSection: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  fieldHint: {
    fontSize: 12,
    color: '#a9a9a9',
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  selectText: {
    fontSize: 14,
    color: '#555555',
    flex: 1,
  },
  radioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e2e2',
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#f0f5ff',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#afafaf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: COLORS.primary,
  },
  radioInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  radioText: {
    fontSize: 13,
    color: '#777777',
    fontWeight: '500',
  },
  radioTextSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  subjectColumns: {
    gap: 14,
    marginTop: 6,
  },
  subjectBox: {
    backgroundColor: '#e6eaf3',
    padding: 14,
    borderRadius: 16,
  },
  subjectBadge: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  subjectBadgeText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
  subjectSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  errorMessage: {
    color: COLORS.danger,
    fontSize: 14,
    marginTop: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 14,
    marginTop: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  answerKeySection: {
    marginBottom: 24,
  },
  answerKeyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  keyTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  keyDot: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#dedede',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyDotCorrect: {
    backgroundColor: COLORS.success,
  },
  keyDotWrong: {
    backgroundColor: COLORS.danger,
  },
  keyDotCurrent: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  keyDotText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#444444',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 30,
    gap: 16,
  },
  emptyText: {
    fontSize: 15,
    color: '#888888',
    textAlign: 'center',
  },
  questionNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navButtonDisabled: {
    opacity: 0.35,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8a8a8a',
  },
  navStatusText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#555555',
  },
  questionCard: {
    backgroundColor: '#f9fafc',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  metaTag: {
    backgroundColor: '#eef3ff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  metaTagText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  supportBox: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    paddingLeft: 14,
    marginBottom: 18,
  },
  supportText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666666',
    fontStyle: 'italic',
  },
  enunciadoText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 25,
    color: '#333333',
    marginBottom: 20,
  },
  alternativesList: {
    gap: 12,
  },
  alternativeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e8e8e8',
    borderRadius: 12,
    padding: 14,
  },
  altSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#f4f7ff',
  },
  altCorrect: {
    borderColor: COLORS.success,
    backgroundColor: '#f1fbf4',
  },
  altWrong: {
    borderColor: COLORS.danger,
    backgroundColor: '#fff4f4',
  },
  altIconContainer: {
    marginRight: 10,
    marginTop: 2,
  },
  altText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: '#444444',
  },
  altLetter: {
    fontWeight: '700',
    color: '#222222',
  },
  feedbackBox: {
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#d8e4ff',
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#304ba0',
    marginBottom: 6,
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4c5f95',
  },
  actionsRow: {
    gap: 12,
    marginTop: 24,
  },
  actionButtonSecondary: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#eeeeee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonSecondaryText: {
    color: '#777777',
    fontSize: 14,
    fontWeight: '700',
  },
  actionButtonPrimary: {
    height: 48,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonPrimaryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    height: 60,
    backgroundColor: COLORS.primary,
    marginTop: 'auto',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalPickerCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalPickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 16,
  },
  modalPickerItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalPickerItemText: {
    fontSize: 15,
    color: '#444444',
  },
  modalPickerClose: {
    marginTop: 16,
    backgroundColor: '#eeeeee',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalPickerCloseText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555555',
  },
});
