// Transforma linhas reais da view da API em questoes para a interface.
export function agruparQuestoes(linhas) {
  const grupos = new Map();

  linhas.forEach((linha, index) => {
    const chave = `${linha.link || "sem-link"}-${linha.enunciado_da_questao}`;
    const questao = grupos.get(chave) || {
      id: chave,
      numeroOriginal: index + 1,
      enunciado: linha.enunciado_da_questao,
      ano: linha.ano,
      vestibular: linha.nome_do_vestibular,
      tema: linha.nome_do_tema,
      topico: linha.nome_topico,
      dificuldade: linha.relevancia_da_questao,
      comentario: "",
      link: linha.link,
      textoApoio: null,
      alternativas: [],
    };

    const alternativaTexto = String(linha.enunciado_da_alternativa || "").trim();
    const match = alternativaTexto.match(/^([a-eA-E])[).:-]/);
    const letra = match ? match[1].toLowerCase() : null;
    const texto = alternativaTexto.replace(/^([a-eA-E])[).:-]\s*/, "").trim();

    questao.alternativas.push({
      texto: texto || alternativaTexto,
      correta: ["S", "C"].includes(String(linha.validacao || "").toUpperCase()),
      originalLetra: letra,
      rawTexto: alternativaTexto,
    });

    if (linha.comentario_do_especialista) {
      questao.comentario = linha.comentario_do_especialista;
    }
    if (!questao.textoApoio && linha.texto) {
      questao.textoApoio = { texto: linha.texto };
    }
    grupos.set(chave, questao);
  });

  return Array.from(grupos.values()).map((questao, index) => ({
    ...questao,
    numero: index + 1,
    alternativas: [...questao.alternativas]
      .sort((a, b) => {
        if (a.originalLetra && b.originalLetra) return a.originalLetra.localeCompare(b.originalLetra);
        if (a.originalLetra) return -1;
        if (b.originalLetra) return 1;
        return 0;
      })
      .map((alternativa, alternativaIndex) => ({
        ...alternativa,
        letra: String.fromCharCode(97 + alternativaIndex),
      })),
  }));
}

export function opcoesUnicas(dados, campo) {
  return Array.from(new Set(dados.map((item) => item[campo]).filter(Boolean)));
}
