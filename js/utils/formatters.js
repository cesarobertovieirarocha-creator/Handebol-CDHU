/**
 * =========================================================================
 * ADESP / CDHU 3.0 — FORMATADORES DE DADOS & UTILS
 * Arquivo: js/utils/formatters.js
 * Objetivo: Padronizar exibição de números, percentuais, posições e status
 * =========================================================================
 */

(function (window) {
    'use strict';

    window.CDHU_FORMATTERS = {
        // Percentual com símbolo
        percent: function (val, decimals = 1) {
            if (val === null || val === undefined || isNaN(val)) return '0.0%';
            return `${Number(val).toFixed(decimals)}%`;
        },

        // Saldo +/- com sinal explícito (+3, -2, 0)
        plusMinus: function (val) {
            const num = parseInt(val, 10) || 0;
            if (num > 0) return `+${num}`;
            return `${num}`;
        },

        // Expected Goals (xG)
        xg: function (val) {
            const num = parseFloat(val) || 0.0;
            return num.toFixed(2);
        },

        // Aproveitamento de arremessos (gols / arremessos)
        shootingAccuracy: function (gols, arremessos) {
            const g = parseInt(gols, 10) || 0;
            const a = parseInt(arremessos, 10) || 0;
            if (a === 0) return '0.0%';
            return `${((g / a) * 100).toFixed(1)}%`;
        },

        // Cor de badge por posição no Handebol
        positionBadge: function (posicao) {
            const pos = (posicao || '').toLowerCase();
            if (pos.includes('goleiro')) return { label: 'Goleiro', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
            if (pos.includes('pivô') || pos.includes('pivo')) return { label: 'Pivô', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
            if (pos.includes('ponta')) return { label: 'Ponta', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' };
            if (pos.includes('armador')) return { label: 'Armador', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' };
            if (pos.includes('central')) return { label: 'Central', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' };
            return { label: posicao || 'Atleta', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' };
        },

        // Status médico para cores e ícones
        medicalStatusBadge: function (statusClass) {
            const map = {
                'status-apto': { label: 'Apto', color: '#22c55e', icon: 'fas fa-check-circle' },
                'status-atencao': { label: 'Atenção / Sobrecarga', color: '#eab308', icon: 'fas fa-exclamation-triangle' },
                'status-transicao': { label: 'Transição Física', color: '#3b82f6', icon: 'fas fa-running' },
                'status-dm': { label: 'Departamento Médico', color: '#ef4444', icon: 'fas fa-clinic-medical' }
            };
            return map[statusClass] || { label: 'Monitorado', color: '#94a3b8', icon: 'fas fa-user-clock' };
        },

        // Formatação de data em padrão legível pt-BR
        dateBR: function (dateStr) {
            if (!dateStr) return '';
            try {
                const date = new Date(dateStr);
                if (isNaN(date.getTime())) return dateStr;
                return date.toLocaleDateString('pt-BR');
            } catch (e) {
                return dateStr;
            }
        }
    };
})(window);

