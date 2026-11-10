/**
 * =========================================================================
 * ADESP / CDHU 3.0 — BASE DE USUÁRIOS & PERMISSÕES MOCK (FRONT-END)
 * Arquivo: data/mock-users.js
 * Objetivo: Gestão de perfis demonstrativos e controle de acesso RBAC simulado
 * =========================================================================
 */

(function (window) {
    'use strict';

    window.CDHU_USERS = {
        roles: {
            admin: {
                id: 'admin',
                label: 'Administrador Geral',
                badgeColor: '#F4C542',
                icon: 'fas fa-user-shield',
                permissions: [
                    'view_dashboard',
                    'view_players',
                    'view_matches',
                    'view_goalkeepers',
                    'view_medical',
                    'edit_medical',
                    'view_comparison',
                    'view_tactical',
                    'edit_tactical',
                    'manage_users'
                ]
            },
            tecnica: {
                id: 'tecnica',
                label: 'Comissão Técnica',
                badgeColor: '#38bdf8',
                icon: 'fas fa-clipboard-check',
                permissions: [
                    'view_dashboard',
                    'view_players',
                    'view_matches',
                    'view_goalkeepers',
                    'view_comparison',
                    'view_tactical',
                    'edit_tactical'
                    // LGPD: Sem permissão para prontuários clínicos individuais
                ]
            },
            medica: {
                id: 'medica',
                label: 'Depto. Médico / Fisioterapia',
                badgeColor: '#22c55e',
                icon: 'fas fa-heartbeat',
                permissions: [
                    'view_dashboard',
                    'view_players',
                    'view_medical',
                    'edit_medical',
                    'view_comparison'
                ]
            }
        },

        accounts: {
            'admin@adesp.com': {
                id: 'usr_001',
                email: 'admin@adesp.com',
                pass: 'adesp2026',
                name: 'Diretoria ADESP',
                cargo: 'Administrador Geral',
                role: 'admin',
                avatar: 'Imagens/ADESPCDHU.png'
            },
            'tecnico@adesp.com': {
                id: 'usr_002',
                email: 'tecnico@adesp.com',
                pass: 'adesp2026',
                name: 'Prof. Carlos Mendes',
                cargo: 'Treinador Principal',
                role: 'tecnica',
                avatar: 'Imagens/Tecnico.jpg'
            },
            'medico@adesp.com': {
                id: 'usr_003',
                email: 'medico@adesp.com',
                pass: 'adesp2026',
                name: 'Dr. Lucas Vieira',
                cargo: 'Fisiologista & Médico Esportivo',
                role: 'medica',
                avatar: 'Imagens/CDHU.png'
            }
        },

        // Helper para verificar se um papel possui determinada permissão
        hasPermission: function (roleId, permissionKey) {
            const role = this.roles[roleId];
            if (!role) return false;
            return role.permissions.includes(permissionKey);
        },

        // Buscar conta pelo e-mail
        findByEmail: function (email) {
            if (!email) return null;
            return this.accounts[email.trim().toLowerCase()] || null;
        }
    };
})(window);

