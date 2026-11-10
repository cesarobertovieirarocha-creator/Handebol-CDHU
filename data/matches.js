/* =========================================================================
   DADOS DAS PARTIDAS E CENTRAL DE JOGO (MATCH CENTER) — ADESP/CDHU
   Consumido por: js/modal.js e performance.html
   Dados completos com súmula digital, momentum, parciais e eventos minuto a minuto.
========================================================================= */
var matchData = {
    'paracatu': {
        id: 'paracatu',
        title: 'Handebol Paracatu 21 x 28 ADESP/CDHU',
        adversario: 'APHA Paracatu',
        competicao: 'LIDTAP 2026 — Liga Regional do Triângulo e Alto Paranaíba',
        fase: 'Fase de Classificação — Rodada 3',
        date: '18 de Abril, 2026',
        horario: '16:30',
        ginasio: 'Arena Tancredo Neves — Uberlândia/MG',
        arbitragem: 'Marcio Silva & Rodrigo Silveira (FMG/CBHb)',
        delegado: 'Carlos Eduardo Mendes',
        publico: '420 torcedores',
        placarFinal: { adesp: 28, adversario: 21 },
        parciais: {
            primeiroTempo: { adesp: 13, adversario: 11 },
            segundoTempo: { adesp: 15, adversario: 10 }
        },
        mvp: 'Gabriel Augusto "Bahia"',
        golsMvp: 7,
        recap: 'A ADESP/CDHU venceu o APHA Paracatu por 28 a 21 em confronto memorável. Após um início tenso onde a equipe adversária abriu 5 a 0 nos primeiros 7 minutos, o técnico Rafael Artiaga solicitou time-out para reorganizar a defesa no sistema 6:0 com flutuação. Com grande atuação de Suelso Junior e Gabriel Augusto ("Bahia"), o time construiu a virada antes do intervalo e dominou o segundo tempo com transição rápida e consistência defensiva.',
        highlights: 'Destaque absoluto para Suelso Junior na armação e Gabriel Augusto nos arremessos de 9 metros e contra-ataques decisivos, além de defesas fundamentais de Matheus Duarte no segundo tempo.',
        estatisticas: {
            eficienciaArremesso: { adesp: '71.8%', adversario: '50.0%' },
            arremessosTotais: { adesp: '28/39', adversario: '21/42' },
            arremessos6m: { adesp: '8/10 (80%)', adversario: '6/12 (50%)' },
            arremessos9m: { adesp: '9/15 (60%)', adversario: '7/16 (43.7%)' },
            arremessosPontas: { adesp: '7/9 (77.8%)', adversario: '4/8 (50%)' },
            arremessos7m: { adesp: '4/5 (80%)', adversario: '4/6 (66.7%)' },
            contraAtaques: { adesp: '8/10 (80%)', adversario: '3/7 (42.8%)' },
            defesasGoleiro: { adesp: '16 defesas (43.2%)', adversario: '11 defesas (28.2%)' },
            perdasBola: { adesp: 7, adversario: 14 },
            punicoes2min: { adesp: 3, adversario: 5 },
            cartoesAmarelos: { adesp: 1, adversario: 2 },
            cartoesVermelhos: { adesp: 0, adversario: 0 }
        },
        momentum: [
            { minuto: 0, adesp: 0, adversario: 0, diff: 0 },
            { minuto: 5, adesp: 0, adversario: 4, diff: -4 },
            { minuto: 8, adesp: 1, adversario: 5, diff: -4 },
            { minuto: 12, adesp: 4, adversario: 6, diff: -2 },
            { minuto: 18, adesp: 8, adversario: 8, diff: 0 },
            { minuto: 24, adesp: 11, adversario: 9, diff: +2 },
            { minuto: 30, adesp: 13, adversario: 11, diff: +2 },
            { minuto: 36, adesp: 17, adversario: 13, diff: +4 },
            { minuto: 42, adesp: 20, adversario: 15, diff: +5 },
            { minuto: 48, adesp: 23, adversario: 17, diff: +6 },
            { minuto: 54, adesp: 26, adversario: 19, diff: +7 },
            { minuto: 60, adesp: 28, adversario: 21, diff: +7 }
        ],
        eventosTimeline: [
            { min: "03'", tipo: "gol-contra", icon: "futbol", text: "Gol APHA Paracatu — Arremesso 9m (0 x 1)" },
            { min: "06'", tipo: "gol-contra", icon: "futbol", text: "Gol APHA Paracatu — Contra-ataque 1ª onda (0 x 3)" },
            { min: "07'", tipo: "timeout", icon: "pause-circle", text: "⏱️ Time-out ADESP/CDHU solicitado pelo técnico Rafael Artiaga" },
            { min: "08'", tipo: "gol", icon: "futbol", text: "⚽ GOL! Suelso Junior abre o placar da ADESP em infiltração de 6m (1 x 5)" },
            { min: "11'", tipo: "defesa", icon: "hand-paper", text: "🧤 DEFESAÇA! Matheus Duarte espalma tiro de 7 metros adversário!" },
            { min: "13'", tipo: "gol", icon: "futbol", text: "⚽ GOL! Gabriel Augusto arremessa potente dos 9 metros (4 x 6)" },
            { min: "18'", tipo: "gol", icon: "futbol", text: "⚽ GOL! Lucas Reimer converte de ponta esquerda e EMPATA a partida (8 x 8)!" },
            { min: "22'", tipo: "sancao", icon: "clock", text: "⏱️ Exclusão de 2 minutos para armador da APHA Paracatu" },
            { min: "25'", tipo: "gol", icon: "futbol", text: "⚽ GOL! Nillander Bonfim gira no pivô e coloca a ADESP na frente (11 x 9)!" },
            { min: "30'", tipo: "apito", icon: "whistle", text: "🔔 Fim do 1º Tempo: ADESP/CDHU 13 x 11 APHA Paracatu" },
            { min: "34'", tipo: "gol", icon: "futbol", text: "⚽ GOL! Lucas Malveira em transição veloz (15 x 12)" },
            { min: "39'", tipo: "defesa", icon: "hand-paper", text: "🧤 Defesa de Gabriel Fagundes em arremesso de ponta!" },
            { min: "44'", tipo: "gol", icon: "futbol", text: "⚽ GOL! André Luiz marca de 7 metros com perfeição (21 x 16)" },
            { min: "52'", tipo: "gol", icon: "futbol", text: "⚽ GOL! Suelso Junior infiltra e amplia a vantagem (25 x 18)" },
            { min: "58'", tipo: "gol", icon: "futbol", text: "⚽ GOL! Pedro Amaral marca em contra-ataque rápido (28 x 20)" },
            { min: "60'", tipo: "apito", icon: "trophy", text: "🏆 Apito Final: Vitória maiúscula da ADESP/CDHU por 28 a 21!" }
        ]
    },
    'funel-uberaba': {
        id: 'funel-uberaba',
        title: 'ADESP/CDHU 26 x 23 FUNEL Uberaba/CSND',
        adversario: 'FUNEL Uberaba/CSND',
        competicao: 'LIDTAP 2026 — Liga Regional do Triângulo e Alto Paranaíba',
        fase: 'Fase de Classificação — Rodada 2',
        date: '29 de Março, 2026',
        horario: '15:00',
        ginasio: 'Ginásio UTC — Uberaba/MG',
        arbitragem: 'Alexandre Costa & Fabio Fernandes (CBHb)',
        delegado: 'Renato Guimarães',
        publico: '350 torcedores',
        placarFinal: { adesp: 26, adversario: 23 },
        parciais: {
            primeiroTempo: { adesp: 12, adversario: 11 },
            segundoTempo: { adesp: 14, adversario: 12 }
        },
        mvp: 'Gabriel Augusto "Bahia"',
        golsMvp: 7,
        recap: 'Confronto clássico do triângulo mineiro decidido na maturidade tática. A partida foi marcada por um ritmo intenso e equilíbrio constante do início ao fim. A ADESP/CDHU se manteve organizada durante todo o confronto no sistema defensivo 6:0, mostrando força coletiva e controle emocional para assumir o controle na reta final.',
        highlights: 'Destaque para as atuações ofensivas de Lucas Malveira e Gabriel Augusto ("Bahia"), que garantiram a eficiência necessária nos momentos decisivos para confirmar a vitória por 26 a 23.',
        estatisticas: {
            eficienciaArremesso: { adesp: '68.4%', adversario: '53.4%' },
            arremessosTotais: { adesp: '26/38', adversario: '23/43' },
            arremessos6m: { adesp: '9/11 (81.8%)', adversario: '7/13 (53.8%)' },
            arremessos9m: { adesp: '8/14 (57.1%)', adversario: '8/17 (47.0%)' },
            arremessosPontas: { adesp: '6/8 (75.0%)', adversario: '5/9 (55.5%)' },
            arremessos7m: { adesp: '3/5 (60%)', adversario: '3/4 (75%)' },
            contraAtaques: { adesp: '7/9 (77.7%)', adversario: '4/8 (50.0%)' },
            defesasGoleiro: { adesp: '15 defesas (39.5%)', adversario: '10 defesas (27.7%)' },
            perdasBola: { adesp: 8, adversario: 11 },
            punicoes2min: { adesp: 2, adversario: 4 },
            cartoesAmarelos: { adesp: 2, adversario: 2 },
            cartoesVermelhos: { adesp: 0, adversario: 0 }
        },
        momentum: [
            { minuto: 0, adesp: 0, adversario: 0, diff: 0 },
            { minuto: 10, adesp: 4, adversario: 3, diff: +1 },
            { minuto: 20, adesp: 8, adversario: 7, diff: +1 },
            { minuto: 30, adesp: 12, adversario: 11, diff: +1 },
            { minuto: 40, adesp: 16, adversario: 15, diff: +1 },
            { minuto: 50, adesp: 21, adversario: 19, diff: +2 },
            { minuto: 60, adesp: 26, adversario: 23, diff: +3 }
        ],
        eventosTimeline: [
            { min: "02'", tipo: "gol", icon: "futbol", text: "⚽ GOL! Gabriel Augusto abre o placar para a ADESP (1 x 0)" },
            { min: "14'", tipo: "defesa", icon: "hand-paper", text: "🧤 Grande defesa de Natan Calixto no canto inferior!" },
            { min: "28'", tipo: "gol", icon: "futbol", text: "⚽ GOL! Lucas Reimer finaliza da ponta (12 x 10)" },
            { min: "30'", tipo: "apito", icon: "whistle", text: "🔔 Fim do 1º Tempo: ADESP 12 x 11 FUNEL" },
            { min: "46'", tipo: "gol", icon: "futbol", text: "⚽ GOL! Lucas Malveira marca do 9m sob pressão passiva (19 x 17)" },
            { min: "55'", tipo: "gol", icon: "futbol", text: "⚽ GOL! Suelso Junior sacramenta a liderança nos minutos finais (24 x 21)" },
            { min: "60'", tipo: "apito", icon: "trophy", text: "🏆 Vitória da ADESP/CDHU por 26 a 23 fora de casa!" }
        ]
    },
    'sacramento': {
        id: 'sacramento',
        title: 'ADESP/CDHU 33 x 22 PM Sacramento',
        adversario: 'PM Sacramento',
        competicao: 'LIDTAP 2026 — Liga Regional do Triângulo e Alto Paranaíba',
        fase: 'Fase de Classificação — Rodada 4',
        date: '25 de Abril, 2026',
        horario: '17:00',
        ginasio: 'Arena Tancredo Neves — Uberlândia/MG',
        arbitragem: 'Lucas Moreira & Bruno Castro (FMG)',
        delegado: 'Marcos Vinicius',
        publico: '480 torcedores',
        placarFinal: { adesp: 33, adversario: 22 },
        parciais: {
            primeiroTempo: { adesp: 17, adversario: 10 },
            segundoTempo: { adesp: 16, adversario: 12 }
        },
        mvp: 'Lucas Reimer',
        golsMvp: 11,
        recap: 'Exibição de gala do sistema ofensivo da ADESP/CDHU. O time impôs um ritmo frenético desde o início da partida, com transição de 1ª e 2ª onda fulminantes. Lucas Reimer foi o grande nome do jogo, anotando 11 gols e puxando os contra-ataques que desmontaram a zaga 5:1 adversária.',
        highlights: 'Lucas Reimer com 11 gols e 91% de aproveitamento de arremesso; André Luiz com 6 assistências e Matheus Duarte com 18 defesas.',
        estatisticas: {
            eficienciaArremesso: { adesp: '76.7%', adversario: '46.8%' },
            arremessosTotais: { adesp: '33/43', adversario: '22/47' },
            arremessos6m: { adesp: '12/13 (92.3%)', adversario: '6/14 (42.8%)' },
            arremessos9m: { adesp: '10/16 (62.5%)', adversario: '8/19 (42.1%)' },
            arremessosPontas: { adesp: '8/10 (80.0%)', adversario: '5/10 (50.0%)' },
            arremessos7m: { adesp: '3/4 (75%)', adversario: '3/4 (75%)' },
            contraAtaques: { adesp: '12/14 (85.7%)', adversario: '4/8 (50.0%)' },
            defesasGoleiro: { adesp: '19 defesas (46.3%)', adversario: '8 defesas (19.5%)' },
            perdasBola: { adesp: 5, adversario: 15 },
            punicoes2min: { adesp: 2, adversario: 3 },
            cartoesAmarelos: { adesp: 1, adversario: 2 },
            cartoesVermelhos: { adesp: 0, adversario: 0 }
        },
        momentum: [
            { minuto: 0, adesp: 0, adversario: 0, diff: 0 },
            { minuto: 10, adesp: 6, adversario: 2, diff: +4 },
            { minuto: 20, adesp: 12, adversario: 6, diff: +6 },
            { minuto: 30, adesp: 17, adversario: 10, diff: +7 },
            { minuto: 40, adesp: 22, adversario: 13, diff: +9 },
            { minuto: 50, adesp: 28, adversario: 18, diff: +10 },
            { minuto: 60, adesp: 33, adversario: 22, diff: +11 }
        ],
        eventosTimeline: [
            { min: "01'", tipo: "gol", icon: "futbol", text: "⚽ GOL! Lucas Reimer em contra-ataque relâmpago (1 x 0)" },
            { min: "12'", tipo: "gol", icon: "futbol", text: "⚽ GOL! Nillander Bonfim no pivô (7 x 3)" },
            { min: "25'", tipo: "defesa", icon: "hand-paper", text: "🧤 Matheus Duarte fecha o ângulo superior direito!" },
            { min: "30'", tipo: "apito", icon: "whistle", text: "🔔 Fim do 1º Tempo: ADESP 17 x 10 Sacramento" },
            { min: "48'", tipo: "gol", icon: "futbol", text: "⚽ GOL! Lucas Reimer chega ao seu 10º gol na partida (27 x 16)" },
            { min: "60'", tipo: "apito", icon: "trophy", text: "🏆 Vitória incontestável: ADESP/CDHU 33 x 22 PM Sacramento" }
        ]
    }
};
