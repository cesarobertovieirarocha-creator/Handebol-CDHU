/**
 * =========================================================================
 * ADESP / CDHU 3.0 — JOGADAS SUGERIDAS POR IA (ChatGPT · Gemini · Claude)
 * Arquivo: data/plays-ia.js   (carregar DEPOIS de data/plays.js)
 *
 * Estende window.PLAYS_DB com:
 *   • 10 jogadas sugeridas pelo ChatGPT  (anexo 2)
 *   • 10 jogadas sugeridas pelo Gemini   (anexo 3)
 *   •  8 jogadas autorais sugeridas pelo Claude (com "leituras" se/então)
 *
 * Todas têm conf = 'ia' (sugestão de IA — a validar). A associação a
 * seleções/clubes e a citação de atletas vêm do texto original de cada IA e
 * NÃO foram conferidas em vídeo. A geometria (setas/posições) é didática.
 *
 * Coordenadas: quadra 40 × 20 m, gol de ataque em x = 40 (igual a plays.js).
 * =========================================================================
 */
(function (window) {
  'use strict';
  const db = window.PLAYS_DB;
  if (!db) return;

  const P = (a, b) => ['pass', a, b];
  const M = (a, pt) => ['move', a, pt];
  const D = (a, pt) => ['dribble', a, pt];
  const S = (a, pt) => ['shot', a, pt];
  const B = (a, pt) => ['block', a, pt];

  /* ── Linhas defensivas base (iguais a DEF_SYSTEMS em tatica.html) ── */
  const D60 = { b_d1: [36.5, 3.5], b_d2: [34.8, 6.2], b_d3: [34, 8.8], b_d4: [34, 11.2], b_d5: [34.8, 13.8], b_d6: [36.5, 16.5] };
  const D51 = { b_d1: [36.5, 3.5], b_d2: [34.8, 7], b_d3: [34, 10], b_d4: [34.8, 13], b_d5: [36.5, 16.5], b_d6: [29.5, 10] };
  const D321 = { b_d1: [36.5, 5], b_d2: [34, 10], b_d3: [36.5, 15], b_d4: [30.5, 7.5], b_d5: [30.5, 12.5], b_d6: [26, 10] };
  /* DF(base, dy, extra): desloca a linha dy metros no eixo y (y<0 = lado do PE) + ajustes individuais */
  const DF = (base, dy, extra) => {
    const o = {};
    Object.keys(base).forEach(k => { o[k] = [base[k][0], Math.max(2.4, Math.min(17.6, +(base[k][1] + dy).toFixed(2)))]; });
    return Object.assign(o, extra || {});
  };

  /* Formação 7×6 (goleiro-linha = id "gk"): 4 de 1ª linha + 1 pivô + 2 pontas */
  const INI76 = { ae: [30, 4.8], ac: [29.4, 8.2], gk: [29.4, 11.8], ad: [30, 15.2] };
  /* Formação 7×6 com 2 pivôs (pv e pd/pe descem à linha de 6 m) */
  const INI76_2PV = { ae: [30, 5], ac: [29.4, 8.6], gk: [29.4, 11.4], ad: [30, 15], pv: [33.3, 8.6], pd: [33.3, 12.4] };

  const MODELOS = {};

  /* ═════════════════════════════════════════════════════════════════════
     CHATGPT  (anexo 2)
     ═════════════════════════════════════════════════════════════════════ */
  MODELOS.IA01 = {
    nome: 'Cruzamento triplo com bloqueio do pivô',
    situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
    tags: ['cruzamento', 'bloqueio', 'pivô', '3-3'],
    objetivo: 'Provocar uma quebra de comunicação entre os defensores centrais e criar superioridade na região dos 6 metros.',
    variacoes: ['Se o defensor abandonar o pivô para interceptar o passe, o LD finaliza de 9 metros.'],
    contra: ['Troca de marcação entre D3 e D4 no cruzamento.', 'D4 fica no pivô e D5 sai no LD.'],
    passos: [
      { t: 'AC recebe e avança até ~9 m, obrigando o defensor central a sair da linha.', dt: 'D3 sai no AC; D4 fecha por dentro.', s: [D('ac', [32, 10])], p: { ac: [32, 10] }, d: DF(D60, 0, { b_d3: [32.6, 9.4], b_d4: [33.7, 11.4] }) },
      { t: 'Cruzamento AC × AE; pivô vai ao espaço entre D4 e D5.', dt: 'D3 e D2 hesitam na troca de marcação.', s: [D('ac', [31, 6.8]), M('ae', [31.6, 8.8]), M('pv', [33.4, 12.6])], p: { ac: [31, 6.8], ae: [31.6, 8.8], pv: [33.4, 12.6] }, d: DF(D60, -0.2, { b_d3: [33, 9], b_d2: [33.8, 6.8], b_d4: [33.6, 11.6] }) },
      { t: 'AC entrega a bola ao AE durante a troca; LD aproxima-se do centro simulando arremesso.', dt: 'D3 acompanha o AE; D4 olha o LD.', s: [P('ac', 'ae'), M('ad', [31.2, 12.4])], p: { ad: [31.2, 12.4] }, b: 'ae', d: DF(D60, -0.2, { b_d3: [33, 9.2], b_d4: [33.4, 11.4] }) },
      { t: 'AE ameaça o arremesso e passa rápido ao LD.', dt: 'D3 e D4 são atraídos pelo AE; o LD ganha tempo.', s: [D('ae', [32.2, 9.4]), P('ae', 'ad')], p: { ae: [32.2, 9.4] }, b: 'ad', d: DF(D60, 0.2, { b_d3: [32.8, 9.2], b_d4: [33.4, 11] }) },
      { t: 'LD encontra o pivô, que bloqueia o defensor central, e passa.', dt: 'D4 bloqueado; D5 sai tarde no LD.', s: [B('pv', [33.3, 11.2]), P('ad', 'pv')], p: { pv: [33.5, 11.4] }, b: 'pv', d: DF(D60, 0.2, { b_d4: [33.6, 11.8], b_d5: [34.2, 13.4] }) },
      { t: 'Pivô gira sobre o eixo, recebe em movimento e finaliza perto dos 6 m.', dt: 'D3 e D4 chegam atrasados.', s: [S('pv', [40, 10.6])], p: { pv: [34.2, 11] }, d: DF(D60, 0.2, { b_d4: [33.8, 11.6], b_d5: [34.2, 13.4] }) },
    ],
  };

  MODELOS.IA02 = {
    nome: 'Ataque com dois pivôs e inversão de corredor',
    situacao: 'ataque_posicionado', atk: '4-2', def: '6-0', bola: 'ac',
    ini: { pv: [33.3, 9.6], pd: [35.2, 17.2] },
    tags: ['dois pivôs', '4-2', 'bloqueio', 'passe picado'],
    objetivo: 'Criar duas ameaças simultâneas na linha defensiva, impedindo que os defensores concentrem a marcação em um único pivô.',
    variacoes: ['Inversão rápida para a ponta direita caso a defesa feche o corredor central.'],
    contra: ['D5 fecha o 2º pivô e D4 segura o pivô 1 sem ajuda.', 'Defesa 5-1 que sai nos armadores.'],
    passos: [
      { t: 'AC inicia a circulação com o AE.', dt: 'Defesa desliza para o lado esquerdo.', s: [P('ac', 'ae')], b: 'ae', d: DF(D60, -0.8) },
      { t: 'AE faz finta de arremesso e devolve a bola ao AC.', dt: 'D2 saiu na finta e recompõe.', s: [D('ae', [31, 6.4]), P('ae', 'ac')], p: { ae: [31, 6.4] }, b: 'ac', d: DF(D60, -0.4, { b_d2: [33.6, 6.4] }) },
      { t: 'AC cruza com o AD; o pivô 1 bloqueia o defensor do AD.', dt: 'D5 luta contra o bloqueio.', s: [D('ac', [30.8, 12.8]), M('ad', [30.6, 10.6]), B('pv', [33.4, 12.2])], p: { ac: [30.8, 12.8], ad: [30.6, 10.6], pv: [33.5, 12] }, d: DF(D60, 0.6, { b_d5: [34.6, 13.6], b_d4: [33.8, 11.8] }) },
      { t: 'AC passa ao AD; o pivô 2 abandona a posição aberta e infiltra nas costas da defesa.', dt: 'D5 e D6 perdem a referência do pivô 2.', s: [P('ac', 'ad'), M('pd', [34.2, 14.8])], p: { pd: [34.2, 14.8] }, b: 'ad', d: DF(D60, 0.8, { b_d5: [34.4, 14.2], b_d6: [36, 16.8] }) },
      { t: 'AD atrai dois defensores e faz passe picado ao pivô 2.', dt: 'D4 e D5 saem no AD; o corredor se abre.', s: [D('ad', [31.6, 13.4]), P('ad', 'pd')], p: { ad: [31.6, 13.4] }, b: 'pd', d: DF(D60, 0.8, { b_d4: [32.8, 12.2], b_d5: [33.2, 14] }) },
      { t: 'Pivô 2 recebe em deslocamento e finaliza de 6 m.', dt: 'D6 chega atrasado.', s: [S('pd', [40, 9.6])], d: DF(D60, 0.8, { b_d5: [33.6, 14.2], b_d6: [35.4, 16.2] }) },
    ],
  };

  MODELOS.IA03 = {
    nome: 'Cruzamento com transformação ofensiva',
    situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
    tags: ['transformação', 'troca de posições', 'infiltração', 'ponta'],
    objetivo: 'Desorganizar as referências defensivas por meio de trocas de posições e mudanças de profundidade.',
    variacoes: ['Se a defesa fechar a infiltração, a bola retorna ao lateral direito para arremesso de longa distância.'],
    contra: ['D1 acompanha a infiltração do PE desde o início.', 'Defesa avançada (5-1) rompe a transformação.'],
    passos: [
      { t: 'AC conduz a bola para o lado esquerdo; o PD desce à 1ª linha formando 4 na frente.', dt: 'Defesa desliza para a esquerda.', s: [D('ac', [30.6, 7.4]), M('pd', [31.6, 17.2])], p: { ac: [30.6, 7.4], pd: [31.6, 17.2] }, d: DF(D60, -0.8) },
      { t: 'Cruzamento AC × AE: o AC ocupa a posição de AE e o AE assume a organização no centro.', dt: 'D2 e D3 confundem referências.', s: [P('ac', 'ae'), M('ac', [30, 4.8]), M('ae', [29.8, 9.2])], p: { ac: [30, 4.8], ae: [29.8, 9.2] }, b: 'ae', d: DF(D60, -0.4, { b_d2: [34.2, 6.4], b_d3: [33.8, 9] }) },
      { t: 'PE infiltra por trás do novo AE; pivô vai ao lado oposto arrastando o defensor central.', dt: 'D3 segue o pivô; D1 perde o PE de vista.', s: [M('pe', [34.4, 4.8]), M('pv', [33.5, 13.2])], p: { pe: [34.4, 4.8], pv: [33.5, 13.2] }, d: DF(D60, 0.3, { b_d3: [33.8, 10.4], b_d4: [33.8, 12.4] }) },
      { t: 'O novo central passa ao PE infiltrado.', dt: 'D1 e D2 fecham o corredor tarde.', s: [P('ae', 'pe')], b: 'pe', d: DF(D60, 0, { b_d1: [35.6, 4], b_d2: [34, 5.8] }) },
      { t: 'PE recebe em velocidade, ameaça a finalização e observa o pivô.', dt: 'Goleiro e D1 fecham o ângulo.', s: [D('pe', [35.6, 5.4])], p: { pe: [35.6, 5.4] }, d: DF(D60, 0, { b_d1: [35.8, 4.2], b_d2: [34, 5.8] }) },
      { t: 'PE finaliza em suspensão.', dt: 'D1 não consegue bloquear.', s: [S('pe', [40, 9.2])], d: DF(D60, 0, { b_d1: [35.8, 4.4], b_d2: [34, 5.8] }) },
    ],
  };

  MODELOS.IA04 = {
    nome: 'Bloqueio central com rotação de primeira linha',
    situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
    tags: ['bloqueio', 'rotação', 'pivô', '2×1'],
    objetivo: 'Utilizar o bloqueio para produzir uma vantagem temporária de dois atacantes contra um defensor.',
    variacoes: ['Passe para o AC que chega em velocidade, caso o defensor abandone a posição para acompanhar o pivô.'],
    contra: ['Troca de marcação D2 × D3 anula o bloqueio.', 'D4 dobra no pivô.'],
    passos: [
      { t: 'AC conduz a bola ao espaço entre os dois defensores centrais; pivô se posiciona entre D2 e D3.', dt: 'D3 e D4 se abrem para fechar o AC.', s: [D('ac', [31.4, 9.8]), M('pv', [33.4, 7.4])], p: { ac: [31.4, 9.8], pv: [33.4, 7.4] }, d: DF(D60, -0.2, { b_d3: [33, 9.2], b_d4: [33.2, 11] }) },
      { t: 'AE acelera na diagonal para o centro; pivô bloqueia legalmente o defensor que o acompanha.', dt: 'D2 é bloqueado pelo pivô.', s: [M('ae', [31.6, 8.2]), B('pv', [33.3, 7.6])], p: { ae: [31.6, 8.2] }, d: DF(D60, -0.4, { b_d2: [33.9, 6.8] }) },
      { t: 'AC entrega a bola ao AE.', dt: 'D2 e D3 discutem a troca.', s: [P('ac', 'ae')], b: 'ae', d: DF(D60, -0.4, { b_d2: [33.9, 6.8], b_d3: [33.2, 9] }) },
      { t: 'AE ameaça ultrapassar o bloqueio, atraindo a cobertura; o AC rotaciona para o espaço do AE.', dt: 'D2 e D3 saem juntos no AE; o pivô fica livre.', s: [D('ae', [32.2, 6.4]), M('ac', [30.2, 5.6])], p: { ae: [32.2, 6.4], ac: [30.2, 5.6] }, d: DF(D60, -0.4, { b_d2: [33, 7], b_d3: [32.8, 8.6] }) },
      { t: 'Pivô desfaz o bloqueio e gira em direção ao gol; AE passa por trás da linha defensiva.', dt: 'D2 e D3 de costas para o pivô.', s: [M('pv', [34.2, 8.4]), P('ae', 'pv')], p: { pv: [34.2, 8.4] }, b: 'pv', d: DF(D60, -0.4, { b_d2: [32.8, 7], b_d3: [32.8, 8.6] }) },
      { t: 'Pivô finaliza de 6 m.', dt: 'Bloqueio tardio.', s: [S('pv', [40, 9.4])], d: DF(D60, -0.4, { b_d2: [32.8, 7], b_d3: [33.4, 8.6] }) },
    ],
  };

  MODELOS.IA05 = {
    nome: 'Infiltração da ponta e finalização cruzada',
    situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
    tags: ['ponta', 'infiltração', 'inversão', 'finta'],
    objetivo: 'Explorar o espaço criado pela movimentação do pivô e pela atração dos defensores da primeira linha.',
    variacoes: ['Se o defensor externo acompanhar a infiltração, o PE recebe a inversão de jogo e finaliza.'],
    contra: ['D6 acompanha o PD até o fim.', 'D2 não se deixa fintar pelo AE.'],
    passos: [
      { t: 'AC inicia a circulação pelo lado direito.', dt: 'Defesa desliza para a direita.', s: [P('ac', 'ad')], b: 'ad', d: DF(D60, 0.8) },
      { t: 'AD conduz ao centro; PD abandona a ponta e infiltra nas costas do defensor externo; pivô vai ao lado esquerdo.', dt: 'D6 hesita entre o AD e o PD.', s: [D('ad', [30.6, 11.4]), M('pd', [35.4, 15.8]), M('pv', [33.4, 7.6])], p: { ad: [30.6, 11.4], pd: [35.4, 15.8], pv: [33.4, 7.6] }, d: DF(D60, 0.4, { b_d6: [36.2, 16.8] }) },
      { t: 'AD devolve ao AC.', dt: 'Defesa reajusta ao centro.', s: [P('ad', 'ac')], b: 'ac', d: DF(D60, 0) },
      { t: 'AC faz passe diagonal ao AE.', dt: 'Defesa corre para a esquerda.', s: [P('ac', 'ae')], b: 'ae', d: DF(D60, -1) },
      { t: 'AE finta o arremesso, forçando a saída do defensor; PD continua a diagonal para os 6 m.', dt: 'D2 sai no AE; D5 e D6 perdem o PD.', s: [D('ae', [31.4, 6.8]), M('pd', [34.4, 14.6])], p: { ae: [31.4, 6.8], pd: [34.4, 14.6] }, d: DF(D60, -1, { b_d2: [32.8, 6.6], b_d6: [36, 16.4] }) },
      { t: 'AE faz passe longo ao PD infiltrado.', dt: 'Ninguém fecha a diagonal.', s: [P('ae', 'pd')], b: 'pd', d: DF(D60, -1, { b_d2: [32.8, 6.6] }) },
      { t: 'PD recebe em suspensão e finaliza antes de perder o ângulo.', dt: 'D6 tarde.', s: [S('pd', [40, 9.2])], d: DF(D60, -1, { b_d2: [32.8, 6.6], b_d6: [35.2, 16] }) },
    ],
  };

  MODELOS.IA06 = {
    nome: 'Sistema 7 × 6 com quatro jogadores de primeira linha',
    situacao: 'superioridade_7x6', atk: '7x6', def: '6-0', bola: 'ac',
    ini: INI76_2PV,
    tags: ['7×6', 'dois pivôs', '4 na 1ª linha', 'bloqueio'],
    objetivo: 'Explorar a superioridade numérica e criar situações de 2 contra 1 nos intervalos defensivos.',
    variacoes: ['Inversão para a ponta livre se os defensores fecharem os dois pivôs.'],
    contra: ['Defesa compacta 6-0 fecha os dois pivôs sem ajuda.', 'Risco de perda e gol em baliza vazia.'],
    passos: [
      { t: 'Goleiro substituído por jogador de linha: 4 na 1ª linha, 2 pivôs e 1 ponta. AC inicia a circulação com o AE.', dt: 'Defesa compacta desliza para a esquerda.', s: [P('ac', 'ae')], b: 'ae', d: DF(D60, -0.6) },
      { t: 'AE cruza com o 2º lateral (7º jogador), que ocupa a região central.', dt: 'D2 e D3 trocam marcação.', s: [P('ae', 'gk'), M('gk', [30.2, 9.4]), M('ae', [30.2, 6.2])], p: { gk: [30.2, 9.4], ae: [30.2, 6.2] }, b: 'gk', d: DF(D60, -0.4, { b_d3: [33.6, 9] }) },
      { t: 'Pivô 1 bloqueia o defensor central; pivô 2 vai ao intervalo entre defensores; bola ao LD.', dt: 'D3 bloqueado; D5 sai no LD.', s: [B('pv', [33.4, 9.4]), M('pd', [33.5, 12.6]), P('gk', 'ad')], p: { pv: [33.5, 9.2], pd: [33.5, 12.6] }, b: 'ad', d: DF(D60, 0.6, { b_d5: [33.6, 14], b_d4: [33.8, 11.6] }) },
      { t: 'LD ameaça o arremesso, atraindo a cobertura.', dt: 'D5 sai no LD; D4 recua para o pivô 2.', s: [D('ad', [31.2, 14])], p: { ad: [31.2, 14] }, d: DF(D60, 0.6, { b_d5: [32.6, 14], b_d4: [33.6, 11.8] }) },
      { t: 'LD devolve ao jogador centralizado, agora livre.', dt: 'Defesa perde a referência.', s: [P('ad', 'gk')], b: 'gk', d: DF(D60, 0.2, { b_d5: [33, 14], b_d4: [33.6, 11.6] }) },
      { t: 'Jogador centralizado passa ao pivô que ganhou posição.', dt: 'D4 e D5 não dobram a tempo.', s: [P('gk', 'pd')], b: 'pd', d: DF(D60, 0.2, { b_d4: [33.6, 11.6], b_d5: [33.4, 14.2] }) },
      { t: 'Pivô recebe e finaliza próximo ao gol.', dt: 'Bloqueio duplo atrasado.', s: [S('pd', [40, 10.2])], d: DF(D60, 0.2, { b_d4: [33.8, 11.8], b_d5: [33.6, 14.2] }) },
    ],
  };

  MODELOS.IA07 = {
    nome: 'Desdobramento do ponta com cruzamento lateral',
    situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
    tags: ['ponta', 'desdobramento', 'dois pivôs', 'cruzamento'],
    objetivo: 'Criar superioridade numérica localizada através do desdobramento de um jogador da extremidade.',
    variacoes: ['O PE finaliza em profundidade se o D1 não acompanhar.', 'O LD, como 2º pivô, finaliza em movimento.'],
    contra: ['D1 acompanha o PE até os 6 m.', 'Defesa 5-1 antecipa o passe ao PE.'],
    passos: [
      { t: 'AC conduz a bola para o lado esquerdo.', dt: 'Defesa desliza para a esquerda.', s: [D('ac', [30.6, 8])], p: { ac: [30.6, 8] }, d: DF(D60, -0.8) },
      { t: 'AE aproxima-se e cruza com o AC; PE abandona a posição e vai à linha de 6 m.', dt: 'D1 segue o PE; D2 espera o cruzamento.', s: [M('ae', [31.2, 8.8]), D('ac', [31.2, 6.6]), M('pe', [34.6, 4.6])], p: { ae: [31.2, 8.8], ac: [31.2, 6.6], pe: [34.6, 4.6] }, d: DF(D60, -0.8, { b_d1: [35.8, 4.2] }) },
      { t: 'Pivô bloqueia o defensor externo; AC passa ao AE.', dt: 'D2 bloqueado; D1 preso entre PE e pivô.', s: [B('pv', [34.2, 5.6]), P('ac', 'ae')], p: { pv: [33.8, 6] }, b: 'ae', d: DF(D60, -0.8, { b_d1: [35.6, 4.4], b_d2: [34.4, 6.4] }) },
      { t: 'AE atrai a marcação do defensor avançado; o LD desloca-se para o centro.', dt: 'D2 e D3 saem no AE.', s: [D('ae', [32.2, 7.6]), M('ad', [33.4, 12.4])], p: { ae: [32.2, 7.6], ad: [33.4, 12.4] }, d: DF(D60, -0.6, { b_d2: [33.2, 7], b_d3: [33.4, 9] }) },
      { t: 'AE serve o PE em profundidade.', dt: 'D1 chega tarde.', s: [P('ae', 'pe')], b: 'pe', d: DF(D60, -0.4, { b_d1: [35.4, 4.6], b_d2: [33.4, 7] }) },
      { t: 'PE passa ao LD, que aparece como segundo pivô.', dt: 'D4 e D5 não esperavam o 2º pivô.', s: [P('pe', 'ad')], b: 'ad', d: DF(D60, -0.2, { b_d4: [34, 11.4], b_d5: [34.6, 13.6] }) },
      { t: 'Segundo pivô recebe em movimento e finaliza.', dt: 'Goleiro sem apoio.', s: [S('ad', [40, 9.8])], d: DF(D60, -0.2, { b_d4: [33.6, 11.6], b_d5: [34.4, 13.4] }) },
    ],
  };

  MODELOS.IA08 = {
    nome: 'Ataque de transição com segunda onda',
    situacao: 'contra_ataque', atk: 'contra', def: '6-0', bola: 'gk',
    ini: { pe: [18, 1.8], ae: [14, 6.5], ac: [13, 10], ad: [14, 13.5], pd: [18, 18.2], pv: [22, 10] },
    defPos: { b_d1: [26, 4], b_d2: [25, 7.5], b_d3: [25.5, 10], b_d4: [25, 12.5], b_d5: [26, 15.5], b_d6: [27, 18] },
    tags: ['contra-ataque', '2ª onda', 'inversão', 'ponta'],
    objetivo: 'Aproveitar o momento em que a defesa adversária ainda não conseguiu recuperar sua organização.',
    variacoes: ['Se a 1ª onda encontrar o gol livre, a ponta finaliza direto.'],
    contra: ['Falta tática na saída do ponta.', 'Recuperação defensiva com 3 jogadores atrás da bola.'],
    passos: [
      { t: 'Goleiro defende e lança longo ao PD, que dispara; central e laterais avançam.', dt: 'Defesa em transição defensiva.', s: [P('gk', 'pd'), M('pd', [30, 18.2])], p: { pd: [30, 18.2], ae: [22, 6.5], ac: [21, 10], ad: [22, 13.5], pe: [26, 1.8], pv: [27, 11] }, b: 'pd', d: { b_d1: [30, 4.2], b_d2: [30, 7.4], b_d3: [30.5, 10], b_d4: [30, 12.6], b_d5: [30.5, 15.4], b_d6: [31, 17.6] } },
      { t: 'PD avalia a finalização na 1ª onda; a defesa impede e ele desacelera, mantendo a posse.', dt: 'D6 fecha a ponta; linha recompõe.', s: [D('pd', [32.8, 17.4])], p: { pd: [32.8, 17.4], ae: [27, 6], ac: [26.5, 10], ad: [27.5, 13.6] }, d: { b_d1: [34.4, 4], b_d2: [33.6, 7.2], b_d3: [33.8, 9.6], b_d4: [33.8, 12], b_d5: [34.4, 14.6], b_d6: [35, 16.8] } },
      { t: 'PD passa ao AC, que conduz o contra-ataque pelo corredor central; AE faz corrida diagonal.', dt: 'D3 e D4 saem no AC.', s: [P('pd', 'ac'), M('ae', [30.4, 7])], p: { ae: [30.4, 7], ac: [28.6, 10] }, b: 'ac', d: { b_d1: [35.2, 4], b_d2: [34, 7], b_d3: [33.2, 9.2], b_d4: [33.2, 11.2], b_d5: [34.6, 14.2], b_d6: [35.4, 16.6] } },
      { t: 'AD ocupa o corredor oposto; pivô chega atrasado entre os defensores centrais.', dt: 'Defesa já organizada, mas com 2 atletas fora da linha.', s: [M('ad', [30.4, 14]), M('pv', [33.4, 10])], p: { ad: [30.4, 14], pv: [33.4, 10] }, d: { b_d1: [36, 4], b_d2: [34.4, 6.6], b_d3: [33.6, 9], b_d4: [33.6, 11.2], b_d5: [34.6, 14], b_d6: [36, 16.6] } },
      { t: 'AC faz inversão rápida ao AD.', dt: 'D5 e D6 tentam recompor.', s: [P('ac', 'ad')], b: 'ad', d: { b_d1: [36, 4.4], b_d2: [34.4, 7.2], b_d3: [33.8, 9.8], b_d4: [33.6, 12], b_d5: [33.8, 14], b_d6: [35.6, 16.4] } },
      { t: 'O lateral livre finaliza.', dt: 'Bloqueio tardio.', s: [S('ad', [40, 9.6])], d: { b_d1: [36, 4.4], b_d2: [34.4, 7.2], b_d3: [33.8, 9.8], b_d4: [33.4, 12], b_d5: [33.2, 14], b_d6: [35.6, 16.4] } },
    ],
  };

  MODELOS.IA09 = {
    nome: 'Ataque com isolamento e bloqueio lateral',
    situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
    tags: ['isolamento', 'bloqueio lateral', 'pivô', '1×1'],
    objetivo: 'Provocar uma decisão defensiva difícil: proteger o pivô ou impedir a infiltração do lateral.',
    variacoes: ['Se a defesa mantiver a compactação, o LD usa o isolamento para finta individual e arremesso de 9 metros.'],
    contra: ['D3 sai cedo e D4 cobre o pivô.', 'Defesa em 5-1 elimina o isolamento.'],
    passos: [
      { t: 'AC inicia a circulação pelo lado esquerdo.', dt: 'Defesa desliza para a esquerda.', s: [P('ac', 'ae')], b: 'ae', d: DF(D60, -0.8) },
      { t: 'AE conduz a bola ao corredor central; pivô vai ao espaço entre D2 e D3.', dt: 'D3 sai no AE.', s: [D('ae', [30.8, 9.6]), M('pv', [33.4, 7.6])], p: { ae: [30.8, 9.6], pv: [33.4, 7.6] }, d: DF(D60, -0.4, { b_d3: [33, 9.2] }) },
      { t: 'LD aproxima-se para o cruzamento; AE entrega ao AC.', dt: 'Defesa vai ao centro.', s: [M('ad', [30.4, 12.4]), P('ae', 'ac')], p: { ad: [30.4, 12.4] }, b: 'ac', d: DF(D60, 0, { b_d4: [33.4, 11.6] }) },
      { t: 'AC passa ao LD.', dt: 'D5 sai no LD; D4 cobre.', s: [P('ac', 'ad')], b: 'ad', d: DF(D60, 0.6, { b_d5: [34, 13.6] }) },
      { t: 'Pivô faz bloqueio lateral no defensor de cobertura; LD acelera em direção aos 6 m.', dt: 'D4 bloqueado; D3 precisa decidir.', s: [B('pv', [33.5, 11.6]), D('ad', [32.4, 11.8])], p: { pv: [33.6, 11.4], ad: [32.4, 11.8] }, d: DF(D60, 0.4, { b_d4: [33.8, 11.8], b_d3: [33, 9.6] }) },
      { t: 'Defensor central sai para impedir a infiltração; LD passa ao pivô que se desmarca nas costas.', dt: 'D3 saiu e abriu o pivô.', s: [P('ad', 'pv'), M('pv', [34.2, 10.2])], p: { pv: [34.2, 10.2] }, b: 'pv', d: DF(D60, 0.4, { b_d3: [32.6, 10.4], b_d4: [33.4, 12] }) },
      { t: 'Pivô recebe e finaliza.', dt: 'Cobertura tardia.', s: [S('pv', [40, 10])], d: DF(D60, 0.4, { b_d3: [33, 10.2], b_d4: [33.6, 11.8] }) },
    ],
  };

  MODELOS.IA10 = {
    nome: 'Sistema de ataque com falsa movimentação e passe decisivo',
    situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
    tags: ['falsa movimentação', 'bloqueio', 'passe decisivo', 'ponta'],
    objetivo: 'Construir uma sequência de ameaças ofensivas que obriga a defesa a reagir sucessivamente, até surgir uma oportunidade clara de finalização.',
    variacoes: ['Se o goleiro fechar o 1º ângulo, o pivô serve a ponta direita infiltrada.'],
    contra: ['D5 não deixa o PD e a defesa vira 6-0 profunda.', 'Goleiro lê o passe do pivô à ponta.'],
    passos: [
      { t: 'AC inicia a circulação para o AE e desloca-se ao lado direito, simulando um cruzamento.', dt: 'Defesa desliza para a esquerda.', s: [P('ac', 'ae'), M('ac', [30.6, 12.4])], p: { ac: [30.6, 12.4] }, b: 'ae', d: DF(D60, -0.8) },
      { t: 'AE faz finta de arremesso, sem finalizar; pivô bloqueia o defensor do LD; PD sobe à 1ª linha.', dt: 'D2 na finta; D5 bloqueado pelo pivô.', s: [D('ae', [31, 6.6]), B('pv', [33.4, 12.4]), M('pd', [33, 16.6])], p: { ae: [31, 6.6], pv: [33.5, 12.2], pd: [33, 16.6] }, d: DF(D60, -0.4, { b_d2: [33.6, 6.6], b_d5: [34.6, 13.6] }) },
      { t: 'AE passa ao LD, que ameaça o arremesso de longa distância.', dt: 'D5 sai no LD; D6 cobre a ponta.', s: [P('ae', 'ad')], b: 'ad', d: DF(D60, 0.6, { b_d5: [33.4, 13.8], b_d6: [36, 16.8] }) },
      { t: 'LD devolve ao AC, que faz diagonal por trás dele.', dt: 'Defesa reorganiza; D4 e D5 voltam.', s: [P('ad', 'ac'), M('ac', [31.6, 11])], p: { ac: [31.6, 11] }, b: 'ac', d: DF(D60, 0.2, { b_d4: [33.8, 11.6], b_d5: [34, 13.6] }) },
      { t: 'AC encontra o pivô com passe rápido, aproveitando a abertura do bloqueio.', dt: 'D4 e D5 se chocam.', s: [P('ac', 'pv')], b: 'pv', d: DF(D60, 0.2, { b_d4: [33.8, 11.8], b_d5: [34, 13.6] }) },
      { t: 'Pivô gira em direção ao gol e ameaça a finalização.', dt: 'Goleiro fecha o 1º ângulo.', s: [D('pv', [34.2, 11.4])], p: { pv: [34.2, 11.4] }, d: DF(D60, 0.2, { b_d4: [33.6, 11.8], b_d5: [33.8, 13.4], b_d6: [36, 16.4] }) },
      { t: 'Pivô serve a PD infiltrada na ponta.', dt: 'D6 chega atrasado.', s: [P('pv', 'pd'), M('pd', [36, 17.2])], p: { pd: [36, 17.2] }, b: 'pd', d: DF(D60, 0.2, { b_d5: [33.8, 13.6], b_d6: [36.2, 16.2] }) },
      { t: 'PD finaliza em suspensão.', dt: 'Defesa já desequilibrada.', s: [S('pd', [40, 9])], d: DF(D60, 0.2, { b_d5: [33.8, 13.6], b_d6: [36.2, 16.4] }) },
    ],
  };

  /* ═════════════════════════════════════════════════════════════════════
     GEMINI  (anexo 3)
     ═════════════════════════════════════════════════════════════════════ */
  MODELOS.IA11 = {
    nome: 'Cruzamento duplo com engajamento do pivô (Double Cross & Pivot Slip)',
    situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ae',
    tags: ['cruzamento duplo', 'bloqueio cego', 'pivô', 'passe quicado'],
    objetivo: 'Criar desequilíbrio na defesa 6-0 entre os defensores centrais (D3 e D4) e o defensor lateral (D2).',
    variacoes: ['O AC abre espaço para o AD arremessar na infiltração.'],
    contra: ['D3 não se deixa bloquear e acompanha o pivô.', 'D5 fecha o espaço de infiltração do AD.'],
    passos: [
      { t: 'AE inicia corrida diagonal ao centro, engajando o D2; AC faz corte por trás do AE.', dt: 'D2 sai no AE; D3 olha o AC.', s: [D('ae', [31.4, 8.6]), M('ac', [30.6, 6.4])], p: { ae: [31.4, 8.6], ac: [30.6, 6.4] }, d: DF(D60, -0.4, { b_d2: [33.4, 6.8], b_d3: [33.6, 9] }) },
      { t: 'AE passa cruzado ao AC, que ameaça o arremesso de 9 m na altura do D3 esquerdo.', dt: 'A defesa desloca para cobrir o AC.', s: [P('ae', 'ac'), D('ac', [31.8, 7.6])], p: { ac: [31.8, 7.6] }, b: 'ac', d: DF(D60, -0.8, { b_d3: [33, 8.2], b_d2: [33.2, 6.6] }) },
      { t: 'AD infiltra no espaço entre D4 e D5 do lado oposto; pivô bloqueia as costas do D3 (bloqueio cego).', dt: 'D3 bloqueado sem ver; D4 hesita.', s: [M('ad', [32.4, 12.2]), B('pv', [33.8, 9.6])], p: { ad: [32.4, 12.2], pv: [33.6, 9.4] }, d: DF(D60, -0.6, { b_d3: [33.2, 8.4], b_d4: [33.6, 11.4] }) },
      { t: 'AC faz passe quicado ao pivô, que gira sobre o bloqueio.', dt: 'D4 fecha o pivô tarde.', s: [P('ac', 'pv')], b: 'pv', d: DF(D60, -0.6, { b_d3: [33.2, 8.4], b_d4: [33.6, 11] }) },
      { t: 'Pivô finaliza de 6 m.', dt: 'D4 tenta o bloqueio.', s: [S('pv', [40, 10.2])], p: { pv: [34.1, 9.8] }, d: DF(D60, -0.6, { b_d3: [33.2, 8.6], b_d4: [33.4, 10.8] }) },
    ],
  };

  MODELOS.IA12 = {
    nome: 'Transição com falso ponta em 2ª linha (False Wing Infiltration)',
    situacao: 'ataque_posicionado', atk: '3-3', def: '5-1', bola: 'ac',
    tags: ['falso ponta', '2 pivôs', 'defesa 5-1', 'bloqueio duplo'],
    objetivo: 'Transformar o ataque 3-3 em um ataque 2-4 momentâneo com dois pivôs para desorganizar a defesa 5-1.',
    variacoes: ['O AD infiltra pelo corredor central aberto em vez de passar.'],
    contra: ['D6 (avançado) recua e fecha o corredor central.', 'D2 acompanha o PE-pivô.'],
    passos: [
      { t: 'PE infiltra em velocidade máxima sem a bola e posiciona-se como 2º pivô entre D4 e D5.', dt: 'D1 perde o PE; D4/D5 se compactam.', s: [M('pe', [33.4, 12.2])], p: { pe: [33.4, 12.2] }, d: DF(D51, 0, { b_d1: [35.6, 4.6], b_d4: [34.4, 12.6], b_d5: [35.6, 15.2] }) },
      { t: 'AC simula isolamento no lado esquerdo, atraindo o defensor avançado do 5-1.', dt: 'D6 sai para o lado esquerdo.', s: [D('ac', [31.2, 8.6])], p: { ac: [31.2, 8.6] }, d: DF(D51, -0.8, { b_d6: [30.4, 8.4], b_d4: [34.4, 12.6], b_d5: [35.6, 15.2] }) },
      { t: 'AC passa ao AD, que recebe em amplitude total.', dt: 'Defesa inverte para a direita.', s: [P('ac', 'ad')], b: 'ad', d: DF(D51, 0.8, { b_d6: [30.6, 12] }) },
      { t: 'AD faz forte fixação; pivô e o PE-pivô fazem bloqueio duplo sobre os dois defensores centrais.', dt: 'D3 e D4 presos; avenida central se abre.', s: [D('ad', [31.6, 13.4]), B('pv', [33.6, 9.6]), B('pe', [33.6, 11.2])], p: { ad: [31.6, 13.4], pv: [33.6, 9.6], pe: [33.6, 11.4] }, d: DF(D51, 0.6, { b_d3: [33.8, 9.8], b_d4: [33.6, 11.6], b_d6: [31.2, 12.6] }) },
      { t: 'AD passa ao ponta convertido em pivô, livre na linha de 6 m.', dt: 'D5 não alcança.', s: [P('ad', 'pe')], b: 'pe', d: DF(D51, 0.6, { b_d3: [33.8, 9.8], b_d4: [33.6, 11.6], b_d5: [35.4, 15], b_d6: [31.6, 12.6] }) },
      { t: 'PE (agora pivô) finaliza.', dt: 'Defesa sem cobertura.', s: [S('pe', [40, 9.8])], d: DF(D51, 0.6, { b_d3: [33.8, 9.8], b_d4: [33.4, 11.6], b_d5: [35, 15], b_d6: [31.6, 12.6] }) },
    ],
  };

  MODELOS.IA13 = {
    nome: 'Telha dupla com bloqueio dinâmico (Double Screen for Back Court)',
    situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
    tags: ['telha dupla', 'bloqueio', 'arremesso de 9–10 m', 'inversão'],
    objetivo: 'Criar espaço limpo para arremesso de longa distância (9–10 metros) superando defesas recuadas.',
    variacoes: ['Se o D3 sair no armador, o pivô gira e recebe.'],
    contra: ['Defesa avançada (5-1) fecha o espaço antes do bloqueio.', 'Troca de marcação D2 × D3.'],
    passos: [
      { t: 'A bola circula rapidamente de ponta a ponta para expandir a linha defensiva: AC → AD.', dt: 'Defesa desliza para a direita.', s: [P('ac', 'ad')], b: 'ad', d: DF(D60, 0.9) },
      { t: 'AD → PD (extremidade oposta): a defesa se estica ao máximo.', dt: 'D6 fecha a ponta; linha esticada.', s: [P('ad', 'pd')], b: 'pd', d: DF(D60, 1.4, { b_d6: [36.2, 17] }) },
      { t: 'PD devolve ao AC; pivô e PE (que infiltra) posicionam-se lado a lado ao lado do D3.', dt: 'Defesa corre de volta ao centro.', s: [P('pd', 'ac'), M('pv', [33.5, 9.4]), M('pe', [33.6, 7.6])], p: { pv: [33.5, 9.4], pe: [33.6, 7.6] }, b: 'ac', d: DF(D60, -0.2) },
      { t: 'Pivô e PE formam a "telha" (bloqueio rígido lado a lado), prendendo dois defensores centrais.', dt: 'D2 e D3 imobilizados.', s: [B('pv', [33.4, 9.6]), B('pe', [33.5, 7.8]), M('ae', [31.4, 6.8])], p: { ae: [31.4, 6.8] }, d: DF(D60, -0.2, { b_d2: [34.4, 6.8], b_d3: [33.8, 8.8] }) },
      { t: 'AE chega em alta velocidade do meio da quadra e recebe do AC.', dt: 'D1 sai tarde no AE.', s: [P('ac', 'ae')], b: 'ae', d: DF(D60, -0.2, { b_d1: [35.4, 4.2], b_d2: [34.2, 6.8] }) },
      { t: 'AE salta livre e arremessa por cima da cobertura.', dt: 'Braços de bloqueio presos.', s: [S('ae', [40, 9.8])], d: DF(D60, -0.2, { b_d1: [35.2, 4.8], b_d2: [34.2, 6.8] }) },
    ],
  };

  MODELOS.IA14 = {
    nome: 'Variação fly duplo (Double Fly / Kempa Trick System)',
    situacao: 'superioridade_7x6', atk: '7x6', def: '6-0', bola: 'ae',
    ini: { gk: [29.4, 10.6], ae: [30, 5.4], ac: [29.4, 8.2], ad: [30, 15] },
    tags: ['fly', 'kempa', '7×6', 'passe no ar'],
    objetivo: 'Desorientar o goleiro e a linha defensiva por meio de passe e arremesso no ar.',
    variacoes: ['Se o goleiro ler o lançamento, o PD finaliza no próprio salto.'],
    contra: ['Defesa com D6 fechando a ponta.', 'Goleiro que sai do gol e antecipa a bola.'],
    passos: [
      { t: 'AE atrai o D2 com movimento agressivo de infiltração na linha de 9 m.', dt: 'D2 sai no AE.', s: [D('ae', [31.8, 6.8])], p: { ae: [31.8, 6.8] }, d: DF(D60, -0.6, { b_d2: [33.2, 6.6] }) },
      { t: 'AE lança a bola em parábola à área de 6 m, em direção ao PD, que já saltou.', dt: 'D5 e D6 olham a bola, sem tempo de reação.', s: [P('ae', 'pd'), M('pd', [35.4, 17.2])], p: { pd: [35.4, 17.2] }, b: 'pd', d: DF(D60, 0.2, { b_d6: [36.2, 16.8] }) },
      { t: 'Em vez de arremessar, o PD pega no ar e passa ao pivô que surge voando do lado oposto.', dt: 'Defesa invertida: goleiro desloca tarde.', s: [P('pd', 'pv'), M('pv', [35.2, 7.8])], p: { pv: [35.2, 7.8] }, b: 'pv', d: DF(D60, 0.2, { b_d2: [33.4, 6.8], b_d3: [33.8, 9] }) },
      { t: 'O segundo jogador no ar finaliza antes de tocar o solo da área.', dt: 'Goleiro fora de tempo.', s: [S('pv', [40, 10.6])], d: DF(D60, 0.2, { b_d2: [33.4, 6.8], b_d3: [33.8, 9] }) },
    ],
  };

  MODELOS.IA15 = {
    nome: 'Bloqueio cego e desmarque em "V" (Blind Screen & V-Cut Slip)',
    situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
    tags: ['bloqueio cego', 'corte em V', 'pivô', 'passe em supinação'],
    objetivo: 'Isolar o pivô de elite nas costas da defesa quando o adversário marca em sistema 6-0 agressivo/pressão.',
    variacoes: ['Se o D2 ignorar a finta, o pivô realmente bloqueia e o AE arremessa.'],
    contra: ['D3 cola no pivô e não aceita a finta.', 'Defesa pressiona o AD antes do passe.'],
    passos: [
      { t: 'AC troca passe com o AE simulando um arremesso direto.', dt: 'D2 sai agressivo no AE.', s: [P('ac', 'ae'), D('ae', [30.8, 6.4])], p: { ae: [30.8, 6.4] }, b: 'ae', d: DF(D60, -0.8, { b_d2: [33.4, 6.4] }) },
      { t: 'AE faz passe longo ao AD; pivô finge bloqueio no D2 esquerdo.', dt: 'D2 recua e olha o bloqueio; linha desliza para a direita.', s: [P('ae', 'ad'), M('pv', [33.8, 6.2])], p: { pv: [33.8, 6.2] }, b: 'ad', d: DF(D60, 0.6, { b_d2: [34.4, 6.6] }) },
      { t: 'Pivô faz o corte em "V": finge para fora e corre explosivamente para dentro.', dt: 'D3 é pego de surpresa.', s: [M('pv', [34.1, 8.6])], p: { pv: [34.1, 8.6] }, d: DF(D60, 0.6, { b_d3: [33.6, 9.6], b_d4: [33.8, 11.6] }) },
      { t: 'AD faz passe em supinação (por baixo das mãos da defesa) direto à zona morta, ao pivô.', dt: 'Passe passa sob os braços de D4 e D5.', s: [P('ad', 'pv')], b: 'pv', d: DF(D60, 0.6, { b_d3: [33.6, 9.6], b_d4: [33.8, 11.4] }) },
      { t: 'Pivô recebe de costas, usa o giro de quadril aproveitando o desequilíbrio do D3 e finaliza nos 6 m.', dt: 'D3 desequilibrado.', s: [S('pv', [40, 10.2])], d: DF(D60, 0.6, { b_d3: [33.8, 9.6], b_d4: [33.8, 11.4] }) },
    ],
  };

  MODELOS.IA16 = {
    nome: 'Circulação dupla de pontas com inversão de lado (Double Wing Overlap & Reverse Pass)',
    situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
    tags: ['pontas', 'overload', 'inversão', 'passe invertido'],
    objetivo: 'Desequilibrar defesas laterais (D1 e D2) criando excesso de jogadores (overload) em um dos lados.',
    variacoes: ['Se D1 acompanhar o PE, o AE finaliza de 9 m.'],
    contra: ['D1 e D2 trocam e fecham o 2º ponta.', 'Defesa 5-1 antecipa a inversão.'],
    passos: [
      { t: 'PD inicia corrida sem bola por trás da linha de 9 m, cruzando toda a quadra até o lado esquerdo.', dt: 'Defesa acompanha só a bola, ignorando a corrida.', s: [M('pd', [31.2, 9.4])], p: { pd: [31.2, 9.4] }, d: DF(D60, -0.2) },
      { t: 'AE e AC trocam passes rápidos para manter a defesa concentrada no centro: AC → AE.', dt: 'Defesa compacta no centro-esquerda.', s: [P('ac', 'ae')], b: 'ae', d: DF(D60, -0.6) },
      { t: 'AE → AC: a bola volta ao centro; PE abre ao máximo para puxar o D1.', dt: 'D1 sai com o PE; abre vão entre D1 e D2.', s: [P('ae', 'ac'), M('pe', [37.4, 0.8])], p: { pe: [37.4, 0.8] }, b: 'ac', d: DF(D60, -0.4, { b_d1: [36.9, 2.8] }) },
      { t: 'PD (que cruzou a quadra) entra como segundo ponta, no espaço entre D1 e D2.', dt: 'D1 e D2 em dúvida: quem fica com o PD?', s: [M('pd', [35.2, 4.6])], p: { pd: [35.2, 4.6] }, d: DF(D60, -0.4, { b_d1: [36.9, 2.8], b_d2: [34.6, 5.6] }) },
      { t: 'AC faz o passe invertido ao PD, que entra em velocidade com ângulo favorável.', dt: 'D2 chega atrasado.', s: [P('ac', 'pd')], b: 'pd', d: DF(D60, -0.4, { b_d1: [36.8, 3], b_d2: [34.4, 5.8] }) },
      { t: 'PD finaliza.', dt: 'Goleiro sem apoio.', s: [S('pd', [40, 10.8])], d: DF(D60, -0.4, { b_d1: [36.8, 3], b_d2: [34, 5.8] }) },
    ],
  };

  MODELOS.IA17 = {
    nome: 'Isolamento 1×1 com bloqueio de saída do pivô (Pivot Out-Screen Isolation)',
    situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
    tags: ['1×1', 'bloqueio externo', 'isolamento', 'armador'],
    objetivo: 'Criar duelo individual (1×1) para um armador com grande capacidade de drible e força física.',
    variacoes: ['Se o D3 ajudar, o AE serve o pivô na saída do bloqueio.'],
    contra: ['Troca de marcação D2 × D3.', 'D3 antecipa e dobra o AE com o goleiro.'],
    passos: [
      { t: 'AC passa ao AE, que recebe em movimento.', dt: 'Defesa desliza para a esquerda.', s: [P('ac', 'ae')], b: 'ae', d: DF(D60, -0.8) },
      { t: 'Pivô bloqueia pelo lado de fora do D2 (e não no D3); PE abre e puxa o D1.', dt: 'D2 impedido de ajudar; D1 preso na ponta.', s: [B('pv', [34.8, 5]), M('pe', [37.2, 0.9])], p: { pv: [34.8, 5] }, d: DF(D60, -0.8, { b_d1: [36.8, 2.6], b_d2: [34.8, 5.6] }) },
      { t: 'AE ataca o espaço exatamente entre D2 e D3.', dt: 'D3 fica isolado, sem cobertura lateral.', s: [D('ae', [32.2, 7.6])], p: { ae: [32.2, 7.6] }, d: DF(D60, -0.8, { b_d3: [33, 8.4], b_d2: [34.8, 5.6] }) },
      { t: 'Drible de engajamento e infiltração limpa até os 6 m.', dt: 'D3 vence o corpo a corpo? Não: está sozinho.', s: [D('ae', [34.4, 8.2])], p: { ae: [34.4, 8.2] }, d: DF(D60, -0.8, { b_d3: [33.8, 8.8], b_d2: [34.8, 5.8] }) },
      { t: 'AE finaliza em suspensão.', dt: 'Goleiro isolado.', s: [S('ae', [40, 9.4])], d: DF(D60, -0.8, { b_d3: [34, 8.6], b_d2: [34.8, 5.8] }) },
    ],
  };

  MODELOS.IA18 = {
    nome: 'Bloqueio escalonado para passe quicado interno (Staggered Screen & Pocket Pass)',
    situacao: 'ataque_posicionado', atk: '3-3', def: '5-1', bola: 'ac',
    tags: ['bloqueio escalonado', 'pocket pass', 'defesa 5-1', 'passe quicado'],
    objetivo: 'Superar defesas 5-1 ou 3-2-1 que saem muito para pressionar a linha de 9 metros.',
    variacoes: ['Se o avançado não sair, o AC arremessa de 9 m.'],
    contra: ['D6 evita o bloqueio e acompanha pelo lado de fora.', 'D3 não sai e fecha o corredor do pivô.'],
    passos: [
      { t: 'AC atrai o defensor avançado (o "1" do 5-1).', dt: 'D6 sai agressivo no AC.', s: [D('ac', [31.4, 9.6])], p: { ac: [31.4, 9.6] }, d: DF(D51, 0, { b_d6: [31.8, 9.8] }) },
      { t: 'Pivô faz o primeiro bloqueio no avançado.', dt: 'D6 tenta desviar do bloqueio.', s: [M('pv', [32.4, 10.4]), B('pv', [32.2, 10.6])], p: { pv: [32.4, 10.4] }, d: DF(D51, 0.2, { b_d6: [32.2, 9.6] }) },
      { t: 'Assim que D6 desvia, o PE infiltra e faz o segundo bloqueio (staggered screen).', dt: 'D2 pego pelo segundo bloqueio.', s: [M('pe', [33.2, 7.8]), B('pe', [33.4, 8.2])], p: { pe: [33.4, 8] }, d: DF(D51, -0.2, { b_d6: [32.6, 9.4], b_d2: [34, 6.8] }) },
      { t: 'AC usa a mudança de ritmo para passar pelo bloqueio duplo.', dt: 'D3 e D4 saem em combate no AC.', s: [D('ac', [32.8, 9.2])], p: { ac: [32.8, 9.2] }, d: DF(D51, 0, { b_d3: [33.4, 9.2], b_d4: [33.6, 11.2], b_d6: [32.2, 10.8] }) },
      { t: 'AC solta passe quicado rápido (pocket pass) entre as pernas dos defensores ao pivô.', dt: 'A bola passa pelo "bolsão" sem interceptação.', s: [P('ac', 'pv')], b: 'pv', d: DF(D51, 0, { b_d3: [33.4, 9.2], b_d4: [33.6, 11.2], b_d6: [32.2, 10.8] }) },
      { t: 'Pivô, que já girou em direção à área, finaliza.', dt: 'Goleiro sem cobertura.', s: [S('pv', [40, 10])], p: { pv: [34.4, 10] }, d: DF(D51, 0, { b_d3: [33.8, 9.4], b_d4: [33.8, 11.2], b_d6: [32.4, 10.8] }) },
    ],
  };

  MODELOS.IA19 = {
    nome: 'Ataque 7 × 6 com pivô duplo e troca rápida de lado (7v6 Overload & Switch)',
    situacao: 'superioridade_7x6', atk: '7x6', def: '6-0', bola: 'ac',
    ini: { ae: [30, 4.8], ac: [29.4, 8.2], gk: [29.4, 11.8], ad: [30, 15.2], pe: [33.4, 6.4], pv: [33.3, 12.2] },
    tags: ['7×6', 'dois pivôs', 'overload', 'troca de lado'],
    objetivo: 'Aproveitar a vantagem numérica do goleiro-linha criando uma situação de 2×1 inevitável na ponta ou na linha de 6 m.',
    variacoes: ['Se D5 sair no AD, o PD recebe livre; se ficar, o 2º pivô finaliza.'],
    contra: ['Defesa 6-0 fecha os pivôs e deixa a ponta ao goleiro.', 'Perda de bola e gol em baliza vazia.'],
    passos: [
      { t: 'O time ataca com 7 de linha: dois pivôs fixos entre D2-D3 (esquerdo) e D4-D5 (direito). AC → AE.', dt: 'Defesa 6-0 se compacta.', s: [P('ac', 'ae')], b: 'ae', d: DF(D60, -0.6) },
      { t: 'AE ataca o espaço, forçando a defesa a flutuar; o pivô esquerdo faz o bloqueio interno do D3.', dt: 'D2 e D3 flutuam; D3 é bloqueado.', s: [D('ae', [31.4, 6.6]), B('pe', [33.6, 8.4])], p: { ae: [31.4, 6.6], pe: [33.6, 8.2] }, d: DF(D60, -0.6, { b_d2: [33.2, 6.8], b_d3: [33.6, 9] }) },
      { t: 'A bola é invertida rapidamente via 7º jogador (central) até o AD.', dt: 'Defesa precisa correr para a direita.', s: [P('ae', 'gk')], b: 'gk', d: DF(D60, 0.2) },
      { t: 'Passe do central ao AD.', dt: 'D5 sai no AD.', s: [P('gk', 'ad')], b: 'ad', d: DF(D60, 1, { b_d5: [33.6, 14] }) },
      { t: 'Os dois pivôs fixam 3 defensores no centro: a defesa escolhe entre deixar o PD ou o 2º pivô livre.', dt: 'D5 decide ficar no AD; o PD fica livre.', s: [D('ad', [31.4, 14.4]), P('ad', 'pd')], p: { ad: [31.4, 14.4] }, b: 'pd', d: DF(D60, 1, { b_d5: [33.2, 14.2], b_d6: [36, 16] }) },
      { t: 'PD finaliza livre na ponta.', dt: 'D6 chega tarde.', s: [S('pd', [40, 9.8])], d: DF(D60, 1, { b_d5: [33.2, 14.2], b_d6: [35.6, 16.2] }) },
    ],
  };

  MODELOS.IA20 = {
    nome: 'Cruzamento espanhol com falsa puxada e passe por trás (Spanish Cross & Behind-the-Back Release)',
    situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
    tags: ['cruzamento', 'finta 360°', 'passe por trás das costas', 'inversão'],
    objetivo: 'Manipular a leitura de jogo defensiva usando a troca de direção e passes de alta precisão técnica.',
    variacoes: ['Se a defesa não bascular, o AC finaliza o próprio 1×1.'],
    contra: ['D4 lê o passe e fica ao lado do AD.', 'Defesa em 5-1 nega o espaço do AD.'],
    passos: [
      { t: 'AC corre agressivamente ao espaço entre D2 e D3 do lado esquerdo, sinalizando cruzamento com o AE.', dt: 'A defesa bascula em bloco para conter o lado esquerdo.', s: [D('ac', [31.6, 7.4])], p: { ac: [31.6, 7.4] }, d: DF(D60, -1.4, { b_d2: [33.6, 6.6], b_d3: [33.6, 8.2] }) },
      { t: 'No momento do cruzamento, o AC faz o movimento de passe mas segura a bola (giro de 360° / finta de corpo); AE passa em velocidade como chamariz.', dt: 'Cobertura defensiva atraída pelo AE.', s: [D('ac', [32, 7.8]), M('ae', [31.2, 9])], p: { ac: [32, 7.8], ae: [31.2, 9] }, d: DF(D60, -1.4, { b_d2: [33.4, 6.8], b_d3: [33.2, 8.4] }) },
      { t: 'AC solta passe por trás das costas (behind-the-back) ao AD, que entra em velocidade no espaço desprotegido do lado oposto.', dt: 'Defesa vira tarde.', s: [P('ac', 'ad'), M('ad', [31.8, 11.8])], p: { ad: [31.8, 11.8] }, b: 'ad', d: DF(D60, -1.2, { b_d4: [34, 11], b_d5: [35, 14] }) },
      { t: 'AD finaliza.', dt: 'D4 e D5 sem tempo de bloquear.', s: [S('ad', [40, 10.4])], d: DF(D60, -1, { b_d4: [33.8, 11.2], b_d5: [34.8, 13.8] }) },
    ],
  };

  /* ═════════════════════════════════════════════════════════════════════
     CLAUDE — jogadas autorais (com "leituras" se/então)
     ═════════════════════════════════════════════════════════════════════ */
  MODELOS.IA21 = {
    nome: 'Cascata Tripla: passa-e-corta em três ondas com pivô pendular',
    situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
    tags: ['passa-e-corta', 'pivô pendular', 'inversão', 'ponta cega'],
    objetivo: 'Fazer a defesa deslizar três vezes seguidas, sempre acompanhando a bola, até que a inversão final encontre o ponta do lado fraco com o D1 ainda a 4 m de distância.',
    variacoes: ['Se D1 não acompanhar o deslizamento, o PE recebe e finaliza com ângulo aberto.', 'Se D1 antecipar a inversão, o AE devolve ao pivô, que já voltou ao centro.'],
    contra: ['Defesa que "congela" o D1 junto ao PE desde o início.', 'Defesa 5-1 com avançado cortando a linha de passe entre os laterais.'],
    passos: [
      { t: 'AC passa ao AE; o pivô desliza para o lado esquerdo (1ª fixação).', dt: 'Defesa desliza com a bola para a esquerda.', s: [P('ac', 'ae'), M('pv', [33.4, 7.4])], p: { pv: [33.4, 7.4] }, b: 'ae', d: DF(D60, -0.9) },
      { t: 'AE devolve ao AC e "corta" por trás dele; o pivô retorna ao centro (2ª fixação).', dt: 'D2 e D3 correm de volta, um passo atrasados.', s: [P('ae', 'ac'), M('ae', [30.6, 11.6]), M('pv', [33.4, 9.6])], p: { ae: [30.6, 11.6], pv: [33.4, 9.6] }, b: 'ac', d: DF(D60, -0.1) },
      { t: 'AC passa ao AD e corta; o pivô desliza ao lado direito (3ª fixação).', dt: 'Defesa inverte para a direita: D1 já está longe do PE.', s: [P('ac', 'ad'), M('ac', [31.2, 12.6]), M('pv', [33.4, 12.2])], p: { ac: [31.2, 12.6], pv: [33.4, 12.2] }, b: 'ad', d: DF(D60, 1) },
      { t: 'AD fixa D5/D6 e devolve ao AE, que chegou livre ao centro pelo loop.', dt: 'D4 e D5 saem no AD; o centro fica descoberto.', s: [D('ad', [31.2, 14.4]), P('ad', 'ae')], p: { ad: [31.2, 14.4] }, b: 'ae', d: DF(D60, 1.3, { b_d5: [33.6, 14.2] }) },
      { t: 'AE inverte de primeira ao PE, que está do lado fraco.', dt: 'Defesa inteira concentrada à direita; D1 a 4 m do PE.', s: [P('ae', 'pe')], b: 'pe', d: DF(D60, 1.6, { b_d1: [36.4, 5.1] }) },
      { t: 'PE finaliza com ângulo aberto.', dt: 'D1 tenta o bloqueio, tarde.', s: [S('pe', [40, 11.2])], d: DF(D60, 1.6, { b_d1: [36.4, 4.4] }) },
    ],
  };

  MODELOS.IA22 = {
    nome: 'X dos Pivôs contra o 5-1 (o AC desce e vira pivô)',
    situacao: 'ataque_posicionado', atk: '3-3', def: '5-1', bola: 'ac',
    tags: ['5-1', 'dois pivôs', 'cruzamento em X', 'anti-avançado'],
    objetivo: 'Tirar do defensor avançado do 5-1 a sua referência (o AC) transformando-o em segundo pivô, e fazer o avançado decidir entre recuar ou deixar a 1ª linha livre.',
    variacoes: ['Se o D6 recua, o AE arremessa de 9 m com o corredor central aberto.', 'Se o D5 sai no AD, o ex-AC (pivô à direita) recebe livre.'],
    contra: ['Defesa troca o avançado para 6-0 ao ver o AC descer.', 'D3 marca o pivô esquerdo sozinho e D4 dobra o ex-AC.'],
    passos: [
      { t: 'AC passa ao AE; o defensor avançado (D6) acompanha a bola.', dt: 'D6 sai para o lado esquerdo; a linha desliza.', s: [P('ac', 'ae')], b: 'ae', d: DF(D51, -0.8, { b_d6: [30.2, 8.4] }) },
      { t: 'O "X": o AC desce aos 6 m pela direita enquanto o pivô cruza para a esquerda.', dt: 'D6 perde a referência: recua ou fica? D3 e D4 trocam sinais.', s: [M('ac', [33.4, 12.8]), M('pv', [33.4, 7.4])], p: { ac: [33.4, 12.8], pv: [33.4, 7.4] }, d: DF(D51, -0.8, { b_d6: [31.6, 9.4], b_d3: [34, 9.6] }) },
      { t: 'AE fixa D2/D3 no 1×1 e passa por cima ao AD.', dt: 'D2 e D3 saem no AE; a linha se abre.', s: [D('ae', [31.4, 7.4]), P('ae', 'ad')], p: { ae: [31.4, 7.4] }, b: 'ad', d: DF(D51, 0.4, { b_d6: [31.4, 11.6] }) },
      { t: 'AD ataca o espaço do D5 e serve o ex-AC (2º pivô) à direita.', dt: 'D5 sai no AD; D4 precisa dobrar no pivô.', s: [D('ad', [31.8, 13.6]), P('ad', 'ac')], p: { ad: [31.8, 13.6] }, b: 'ac', d: DF(D51, 0.6, { b_d5: [35, 14.4], b_d4: [34, 12.2], b_d6: [31.6, 11.8] }) },
      { t: 'Ex-AC finaliza de 6 m.', dt: 'D4 chega atrasado.', s: [S('ac', [40, 10.2])], d: DF(D51, 0.6, { b_d5: [35, 14.4], b_d4: [33.8, 12.2], b_d6: [31.6, 11.8] }) },
    ],
  };

  MODELOS.IA23 = {
    nome: 'Espelho de 9 m: a cobrança que muda de lado no meio do passe',
    situacao: 'bola_parada', atk: '3-3', def: '6-0', bola: 'ac',
    ini: { ac: [31, 10], ae: [30.5, 6], ad: [30.5, 14], pv: [33.2, 10] },
    tags: ['bola parada', '9 m', 'espelho', 'bloqueio', 'tiro livre'],
    objetivo: 'Mostrar à barreira um "lado forte" e atacar o lado oposto antes que ela se reorganize, usando o pivô como espelho do movimento.',
    variacoes: ['Se a barreira não voltar, o AC cobra direto no corredor central.', 'Se D3 sair com o AE, o pivô fica livre e o AE o serve.'],
    contra: ['Barreira dividida em duas metades que não se mexem.', 'Goleiro que lê o passe ao AE.'],
    passos: [
      { t: 'AC cobra o livre ao AD (sinaliza lado direito); o pivô vai ao bloqueio da direita.', dt: 'Barreira desliza para a direita.', s: [P('ac', 'ad'), M('pv', [33.3, 12.6])], p: { pv: [33.3, 12.6] }, b: 'ad', d: DF(D60, 1) },
      { t: 'AD devolve de imediato ao AC; o pivô cruza ao lado oposto (espelho) e o AE acelera.', dt: 'A barreira ainda está à direita: D2 e D3 ficam sem apoio.', s: [P('ad', 'ac'), M('pv', [33.3, 7.2]), M('ae', [31.6, 7.6])], p: { pv: [33.3, 7.2], ae: [31.6, 7.6] }, b: 'ac', d: DF(D60, -0.2, { b_d5: [34.6, 13.4], b_d3: [33.8, 8.8] }) },
      { t: 'AC serve o AE em corrida; o pivô bloqueia o D2.', dt: 'D2 bloqueado; D3 hesita em sair.', s: [P('ac', 'ae'), B('pv', [33.4, 6.6])], b: 'ae', d: DF(D60, -0.7, { b_d2: [34.2, 6.4] }) },
      { t: 'AE ataca o D3 e serve o pivô no giro.', dt: 'D3 sai no AE; D2 preso no bloqueio.', s: [D('ae', [32.4, 7.6]), P('ae', 'pv')], p: { ae: [32.4, 7.6] }, b: 'pv', d: DF(D60, -0.7, { b_d2: [34.2, 6.4], b_d3: [33, 8.2] }) },
      { t: 'Pivô finaliza de 6 m.', dt: 'Goleiro sem cobertura.', s: [S('pv', [40, 9.8])], d: DF(D60, -0.7, { b_d2: [34, 6.4], b_d3: [33.4, 8.2] }) },
    ],
  };

  MODELOS.IA24 = {
    nome: 'Roleta 7×6: carrossel de 4 e passe quicado para a ponta cega',
    situacao: 'superioridade_7x6', atk: '7x6', def: '6-0', bola: 'ae',
    ini: INI76,
    tags: ['7×6', 'carrossel', 'ponta cega', 'passe quicado'],
    objetivo: 'Usar o jogador a mais para girar a bola em 3 passes de 1ª intenção; a defesa 6-0 não consegue acompanhar 7 atacantes e sempre "sobra" um ponta cego.',
    variacoes: ['Se D6 fechar o PD, o AD arremessa de 9 m.', 'Se D5 fechar os dois, o pivô gira e recebe (pivô deslizando em sentido contrário ao da bola).'],
    contra: ['Defesa que corta a linha de passe do 7º jogador.', 'Roubo de bola e gol em baliza vazia: exige passes secos e firmes.'],
    passos: [
      { t: 'AE → AC; pivô desliza para a esquerda, "ancorando" o D3.', dt: 'Defesa compacta ao centro-esquerda.', s: [P('ae', 'ac'), M('pv', [33.4, 7.6])], p: { pv: [33.4, 7.6] }, b: 'ac', d: DF(D60, -0.5) },
      { t: 'AC → 7º jogador (central).', dt: 'D3 e D4 saem em 1×1 e deixam o corredor aberto.', s: [P('ac', 'gk')], b: 'gk', d: DF(D60, 0.3) },
      { t: '7º jogador → AD; o pivô volta para a direita (sentido contrário ao da bola).', dt: 'Defesa precisa correr para a direita; falta um homem.', s: [P('gk', 'ad'), M('pv', [33.4, 12.2])], p: { pv: [33.4, 12.2] }, b: 'ad', d: DF(D60, 1.3, { b_d5: [34.4, 14.2] }) },
      { t: 'AD fixa D5/D6 e solta o passe quicado ao PD, que entra em diagonal (ponta cega).', dt: 'D5 e D6 fechados no AD e no pivô; o PD fica livre.', s: [D('ad', [31.2, 14.6]), P('ad', 'pd'), M('pd', [35.6, 17.2])], p: { ad: [31.2, 14.6], pd: [35.6, 17.2] }, b: 'pd', d: DF(D60, 1.3, { b_d5: [33.2, 14.4], b_d6: [35.6, 16.2] }) },
      { t: 'PD finaliza livre.', dt: 'D6 chega atrasado.', s: [S('pd', [40, 9.6])], d: DF(D60, 1.3, { b_d5: [33.2, 14.4], b_d6: [35.4, 16] }) },
    ],
  };

  MODELOS.IA25 = {
    nome: 'Troca de funções: o pivô vira armador e o ponta vira pivô',
    situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
    tags: ['troca de funções', 'pivô-armador', 'ponta-pivô', 'defesa 6-0'],
    objetivo: 'Inverter os papéis: o pivô "sobe" aos 9 m e arrasta D3/D4 para fora; o PD infiltra como novo pivô nas costas deles. Os defensores aprendem a marcar funções, não pessoas.',
    variacoes: ['Se D3 não sobe com o pivô, o pivô-armador arremessa de 9 m.', 'Se D5 ficar no PD, o pivô-armador serve o AD, que corta.'],
    contra: ['Defesa troca de marcação e D5 acompanha o PD até a área.', 'Defesa 5-1: avançado dobra no pivô que subiu.'],
    passos: [
      { t: 'AC passa ao AE.', dt: 'Defesa desliza para a esquerda.', s: [P('ac', 'ae')], b: 'ae', d: DF(D60, -0.7) },
      { t: 'Pivô "sobe" aos 9 m para receber (puxando D3/D4); o PD infiltra como novo pivô.', dt: 'D3 e D4 saem no pivô: nunca marcaram um pivô a 9 m.', s: [M('pv', [31, 9.6]), M('pd', [34.4, 14.6])], p: { pv: [31, 9.6], pd: [34.4, 14.6] }, d: DF(D60, -0.4, { b_d3: [32.2, 9.2], b_d4: [33.6, 10.8], b_d5: [34.4, 14] }) },
      { t: 'AE serve o pivô-armador no 9 m.', dt: 'D3 pressiona de frente; D4 cobre.', s: [P('ae', 'pv')], b: 'pv', d: DF(D60, -0.4, { b_d3: [32, 9.4], b_d4: [33.4, 10.8], b_d5: [34.4, 14] }) },
      { t: 'O pivô-armador finta e serve o novo pivô (PD) nas costas do D5.', dt: 'D4 saiu no pivô; D5 perdeu o PD de vista.', s: [D('pv', [31.8, 10.6]), P('pv', 'pd')], p: { pv: [31.8, 10.6] }, b: 'pd', d: DF(D60, 0.2, { b_d3: [32.6, 9.6], b_d4: [33, 11.4], b_d5: [34.6, 14.2] }) },
      { t: 'Novo pivô finaliza de 6 m.', dt: 'D5 tenta o bloqueio, sem tempo.', s: [S('pd', [40, 9.4])], d: DF(D60, 0.2, { b_d3: [32.6, 9.6], b_d4: [33, 11.4], b_d5: [34.2, 14.2] }) },
    ],
  };

  MODELOS.IA26 = {
    nome: 'Bolsão do 3-2-1: pivô-armador nas costas do avançado',
    situacao: 'ataque_posicionado', atk: '3-3', def: '3-2-1', bola: 'ac',
    tags: ['3-2-1', 'bolsão', 'pivô-armador', 'corte do armador'],
    objetivo: 'Contra o 3-2-1, atacar o "bolsão" entre a linha 2 (D4/D5) e o avançado (D6): o pivô recebe ali e serve o armador que corta nas costas do D4.',
    variacoes: ['Se D4 fecha o pivô, o AE arremessa de 9 m ou serve o PE.', 'Se D6 recua ao bolsão, o AD arremessa de longe.'],
    contra: ['D6 recua e fecha o bolsão, transformando o 3-2-1 em 3-3.', 'D4 e D5 trocam e cercam o pivô.'],
    passos: [
      { t: 'AC passa ao AE.', dt: 'O 3-2-1 desloca-se para a esquerda; D4 sai no AE.', s: [P('ac', 'ae')], b: 'ae', d: DF(D321, -0.9) },
      { t: 'Inversão: AE → AD pelo ar (cruzada).', dt: 'D5 sai no AD; D6 corre para o lado direito.', s: [P('ae', 'ad')], b: 'ad', d: DF(D321, 1) },
      { t: 'O pivô entra no bolsão, entre D4/D5 e o avançado, e recebe do AD.', dt: 'D4, D5 e D6 olham a bola: ninguém marca o pivô.', s: [M('pv', [31.6, 10]), P('ad', 'pv')], p: { pv: [31.6, 10] }, b: 'pv', d: DF(D321, 0.4, { b_d4: [30.8, 8.4], b_d5: [31, 12.4], b_d6: [27.2, 10] }) },
      { t: 'AE corta nas costas do D4 e recebe a bola do pivô.', dt: 'D4 sai no pivô e abandona o corredor do AE.', s: [M('ae', [33.6, 7.4]), P('pv', 'ae')], p: { ae: [33.6, 7.4] }, b: 'ae', d: DF(D321, 0.2, { b_d4: [31.4, 9.2], b_d1: [36, 5.6] }) },
      { t: 'AE finaliza.', dt: 'D1 tenta fechar, tarde.', s: [S('ae', [40, 9.8])], d: DF(D321, 0.2, { b_d4: [31.6, 9.2], b_d1: [36, 5.8] }) },
    ],
  };

  MODELOS.IA27 = {
    nome: 'Armadilha da ponta (defesa 5-1)',
    situacao: 'defesa', atk: '3-3', def: '5-1', bola: 'ac',
    tags: ['defesa', '5-1', 'armadilha', 'ponta', 'interceptação'],
    objetivo: 'Deixar a bola chegar ao PE de propósito e fechar três saídas ao mesmo tempo: o ângulo (D1), o passe de volta (D6 recompõe) e o pivô (D2).',
    variacoes: ['Se o PE devolver ao AE, o D6 intercepta e lança o contra-ataque.', 'Se o PE finalizar, o goleiro já está no canto do ângulo fechado.'],
    contra: ['Ataque que inverte rápido para o lado oposto antes do fechamento.', 'AE que ameaça e atrai D6 para fora do fechamento.'],
    passos: [
      { t: 'AC passa ao AE: o ataque inicia a circulação.', dt: 'O defensor avançado (D6) acompanha a bola e a linha desliza.', s: [P('ac', 'ae')], b: 'ae', d: DF(D51, -0.8, { b_d6: [30.2, 8.2] }) },
      { t: 'AE passa ao PE; o pivô oferece-se.', dt: 'Gatilho: D1 pressiona o PE, D2 cobre o pivô e D6 recompõe para cortar o retorno ao AE.', s: [P('ae', 'pe'), M('pv', [33.4, 6.4])], p: { pv: [33.4, 6.4] }, b: 'pe', d: DF(D51, -0.8, { b_d1: [36.4, 2.8], b_d2: [34.2, 5.6], b_d6: [32, 5.8] }) },
      { t: 'O PE está encaixotado: sem ângulo, sem passe ao pivô e sem retorno.', dt: 'O goleiro fecha o canto do ângulo; D6 corta o passe de volta.', s: [S('pe', [40, 11.4])], d: DF(D51, -0.8, { b_d1: [36.5, 2.4], b_d2: [34.2, 5.6], b_d6: [32.4, 5.4], b_gk: [39, 10.8] }) },
    ],
  };

  MODELOS.IA28 = {
    nome: 'Relógio do jogo passivo: 20 segundos, 5 ações, uma decisão',
    situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
    tags: ['jogo passivo', 'relógio', 'último passe', 'bloqueio'],
    objetivo: 'Com o sinal de jogo passivo levantado, executar um roteiro cronometrado: três passes de preparação, o 4º passe leva a bola ao AC e o pivô dá o bloqueio para o arremesso antes do 5º passe.',
    variacoes: ['Entre 0–8 s a defesa pode ser fintada: se D2 sair, o AE finaliza no 1×1.', 'Se faltar menos de 5 s e o bloqueio não sair, o AC arremessa em suspensão por cima.'],
    contra: ['Defesa que "dobra" a bola e rouba o 4º passe.', 'Árbitro que antecipa o passivo antes do 5º passe.'],
    passos: [
      { t: '0–4 s: AC passa ao AE; o pivô desliza para a esquerda.', dt: 'Defesa desliza para a esquerda.', s: [P('ac', 'ae'), M('pv', [33.4, 7.4])], p: { pv: [33.4, 7.4] }, b: 'ae', d: DF(D60, -0.8) },
      { t: '4–8 s: AE → PE; o pivô fixa D2 (esconde o passe seguinte).', dt: 'D1 sai no PE; D2 cobre o pivô.', s: [P('ae', 'pe')], b: 'pe', d: DF(D60, -0.8, { b_d1: [36.3, 2.8], b_d2: [34.3, 6.2] }) },
      { t: '8–12 s: PE devolve ao AE, que já está pronto para voltar à circulação.', dt: 'D1 retorna à posição.', s: [P('pe', 'ae')], b: 'ae', d: DF(D60, -0.5) },
      { t: '12–16 s: AE → AC no centro; o pivô vai ao bloqueio do defensor do AC.', dt: 'Defesa vai ao centro; D3 fica na marcação do AC.', s: [P('ae', 'ac'), M('pv', [33.4, 9.6])], p: { pv: [33.4, 9.6] }, b: 'ac', d: DF(D60, 0) },
      { t: '16–20 s: o pivô bloqueia D3 e o AC usa o corta-luz.', dt: 'D3 bloqueado; D4 sai tarde.', s: [B('pv', [33.3, 10.4]), D('ac', [31.8, 10.4])], p: { pv: [33.4, 10.2], ac: [31.8, 10.4] }, d: DF(D60, 0, { b_d3: [33.6, 9.4], b_d4: [33, 11.2] }) },
      { t: 'O AC arremessa antes do 5º passe.', dt: 'Bloqueio duplo atrasado.', s: [S('ac', [40, 10.2])], d: DF(D60, 0, { b_d3: [33.6, 9.4], b_d4: [32.6, 11] }) },
    ],
  };

  /* ═════════════════════════════════════════════════════════════════════
     Entradas do Playbook (cabeçalho de cada jogada + metadados)
     ═════════════════════════════════════════════════════════════════════ */
  const NOVAS_EQUIPES = {
    BAR: { nome: 'FC Barcelona', flag: '🔵🔴', estilo: 'Clube — circulação, bloqueios e arremesso de 2ª linha.', pref: [] },
    MNE: { nome: 'Montenegro', flag: '🇲🇪', estilo: 'Seleção — ataque 7×6 intenso.', pref: [] },
    VES: { nome: 'Telekom Veszprém', flag: '🇭🇺', estilo: 'Clube — pivô de elite e jogo de bloqueio.', pref: [] },
    PSG: { nome: 'Paris Saint-Germain', flag: '🇫🇷', estilo: 'Clube — armadores fortes no 1×1.', pref: [] },
    MAG: { nome: 'SC Magdeburg', flag: '🇩🇪', estilo: 'Clube — alta velocidade e passes curtos.', pref: [] },
    FUC: { nome: 'Füchse Berlin', flag: '🇩🇪', estilo: 'Clube — 7×6 e circulação rápida.', pref: [] },
    NED: { nome: 'Holanda', flag: '🇳🇱', estilo: 'Seleção — jogo veloz de passes curtos.', pref: [] },
    CLAUDE: { nome: 'Sugestão Claude', flag: '✨', estilo: 'Jogadas autorais sugeridas pelo Claude, com leituras se/então.', pref: [] },
  };

  const CONF_IA = 'ia';
  const ENTRADAS = [
    /* ChatGPT */
    ['ChatGPT', 'IA01', 'ESP', 10, null],
    ['ChatGPT', 'IA02', 'DEN', 9.5, null],
    ['ChatGPT', 'IA03', 'FRA', 10, null],
    ['ChatGPT', 'IA04', 'BAR', 9.5, null],
    ['ChatGPT', 'IA05', 'GER', 9, null],
    ['ChatGPT', 'IA06', 'MNE', 10, null],
    ['ChatGPT', 'IA07', 'ESP', 9.5, null],
    ['ChatGPT', 'IA08', 'FRA', 9, null],
    ['ChatGPT', 'IA09', 'DEN', 10, null],
    ['ChatGPT', 'IA10', 'BAR', 10, null],
    /* Gemini */
    ['Gemini', 'IA11', 'FRA', null, 'Dika Mem, Nikola Karabatic e Ludovic Fabregas'],
    ['Gemini', 'IA12', 'DEN', null, 'Niklas Landin e Mathias Gidsel (transições)'],
    ['Gemini', 'IA13', 'BAR', null, 'Dika Mem e Timothey N\'Guessan'],
    ['Gemini', 'IA14', 'GER', null, null],
    ['Gemini', 'IA15', 'VES', null, null],
    ['Gemini', 'IA16', 'SWE', null, 'Jim Gottfridsson'],
    ['Gemini', 'IA17', 'PSG', null, 'Sander Sagosen (Noruega)'],
    ['Gemini', 'IA18', 'MAG', null, null],
    ['Gemini', 'IA19', 'DEN', null, null],
    ['Gemini', 'IA20', 'ESP', null, 'Joan Cañellas e Alex Dujshebaev'],
    /* Claude */
    ['Claude', 'IA21', 'CLAUDE', 10, null],
    ['Claude', 'IA22', 'CLAUDE', 9.5, null],
    ['Claude', 'IA23', 'CLAUDE', 9, null],
    ['Claude', 'IA24', 'CLAUDE', 10, null],
    ['Claude', 'IA25', 'CLAUDE', 9.5, null],
    ['Claude', 'IA26', 'CLAUDE', 9, null],
    ['Claude', 'IA27', 'CLAUDE', 8.5, null],
    ['Claude', 'IA28', 'CLAUDE', 8.5, null],
  ];

  /* Gemini: equipes adicionais citadas como "utilizado por" em mais de uma seleção */
  const EXTRA_EQUIPE_TXT = {
    IA14: 'Citada para Alemanha e Espanha (situação de superioridade numérica).',
    IA15: 'Citada para Telekom Veszprém e Croácia.',
    IA17: 'Citada para Paris Saint-Germain e Noruega.',
    IA18: 'Citada para SC Magdeburg e Holanda.',
    IA19: 'Citada para Dinamarca e Füchse Berlin.',
  };

  /* ── Leituras (se/então) das jogadas do Claude ── */
  const LEITURAS = {
    IA21: [
      'SE o D1 acompanha o deslizamento → o PE recebe e finaliza no ângulo aberto.',
      'SE o D3 corta o passe ao AE no loop → o AC finaliza de 9 m (o corte abre o centro).',
      'SE o D5 salta no AD → o ex-AC, que cortou, está livre: servir o AC.',
    ],
    IA22: [
      'SE o D6 recua ao 6-0 → AE arremessa de 9 m (corredor central livre).',
      'SE o D6 fica → AC (agora pivô) abre à direita e a 1ª linha circula sem pressão.',
      'SE D4 dobra o ex-AC → AD finaliza ou devolve ao pivô esquerdo.',
    ],
    IA23: [
      'SE a barreira volta à esquerda a tempo → AC cobra direto (ela abre um vão).',
      'SE o D3 sai com o AE → o pivô fica livre: servi-lo no giro.',
      'SE o goleiro antecipa o passe ao AE → AC passa ao pivô esquerdo antes.',
    ],
    IA24: [
      'SE D6 fecha o PD → AD arremessa de 9 m (D5 fica sozinho no pivô).',
      'SE D5 fecha os dois → o pivô, deslizando ao contrário, recebe livre.',
      'SE o 7º jogador é interceptado → PE e PD já voltam recompor a defesa (risco de baliza vazia).',
    ],
    IA25: [
      'SE D3 não sobe com o pivô → o pivô-armador arremessa de 9 m.',
      'SE D5 acompanha o PD → o pivô-armador serve o AD, que corta no espaço vago.',
      'SE a defesa troca para 5-1 → pivô volta à área e o PD vira ponta: reabrir à 6-0.',
    ],
    IA26: [
      'SE D4 fecha o pivô → AE arremessa de 9 m ou serve o PE.',
      'SE D6 recua ao bolsão → AD arremessa de longe (a linha 3 perde profundidade).',
      'SE D4 e D5 trocam e cercam o pivô → inversão ao AD, que já está aberto.',
    ],
    IA27: [
      '(Para a defesa) SE o PE devolve ao AE → D6 intercepta e dispara o contra-ataque.',
      'SE o ataque inverte antes do fechamento → D1 e D2 retornam e a defesa vira 6-0.',
      'SE o AE ameaça e atrai D6 → o goleiro cobre o ângulo e D2 permanece no pivô.',
    ],
    IA28: [
      '0–8 s: SE D2 sair na finta → AE finaliza no 1×1.',
      '8–16 s: SE D1 não voltar da ponta → AC arremessa pelo meio.',
      '16–20 s: SE o bloqueio não sair → AC arremessa em suspensão por cima.',
    ],
  };

  /* ── Extensão de metadados ── */
  db.meta.niveis.ia = 'Sugestão de IA — a validar';
  db.meta.iaFontes = {
    ChatGPT: 'Jogadas do ChatGPT (anexo 2) — descrição textual; geometria didática; associação equipe→jogada não confirmada em vídeo.',
    Gemini: 'Jogadas do Gemini (anexo 3) — descrição textual; atletas citados pela IA, não confirmados; geometria didática.',
    Claude: 'Jogadas autorais do Claude — modelos originais com leituras se/então; a validar em treino e vídeo.',
  };
  db.meta.versao = '1.1.0';
  db.meta.atualizado = '2026-11-11';

  Object.keys(NOVAS_EQUIPES).forEach(k => { db.equipes[k] = NOVAS_EQUIPES[k]; });
  Object.keys(MODELOS).forEach(k => { db.modelos[k] = MODELOS[k]; });

  const jogadasIA = ENTRADAS.map(([ia, mid, eq, cx, ref]) => {
    const m = MODELOS[mid];
    const team = db.equipes[eq];
    return {
      id: `${eq}-IA-${ia}-${mid}`,
      modelo: mid,
      equipe: eq,
      equipeNome: team.nome,
      flag: team.flag,
      genero: 'M',
      categoria: 'Principal',
      nome: m.nome,
      situacao: m.situacao,
      atk: m.atk,
      def: m.def,
      conf: CONF_IA,
      ia: ia,
      complexidade: cx,
      referencia: ref,
      obsEquipe: EXTRA_EQUIPE_TXT[mid] || null,
      tags: m.tags.concat(['IA', ia]),
      objetivo: m.objetivo,
      variacoes: m.variacoes,
      contra: m.contra,
      leituras: LEITURAS[mid] || null,
      estilo: team.estilo,
      contexto: null,
      fonte: null,
    };
  });

  db.jogadasIA = jogadasIA;
  db.jogadas = db.jogadas.concat(jogadasIA);
})(window);
