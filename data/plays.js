/**
 * =========================================================================
 * ADESP / CDHU 3.0 — BASE DE JOGADAS (PLAYBOOK DB)
 * Arquivo: data/plays.js
 *
 * Coordenadas: quadra 40 x 20 m. x: 0→40 (gol de ataque em x=40), y: 0→20.
 * Atacantes: a_gk a_pe a_ae a_ac a_ad a_pd a_pv   |   Defensores: b_gk b_d1..b_d6
 * Nas jogadas, "pe ae ac ad pd pv gk" são atalhos para os ids a_*.
 *
 * NÍVEIS DE CONFIANÇA
 *   validada  : conferida em vídeo oficial, com link em "fonte"
 *   tendencia : identidade amplamente reconhecida da seleção principal
 *   hipotese  : base/formação (Sub20, Sub18) ou feminino — A VALIDAR em vídeo
 *   modelo    : jogada didática genérica (geometria dos modelos)
 *
 * AVISO: a geometria dos modelos é didática. A associação "equipe → jogada"
 * indica tendência/hipótese de uso, não a reprodução exata de uma jogada
 * gravada. Valide em vídeo antes de usar em treino.
 * =========================================================================
 */
(function (window) {
  'use strict';

  const P = (a, b) => ['pass', a, b];
  const M = (a, pt) => ['move', a, pt];
  const D = (a, pt) => ['dribble', a, pt];
  const S = (a, pt) => ['shot', a, pt];
  const B = (a, pt) => ['block', a, pt];

  /* ── Meta ── */
  const META = {
    versao: '1.0.0',
    atualizado: '2026-11-10',
    aviso:
      'Geometria didática. A ligação equipe→jogada é tendência/hipótese a validar em vídeo (EHF, IHF, canais oficiais).',
    niveis: {
      validada: 'Validada em vídeo',
      tendencia: 'Tendência reconhecida',
      hipotese: 'Hipótese a validar',
      modelo: 'Modelo didático',
    },
    fontesVerificadas: [
      { titulo: 'Final do EHF EURO 2026 masculino: Dinamarca 34–27 Alemanha', url: 'https://en.wikipedia.org/wiki/2026_European_Men%27s_Handball_Championship_final' },
      { titulo: 'EHF — declarações pós-jogo (final e bronze), 1 fev 2026', url: 'https://beach.eurohandball.com/news/en/mens-ehf-euro-2026-post-match-flash-quotes-1-february/' },
      { titulo: 'EHF — Dinamarca 32–29 França, fase principal', url: 'https://beach.eurohandball.com/news/en/denmark-strike-back-in-intense-clash-of-the-giants-at-mens-ehf-euro-2026/' },
      { titulo: 'M20 EHF EURO 2026 (Romênia): Hungria campeã, Suécia vice', url: 'https://en.wikipedia.org/wiki/2026_European_Men%27s_U-20_Handball_Championship' },
    ],
  };

  const CATEGORIAS = [
    { id: 'Principal', nome: 'Seleção principal / Adulto' },
    { id: 'Sub20', nome: 'Sub-20 (Júnior)' },
    { id: 'Sub18', nome: 'Sub-18 (Juvenil)' },
  ];

  /* ── Equipes (identidade = tendência geral, a validar) ── */
  const TEAMS = {
    DEN: { nome: 'Dinamarca', flag: '🇩🇰', estilo: 'Transição rápida, 1×1 de armadores, goleiro de alto nível.', pref: ['T06', 'T01', 'T11', 'T03', 'T05', 'T12'] },
    GER: { nome: 'Alemanha', flag: '🇩🇪', estilo: 'Organização, apoio no pivô, defesa física e 7×6.', pref: ['T03', 'T05', 'T02', 'T01', 'T12', 'T09'] },
    FRA: { nome: 'França', flag: '🇫🇷', estilo: 'Defesa física/agressiva, bloqueios do pivô, finalização de 2ª linha.', pref: ['T02', 'T12', 'T07', 'T01', 'T11'] },
    ESP: { nome: 'Espanha', flag: '🇪🇸', estilo: 'Circulação paciente, bom jogo de pivô e pontas.', pref: ['T09', 'T03', 'T10', 'T02', 'T01'] },
    SWE: { nome: 'Suécia', flag: '🇸🇪', estilo: 'Atlética, jogo rápido, 1×1 e pontas.', pref: ['T06', 'T11', 'T04', 'T12', 'T01'] },
    NOR: { nome: 'Noruega', flag: '🇳🇴', estilo: 'Velocidade, troca de posições e 7×6.', pref: ['T06', 'T05', 'T04', 'T01', 'T11'] },
    CRO: { nome: 'Croácia', flag: '🇭🇷', estilo: 'Bloqueios e finalização de média distância.', pref: ['T02', 'T07', 'T01', 'T12', 'T09'] },
    ISL: { nome: 'Islândia', flag: '🇮🇸', estilo: 'Pivô e pontas em rotação, ataque posicionado organizado.', pref: ['T03', 'T04', 'T10', 'T01', 'T09'] },
    POR: { nome: 'Portugal', flag: '🇵🇹', estilo: 'Armadores com média distância e ataque rápido.', pref: ['T01', 'T11', 'T02', 'T07', 'T09'] },
    EGY: { nome: 'Egito', flag: '🇪🇬', estilo: 'Defesa física e contra-ataque.', pref: ['T12', 'T06', 'T03', 'T07', 'T02'] },
    BRA: { nome: 'Brasil', flag: '🇧🇷', estilo: 'Circulação, ritmo e jogo de pontas.', pref: ['T09', 'T06', 'T04', 'T03', 'T01'] },
    HUN: { nome: 'Hungria', flag: '🇭🇺', estilo: 'Ataque posicionado com circulação e pivô.', pref: ['T01', 'T10', 'T03', 'T09', 'T06'] },
    SLO: { nome: 'Eslovênia', flag: '🇸🇮', estilo: 'Circulação e bloqueios de pivô.', pref: ['T09', 'T02', 'T03', 'T01', 'T07'] },
  };

  /* Combinações equipe × gênero × categoria */
  const MASC = ['DEN', 'GER', 'FRA', 'ESP', 'SWE', 'NOR', 'CRO', 'ISL', 'POR', 'EGY', 'BRA', 'HUN', 'SLO'];
  const FEM = ['BRA', 'FRA', 'NOR', 'DEN', 'ESP', 'HUN', 'GER'];

  /* Fatos verificados (jan–jul 2026). Demais entradas: null. */
  const CONTEXTO = {
    'DEN|M|Principal': 'Campeã do EHF EURO 2026 (34–27 sobre a Alemanha); técnico Nikolaj Jacobsen.',
    'GER|M|Principal': 'Vice-campeã do EHF EURO 2026; técnico Alfred Gíslason.',
    'CRO|M|Principal': 'Medalha de bronze no EHF EURO 2026; técnico Dagur Sigurdsson.',
    'ISL|M|Principal': 'Quarto lugar no EHF EURO 2026.',
    'POR|M|Principal': 'Melhor resultado da história em Europeus (EHF EURO 2026).',
    'FRA|M|Principal': 'Perdeu para a Dinamarca por 32–29 na fase principal do EHF EURO 2026.',
    'HUN|M|Sub20': 'Campeã do M20 EHF EURO 2026 (1º título); venceu a Eslovênia por 31–24 na semifinal.',
    'SWE|M|Sub20': 'Vice-campeã do M20 EHF EURO 2026; venceu a Dinamarca por 38–35 na semifinal.',
    'DEN|M|Sub20': 'Semifinalista do M20 EHF EURO 2026 (derrota de 35–38 para a Suécia).',
    'SLO|M|Sub20': 'Semifinalista do M20 EHF EURO 2026 (derrota de 24–31 para a Hungria).',
  };
  const FONTE_CTX = {
    Principal: 'https://en.wikipedia.org/wiki/2026_European_Men%27s_Handball_Championship_final',
    Sub20: 'https://en.wikipedia.org/wiki/2026_European_Men%27s_U-20_Handball_Championship',
  };

  /* ── Formação base (ataque 3-3, quadra de 40 m; gol em x=40) ── */
  const F33 = {
    gk: [2, 10], pe: [36.8, 1.4], ae: [30, 5.2], ac: [29.5, 10], ad: [30, 14.8], pd: [36.8, 18.6], pv: [33.3, 10],
  };

  /* Defesa 6-0 base (mesmas posições de DEF_SYSTEMS['6-0'] em tatica.html) e linha deslizante */
  const DB6 = { b_d1: [36.5, 3.5], b_d2: [34.8, 6.2], b_d3: [34, 8.8], b_d4: [34, 11.2], b_d5: [34.8, 13.8], b_d6: [36.5, 16.5] };
  /* DL(dy, extra): linha defensiva deslocada dy metros (y<0 = lado do PE; y>0 = lado do PD) + ajustes individuais */
  const DL = (dy, extra) => {
    const o = {};
    Object.keys(DB6).forEach(k => { o[k] = [DB6[k][0], Math.max(2.4, Math.min(17.6, +(DB6[k][1] + dy).toFixed(2)))]; });
    return Object.assign(o, extra || {});
  };

  /* ── MODELOS DE JOGADAS (geometria didática) ──
     passo = { t: ataque, dt: defesa, s: setas do ataque, p: posições do ataque após o passo,
               b: portador da bola após o passo, d: posições da defesa após o passo }
     O goleiro adversário (b_gk) acompanha a bola automaticamente e defende o canto do arremesso. */
  const TEMPLATES = {
    T01: {
      nome: 'Cruzamento de armadores com entrada de pivô',
      situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
      tags: ['cruzamento', 'pivô', '1×1', '3-3'],
      objetivo: 'Fixar o central da defesa e liberar a chegada do AC pelo lado oposto.',
      variacoes: ['Opção A: defesa fecha no AC → passe ao pivô na brecha.', 'Opção B: defesa abre → passe ao PE.'],
      contra: ['Troca de marcação entre D2 e D3 no cruzamento.', 'D2 dobra no pivô.'],
      passos: [
        { t: 'AC passa ao AE; pivô desloca-se para o lado do AE.', dt: 'Defesa desliza para o lado da bola.', s: [P('ac', 'ae'), M('pv', [33.4, 8.2])], p: { pv: [33.4, 8.2] }, b: 'ae', d: DL(-0.8) },
        { t: 'AE infiltra em 1×1 e fixa o defensor; AC cruza por trás.', dt: 'D3 sai no AE; D2 acompanha o AC.', s: [D('ae', [31.2, 8.8]), M('ac', [30.8, 6.4])], p: { ae: [31.2, 8.8], ac: [30.8, 6.4] }, d: DL(-0.5, { b_d3: [32.6, 8.9], b_d2: [33.8, 6.6], b_d4: [34, 10.6] }) },
        { t: 'AE devolve ao AC, que chega em velocidade.', dt: 'D2 sai agressivo no AC; D3 recompõe.', s: [P('ae', 'ac')], b: 'ac', d: DL(-0.5, { b_d2: [32.6, 6.6], b_d3: [33.9, 8.6], b_d1: [35.8, 4.6] }) },
        { t: 'AC arremessa de 9 m.', dt: 'D2 salta para o bloqueio.', s: [S('ac', [40, 10.6])], d: DL(-0.5, { b_d2: [32, 6.8], b_d3: [33.9, 8.6], b_d1: [35.8, 4.6] }) },
      ],
    },
    T02: {
      nome: 'Bloqueio do pivô para o armador direito',
      situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
      tags: ['bloqueio', 'corta-luz', 'pivô', 'média distância'],
      objetivo: 'Criar espaço de arremesso de 9 m para o AD com o corta-luz do pivô.',
      variacoes: ['Se o defensor passar o bloqueio por trás: AD finaliza.', 'Se a defesa trocar: pivô gira e recebe.'],
      contra: ['Defensor "passa por cima" do bloqueio.', 'D5 sai agressivo no AD.'],
      passos: [
        { t: 'AC passa ao AD.', dt: 'Defesa desliza para o lado direito.', s: [P('ac', 'ad')], b: 'ad', d: DL(0.8) },
        { t: 'Pivô vai ao bloqueio no defensor do AD.', dt: 'D5 luta contra o bloqueio; D4 ajuda por dentro.', s: [M('pv', [33.4, 12.8]), B('pv', [33.2, 13.4])], p: { pv: [33.4, 12.8] }, d: DL(0.8, { b_d5: [34.6, 14.2], b_d4: [33.8, 12] }) },
        { t: 'AD usa o bloqueio e arremessa.', dt: 'D5 contorna o bloqueio; D4 sai para bloquear o arremesso.', s: [D('ad', [31, 12.8]), S('ad', [40, 9.4])], p: { ad: [31, 12.8] }, d: DL(0.8, { b_d5: [33, 13.9], b_d4: [32.6, 11.8] }) },
      ],
    },
    T03: {
      nome: 'Passe ao ponta após fixação do pivô',
      situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
      tags: ['ponta', 'pivô', 'fixação'],
      objetivo: 'Fixar D2/D3 com pivô e armador para abrir o passe ao ponta esquerdo.',
      variacoes: ['Defesa fecha no ponta → AE arremessa ou passa ao pivô.'],
      contra: ['D1 antecipa o passe ao ponta.', 'Defesa em 5-1 com avançado no AE.'],
      passos: [
        { t: 'AC passa ao AE; pivô fixa D2/D3.', dt: 'Defesa desliza para o lado do AE.', s: [P('ac', 'ae'), M('pv', [33.4, 7.2])], p: { pv: [33.4, 7.2] }, b: 'ae', d: DL(-0.8) },
        { t: 'AE finta o arremesso, atraindo o defensor do ponta.', dt: 'D2 sai no AE; D1 mantém a cobertura do ponta.', s: [D('ae', [31, 6.6])], p: { ae: [31, 6.6], pe: [37.2, 1.3] }, d: DL(-0.8, { b_d2: [33.2, 6.4] }) },
        { t: 'AE passa ao PE.', dt: 'D1 fecha no PE; D2 recompõe a linha.', s: [P('ae', 'pe')], b: 'pe', d: DL(-0.8, { b_d1: [36.4, 2.7], b_d2: [33.9, 6] }) },
        { t: 'PE finaliza em ângulo fechado.', dt: 'D1 tenta fechar o ângulo.', s: [S('pe', [40, 11.2])], d: DL(-0.8, { b_d1: [36.6, 2.3], b_d2: [33.9, 6] }) },
      ],
    },
    T04: {
      nome: 'Troca de posição ponta × armador (infiltração)',
      situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
      tags: ['infiltração', 'troca de posição', 'ponta'],
      objetivo: 'Surpreender a marcação com a infiltração do ponta no corredor do armador.',
      variacoes: ['PD finaliza ou devolve ao AD na ponta.'],
      contra: ['Defesa mantém marcação por zona e não segue a troca.'],
      passos: [
        { t: 'AC passa ao AD.', dt: 'Defesa desliza para o lado direito.', s: [P('ac', 'ad')], b: 'ad', d: DL(0.8) },
        { t: 'PD infiltra enquanto AD abre para a ponta.', dt: 'D6 acompanha o AD na ponta; D5 fecha a infiltração.', s: [M('pd', [33.6, 15.2]), M('ad', [36.6, 17.5])], p: { pd: [33.6, 15.2], ad: [36.6, 17.5] }, d: DL(0.8, { b_d6: [36.2, 17], b_d5: [34.2, 14.8] }) },
        { t: 'AD passa ao PD infiltrado.', dt: 'D5 e D6 fecham o corredor tarde.', s: [P('ad', 'pd')], b: 'pd', d: DL(0.8, { b_d5: [33.8, 14.4], b_d6: [35.4, 16.4] }) },
        { t: 'PD finaliza.', dt: 'D5 tenta o bloqueio.', s: [S('pd', [40, 9.2])], d: DL(0.8, { b_d5: [33.2, 14.6], b_d6: [35.4, 16.4] }) },
      ],
    },
    T05: {
      nome: '7×6: circulação e finalização do pivô',
      situacao: 'superioridade_7x6', atk: '7x6', def: '6-0', bola: 'ac',
      ini: { ae: [30.5, 4.2], gk: [30, 7.6], ac: [29.5, 10.8], ad: [30.5, 15.8] },
      tags: ['7×6', 'goleiro-linha', 'pivô', 'circulação'],
      objetivo: 'Usar a superioridade numérica para circular rápido e achar o pivô livre.',
      variacoes: ['Se o pivô for dobrado: ponta finaliza.'],
      contra: ['Defesa 6-0 compacta fecha os corredores.', 'Risco de perda e gol em baliza vazia.'],
      passos: [
        { t: 'AC passa ao 7º jogador (goleiro-linha).', dt: 'Defesa compacta, ajusta ao centro.', s: [P('ac', 'gk')], b: 'gk', d: DL(-0.4) },
        { t: 'Circulação rápida para o AD; pivô muda de lado.', dt: 'Defesa corre para o lado direito; falta um defensor.', s: [P('gk', 'ad'), M('pv', [33.4, 12.4])], p: { pv: [33.4, 12.4] }, b: 'ad', d: DL(1.2) },
        { t: 'AD passa ao pivô.', dt: 'D4 e D5 tentam dobrar no pivô.', s: [P('ad', 'pv')], b: 'pv', d: DL(1.2, { b_d4: [33.9, 11.6], b_d5: [34, 13.4] }) },
        { t: 'Pivô finaliza.', dt: 'Bloqueio duplo sem tempo de reação.', s: [S('pv', [40, 9.8])], d: DL(1.2, { b_d4: [33.8, 11.6], b_d5: [33.9, 13.4] }) },
      ],
    },
    T06: {
      nome: 'Contra-ataque: saída do goleiro e 2ª onda',
      situacao: 'contra_ataque', atk: 'contra', def: '6-0', bola: 'gk',
      ini: { pe: [18, 1.8], ae: [14, 6.5], ac: [13, 10], ad: [14, 13.5], pd: [18, 18.2], pv: [22, 10] },
      defPos: { b_d1: [26, 4], b_d2: [25, 7.5], b_d3: [25.5, 10], b_d4: [25, 12.5], b_d5: [26, 15.5], b_d6: [27, 18] },
      tags: ['contra-ataque', '1ª onda', '2ª onda', 'ponta'],
      objetivo: 'Transformar a defesa em ataque rápido pelos pontas antes da defesa se organizar.',
      variacoes: ['Passe longo direto ao ponta (1ª onda).', '2ª onda com armador finalizando.'],
      contra: ['Recuperação defensiva rápida e falta tática.'],
      passos: [
        { t: 'Goleiro lança ao AE; pontas e pivô avançam.', dt: 'Defesa em recuperação (transição defensiva).', s: [P('gk', 'ae')], p: { pe: [28, 1.8], pd: [28, 18.2], ac: [22, 10], ad: [22, 13.5], pv: [27, 10] }, b: 'ae',
          d: { b_d1: [30, 4.2], b_d2: [30, 7.4], b_d3: [30.5, 10], b_d4: [30, 12.6], b_d5: [30.5, 15.4], b_d6: [31, 17.6] } },
        { t: 'AE lança o PE em velocidade.', dt: 'D1 corre para fechar a ponta; linha recompõe.', s: [P('ae', 'pe'), M('pe', [37.2, 1.3])], p: { pe: [37.2, 1.3] }, b: 'pe',
          d: { b_d1: [35, 3], b_d2: [33.5, 6.5], b_d3: [33.5, 9], b_d4: [33.5, 11.5], b_d5: [34, 14.2], b_d6: [35, 16.6] } },
        { t: 'PE finaliza.', dt: 'D1 chega atrasado no bloqueio.', s: [S('pe', [40, 11])], d: { b_d1: [36.4, 2.5], b_d2: [33.8, 6.4], b_d3: [33.8, 9], b_d4: [33.8, 11.4], b_d5: [34.4, 14], b_d6: [35.6, 16.6] } },
      ],
    },
    T07: {
      nome: 'Tiro livre de 9 m com bloqueio e passe ao pivô',
      situacao: 'bola_parada', atk: '3-3', def: '6-0', bola: 'ac',
      ini: { ac: [31, 10], ae: [30.5, 6], ad: [30.5, 14], pv: [33.2, 10] },
      tags: ['bola parada', '9 m', 'bloqueio', 'pivô'],
      objetivo: 'Cobrar o livre com bloqueio de pivô e entrega ao pivô no corredor.',
      variacoes: ['Cobrança direta do AC se a barreira abrir.'],
      contra: ['Barreira fecha o corredor central.'],
      passos: [
        { t: 'AC passa ao AD; pivô se prepara para o bloqueio.', dt: 'Barreira desliza para o lado direito.', s: [P('ac', 'ad'), M('pv', [33.3, 12.6])], p: { pv: [33.3, 12.6] }, b: 'ad', d: DL(1) },
        { t: 'Pivô bloqueia; AD infiltra.', dt: 'D5 luta contra o bloqueio; D4 sai no AD.', s: [B('pv', [33.3, 12.9]), D('ad', [31.2, 12.8])], p: { ad: [31.2, 12.8] }, d: DL(1, { b_d5: [34.6, 14], b_d4: [32.9, 11.9] }) },
        { t: 'AD passa ao pivô.', dt: 'D4 e D5 fecham tarde sobre o pivô.', s: [P('ad', 'pv')], b: 'pv', d: DL(1, { b_d4: [33.7, 12.2], b_d5: [34, 13.8] }) },
        { t: 'Pivô finaliza.', dt: 'D5 tenta o bloqueio.', s: [S('pv', [40, 10])], d: DL(1, { b_d4: [33.7, 12], b_d5: [33.9, 13.6] }) },
      ],
    },
    T08: {
      nome: 'Tiro de 7 metros',
      situacao: 'bola_parada', atk: '3-3', def: '6-0', bola: 'ac',
      ini: { ac: [33, 10], ae: [30, 6], ad: [30, 14], pv: [31.5, 10] },
      defPos: { b_d1: [29.5, 3.5], b_d2: [29.6, 6.2], b_d3: [29.7, 8.8], b_d4: [29.7, 11.2], b_d5: [29.6, 13.8], b_d6: [29.5, 16.5] },
      tags: ['7 m', 'bola parada'],
      objetivo: 'Cobrança com variação de canto conforme o hábito do goleiro adversário.',
      variacoes: ['Canto baixo direito / alto esquerdo conforme o scout do goleiro.'],
      contra: ['Goleiro com leitura do cobrador.'],
      passos: [{ t: 'Cobrança do tiro de 7 m.', dt: 'Goleiro escolhe o canto; defesa recua para o rebote.', s: [S('ac', [40, 8.9])], d: { b_gk: [39, 9.1], b_d3: [33.5, 8.8], b_d4: [33.5, 11.2] } }],
    },
    T09: {
      nome: 'Circulação paciente com troca de lados',
      situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
      tags: ['circulação', 'jogo passivo', 'troca de lados'],
      objetivo: 'Mover a defesa lateralmente e achar espaço no lado fraco (controle de jogo passivo).',
      variacoes: ['Se a defesa não acompanhar a troca: AD arremessa.'],
      contra: ['Defesa avançada rompe a circulação.'],
      passos: [
        { t: 'AC passa ao AE.', dt: 'Defesa desliza para a esquerda.', s: [P('ac', 'ae')], b: 'ae', p: { pv: [33.4, 8.4] }, d: DL(-0.7) },
        { t: 'AE passa ao PE; pivô fixa.', dt: 'D1 fecha no PE; D2 cobre o pivô.', s: [P('ae', 'pe'), M('pv', [33.4, 7])], p: { pv: [33.4, 7] }, b: 'pe', d: DL(-0.7, { b_d1: [36.3, 2.8], b_d2: [34.2, 6.2] }) },
        { t: 'PE devolve ao AE; bola volta para a 2ª linha.', dt: 'D1 retorna à posição.', s: [P('pe', 'ae')], b: 'ae', d: DL(-0.5) },
        { t: 'AE → AC → AD: troca de lado.', dt: 'Defesa corre para o lado direito.', s: [P('ae', 'ac'), M('pv', [33.4, 12.6])], p: { pv: [33.4, 12.6] }, b: 'ac', d: DL(0.4, { b_d5: [34.4, 13.4], b_d4: [33.9, 11.8] }) },
        { t: 'AC passa ao AD.', dt: 'D5 e D6 saem para o AD.', s: [P('ac', 'ad')], b: 'ad', d: DL(1.2) },
        { t: 'AD arremessa.', dt: 'D5 salta para bloquear.', s: [S('ad', [40, 9.2])], d: DL(1.2, { b_d5: [33.1, 14], b_d6: [35.4, 16] }) },
      ],
    },
    T10: {
      nome: 'Ataque 4-2 com dois pivôs',
      situacao: 'ataque_posicionado', atk: '4-2', def: '6-0', bola: 'ad',
      ini: { ae: [30, 6], ad: [30, 14], pv: [33.3, 12.4], ac: [33.3, 7.6] },
      tags: ['dois pivôs', '4-2', 'bloqueio'],
      objetivo: 'Dois pivôs travam os dois lados e abrem corredores para as finalizações.',
      variacoes: ['Passe ao 2º pivô após bloqueio.'],
      contra: ['Defesa 5-1 que sai nos armadores.'],
      passos: [
        { t: 'AD passa ao AE; pivôs abrem espaço.', dt: 'Defesa desliza; D3 e D4 dividem os pivôs.', s: [P('ad', 'ae')], b: 'ae', d: DL(-0.6) },
        { t: 'Pivô 2 (ex-AC) bloqueia; AE infiltra.', dt: 'D2 luta contra o bloqueio; D1 aperta.', s: [B('ac', [33.2, 5.6]), D('ae', [31, 6.6])], p: { ae: [31, 6.6] }, d: DL(-0.6, { b_d2: [33.8, 5.4], b_d1: [36, 4] }) },
        { t: 'AE passa ao pivô 2.', dt: 'D2 e D3 tentam fechar o pivô 2.', s: [P('ae', 'ac')], b: 'ac', d: DL(-0.6, { b_d2: [33.8, 6.4], b_d3: [33.8, 8.4] }) },
        { t: 'Pivô 2 finaliza.', dt: 'D3 tenta o bloqueio.', s: [S('ac', [40, 9])], d: DL(-0.6, { b_d2: [33.8, 6.4], b_d3: [33.6, 8.2] }) },
      ],
    },
    T11: {
      nome: '1×1 do armador central e passe ao ponta direito',
      situacao: 'ataque_posicionado', atk: '3-3', def: '6-0', bola: 'ac',
      tags: ['1×1', 'ponta', 'fixação'],
      objetivo: 'Fixar dois defensores no 1×1 do AC e finalizar pelo ponta.',
      variacoes: ['Se a defesa não fechar: AC arremessa.'],
      contra: ['D4 e D5 fecham o ponta com ajuda do goleiro.'],
      passos: [
        { t: 'AC conduz em 1×1 contra D3/D4.', dt: 'D3 e D4 saem juntos para fechar o AC.', s: [D('ac', [31.8, 10.4])], p: { ac: [31.8, 10.4], pd: [37.2, 17.6] }, d: DL(0, { b_d3: [33, 9.4], b_d4: [33, 11] }) },
        { t: 'AC passa ao PD.', dt: 'D6 fecha no PD; D5 cobre por dentro.', s: [P('ac', 'pd')], b: 'pd', d: DL(0.4, { b_d6: [36.2, 16.8], b_d5: [35, 15] }) },
        { t: 'PD finaliza.', dt: 'D6 tenta fechar o ângulo.', s: [S('pd', [40, 8.9])], d: DL(0.4, { b_d6: [36.4, 17], b_d5: [34.8, 15] }) },
      ],
    },
    T12: {
      nome: 'Defesa 6-0 com saída agressiva e contra-medida do ataque',
      situacao: 'defesa', atk: '3-3', def: '6-0', bola: 'ac',
      tags: ['defesa', '6-0', 'saída do defensor', 'pivô'],
      objetivo: 'Defesa pressiona o armador com saída de D2; ataque explora o espaço deixado pelo pivô.',
      variacoes: ['Defesa ajusta com D3 cobrindo o pivô.'],
      contra: ['Pivô livre quando a cobertura atrasa.'],
      passos: [
        { t: 'Bola vai ao AE.', dt: 'D2 sai agressivo no AE; D3 desloca-se para cobrir; a linha comprime.', s: [P('ac', 'ae')], p: { pv: [33.5, 8] }, b: 'ae', d: DL(-0.6, { b_d2: [32, 5.6], b_d3: [33.6, 7.6], b_d1: [35.2, 4.2], b_d4: [33.8, 10], b_d5: [34.6, 12.8] }) },
        { t: 'Contra-medida: passe ao pivô no espaço deixado.', dt: 'D3 chega atrasado na cobertura do pivô.', s: [P('ae', 'pv')], b: 'pv', d: DL(-0.6, { b_d2: [32, 5.6], b_d3: [33.8, 9], b_d1: [35.2, 4.2], b_d4: [33.8, 10.2] }) },
        { t: 'Pivô finaliza.', dt: 'D3 e D4 tentam o bloqueio.', s: [S('pv', [40, 9.6])], d: DL(-0.6, { b_d2: [32.2, 6], b_d3: [33.4, 8.9], b_d4: [33.6, 9.8], b_d1: [35.2, 4.2] }) },
      ],
    },
  };

  /* ── Expansão: equipe × gênero × categoria × modelos ── */
  function pickTemplates(pref, cat) {
    if (cat === 'Principal') return pref.slice(0, 5).concat('T08');
    if (cat === 'Sub20') return pref.slice(0, 4);
    const base = pref.slice(0, 3);
    base.push(base.includes('T09') ? 'T08' : 'T09');
    return base;
  }

  function buildPlays() {
    const out = [];
    const add = (code, gen) => {
      const team = TEAMS[code];
      CATEGORIAS.forEach(cat => {
        pickTemplates(team.pref, cat.id).forEach(tid => {
          const t = TEMPLATES[tid];
          const ctxKey = `${code}|${gen}|${cat.id}`;
          const conf = cat.id === 'Principal' && gen === 'M' ? 'tendencia' : 'hipotese';
          out.push({
            id: `${code}-${gen}-${cat.id}-${tid}`,
            modelo: tid,
            equipe: code,
            equipeNome: team.nome,
            flag: team.flag,
            genero: gen,
            categoria: cat.id,
            nome: t.nome,
            situacao: t.situacao,
            atk: t.atk,
            def: t.def,
            conf,
            tags: t.tags,
            objetivo: t.objetivo,
            variacoes: t.variacoes,
            contra: t.contra,
            estilo: team.estilo,
            contexto: CONTEXTO[ctxKey] || null,
            fonte: CONTEXTO[ctxKey] ? FONTE_CTX[cat.id] || null : null,
          });
        });
      });
    };
    MASC.forEach(c => add(c, 'M'));
    FEM.forEach(c => add(c, 'F'));
    return out;
  }

  window.PLAYS_DB = {
    meta: META,
    categorias: CATEGORIAS,
    equipes: TEAMS,
    modelos: TEMPLATES,
    jogadas: buildPlays(),
    F33,
  };
})(window);
