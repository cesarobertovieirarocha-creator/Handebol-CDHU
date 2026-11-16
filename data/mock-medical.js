/**
 * =========================================================================
 * ADESP / CDHU 3.0 — BASE DE DADOS DO DEPARTAMENTO MÉDICO & FISIOLOGIA (MOCK)
 * Arquivo: data/mock-medical.js
 * Objetivo: Gestão de prontuários simulados, PSE de Borg (0-10), carga e recuperação
 * IMPORTANTE (LGPD): Todos os dados neste arquivo são 100% fictícios para demonstração.
 * =========================================================================
 */

(function (window) {
    'use strict';

    window.CDHU_MEDICAL = {
        // Escala de Percepção Subjetiva de Esforço (Borg CR-10 Adaptada)
        escalaBorg: [
            { nivel: 0, desc: 'Repouso absoluto', cor: '#94a3b8' },
            { nivel: 1, desc: 'Muito muito leve', cor: '#38bdf8' },
            { nivel: 2, desc: 'Muito leve', cor: '#38bdf8' },
            { nivel: 3, desc: 'Leve / Confortável', cor: '#4ade80' },
            { nivel: 4, desc: 'Moderado', cor: '#4ade80' },
            { nivel: 5, desc: 'Um pouco pesado', cor: '#facc15' },
            { nivel: 6, desc: 'Pesado', cor: '#facc15' },
            { nivel: 7, desc: 'Muito pesado', cor: '#fb923c' },
            { nivel: 8, desc: 'Muito muito pesado', cor: '#fb923c' },
            { nivel: 9, desc: 'Extremamente extenuante', cor: '#ef4444' },
            { nivel: 10, desc: 'Exaustão máxima', cor: '#dc2626' }
        ],

        // Parâmetros Médicos e Monitoramento Físico Individual (Simulado)
        atletas: {
            "Gabriel Augusto": {
                statusDisponibilidade: "Apto para Jogo",
                badgeClass: "status-apto",
                pseMediaSemanal: 6.4,
                indiceFadiga: 35, // 0 - 100%
                recuperacaoMuscular: 88, // 0 - 100%
                qualidadeSono: 8.5, // 0 - 10
                dorTardiaMuscular: 2, // 0 - 10 (Escala Visual Analógica - EVA)
                zonaAlerta: "verde",
                historicoLesoes: [
                    { data: "12/02/2026", tipo: "Entorse de tornozelo grau I", tempoAfastamento: "7 dias", status: "Alta médica" }
                ],
                avaliacoesSemanais: [
                    { semana: "Sem 1", pse: 5.5, cargaUa: 1650, recuperacao: 90 },
                    { semana: "Sem 2", pse: 6.8, cargaUa: 2040, recuperacao: 82 },
                    { semana: "Sem 3", pse: 7.2, cargaUa: 2160, recuperacao: 78 },
                    { semana: "Sem 4", pse: 6.4, cargaUa: 1920, recuperacao: 88 }
                ]
            },
            "Suelso Junior": {
                statusDisponibilidade: "Apto para Jogo",
                badgeClass: "status-apto",
                pseMediaSemanal: 5.8,
                indiceFadiga: 42,
                recuperacaoMuscular: 82,
                qualidadeSono: 8.0,
                dorTardiaMuscular: 3,
                zonaAlerta: "verde",
                historicoLesoes: [],
                avaliacoesSemanais: [
                    { semana: "Sem 1", pse: 6.0, cargaUa: 1800, recuperacao: 85 },
                    { semana: "Sem 2", pse: 6.2, cargaUa: 1860, recuperacao: 84 },
                    { semana: "Sem 3", pse: 5.8, cargaUa: 1740, recuperacao: 86 },
                    { semana: "Sem 4", pse: 5.8, cargaUa: 1740, recuperacao: 82 }
                ]
            },
            "Matheus Duarte": {
                statusDisponibilidade: "Apto para Jogo",
                badgeClass: "status-apto",
                pseMediaSemanal: 5.2,
                indiceFadiga: 28,
                recuperacaoMuscular: 94,
                qualidadeSono: 9.0,
                dorTardiaMuscular: 1,
                zonaAlerta: "verde",
                historicoLesoes: [
                    { data: "05/11/2025", tipo: "Tendinite patelar leve", tempoAfastamento: "10 dias", status: "Alta médica" }
                ],
                avaliacoesSemanais: [
                    { semana: "Sem 1", pse: 4.8, cargaUa: 1440, recuperacao: 95 },
                    { semana: "Sem 2", pse: 5.5, cargaUa: 1650, recuperacao: 92 },
                    { semana: "Sem 3", pse: 5.0, cargaUa: 1500, recuperacao: 94 },
                    { semana: "Sem 4", pse: 5.2, cargaUa: 1560, recuperacao: 94 }
                ]
            },
            "Gabriel Fagundes": {
                statusDisponibilidade: "Sob Monitoramento",
                badgeClass: "status-atencao",
                pseMediaSemanal: 7.8,
                indiceFadiga: 68,
                recuperacaoMuscular: 62,
                qualidadeSono: 6.5,
                dorTardiaMuscular: 6,
                zonaAlerta: "amarela",
                historicoLesoes: [
                    { data: "20/03/2026", tipo: "Sobrecarga no manguito rotador (ombro arremessador)", tempoAfastamento: "Em manejo de carga", status: "Em fisioterapia preventiva" }
                ],
                avaliacoesSemanais: [
                    { semana: "Sem 1", pse: 6.5, cargaUa: 1950, recuperacao: 80 },
                    { semana: "Sem 2", pse: 7.5, cargaUa: 2250, recuperacao: 68 },
                    { semana: "Sem 3", pse: 8.0, cargaUa: 2400, recuperacao: 60 },
                    { semana: "Sem 4", pse: 7.8, cargaUa: 2340, recuperacao: 62 }
                ]
            },
            "Pedro Lucas": {
                statusDisponibilidade: "Em Transição Física",
                badgeClass: "status-transicao",
                pseMediaSemanal: 4.5,
                indiceFadiga: 50,
                recuperacaoMuscular: 70,
                qualidadeSono: 7.5,
                dorTardiaMuscular: 4,
                zonaAlerta: "amarela",
                historicoLesoes: [
                    { data: "10/01/2026", tipo: "Estiramento isquiotibial grau I", tempoAfastamento: "18 dias", status: "Transição concluída a 80%" }
                ],
                avaliacoesSemanais: [
                    { semana: "Sem 1", pse: 3.0, cargaUa: 900, recuperacao: 85 },
                    { semana: "Sem 2", pse: 4.0, cargaUa: 1200, recuperacao: 80 },
                    { semana: "Sem 3", pse: 4.5, cargaUa: 1350, recuperacao: 72 },
                    { semana: "Sem 4", pse: 4.5, cargaUa: 1350, recuperacao: 70 }
                ]
            }
        },

        // Helper para obter dados médicos de um atleta (com fallback para valores padrão)
        getAtletaMedical: function (nomeAtleta) {
            if (this.atletas[nomeAtleta]) {
                return this.atletas[nomeAtleta];
            }
            // Perfil padrão para atletas sem histórico crítico registrado
            return {
                statusDisponibilidade: "Apto para Jogo",
                badgeClass: "status-apto",
                pseMediaSemanal: 5.5,
                indiceFadiga: 35,
                recuperacaoMuscular: 85,
                qualidadeSono: 8.0,
                dorTardiaMuscular: 2,
                zonaAlerta: "verde",
                historicoLesoes: [],
                avaliacoesSemanais: [
                    { semana: "Sem 1", pse: 5.2, cargaUa: 1560, recuperacao: 88 },
                    { semana: "Sem 2", pse: 5.6, cargaUa: 1680, recuperacao: 85 },
                    { semana: "Sem 3", pse: 5.4, cargaUa: 1620, recuperacao: 86 },
                    { semana: "Sem 4", pse: 5.5, cargaUa: 1650, recuperacao: 85 }
                ]
            };
        }
    };
})(window);

