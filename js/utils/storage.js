/**
 * =========================================================================
 * ADESP / CDHU 3.0 — GERENCIADOR DE ARMAZENAMENTO LOCAL (STORAGE)
 * Arquivo: js/utils/storage.js
 * Objetivo: Abstração segura de localStorage com prefixo, expiração e tratamento de erros
 * =========================================================================
 */

(function (window) {
    'use strict';

    const PREFIX = 'cdhu_';

    window.CDHU_STORAGE = {
        // Gravar dado genérico com suporte a TTL (tempo de vida em ms)
        set: function (key, value, ttlMs = null) {
            try {
                const item = {
                    val: value,
                    storedAt: Date.now(),
                    expiresAt: ttlMs ? Date.now() + ttlMs : null
                };
                localStorage.setItem(PREFIX + key, JSON.stringify(item));
                return true;
            } catch (err) {
                console.warn(`[CDHU_STORAGE] Falha ao gravar chave "${key}":`, err);
                return false;
            }
        },

        // Obter dado com verificação de expiração
        get: function (key, defaultValue = null) {
            try {
                const raw = localStorage.getItem(PREFIX + key);
                if (!raw) return defaultValue;

                const item = JSON.parse(raw);
                if (item && item.expiresAt && Date.now() > item.expiresAt) {
                    this.remove(key);
                    return defaultValue;
                }
                return (item && item.val !== undefined) ? item.val : defaultValue;
            } catch (err) {
                console.warn(`[CDHU_STORAGE] Falha ao ler chave "${key}":`, err);
                return defaultValue;
            }
        },

        // Remover chave
        remove: function (key) {
            try {
                localStorage.removeItem(PREFIX + key);
                return true;
            } catch (err) {
                return false;
            }
        },

        // ── STORES ESPECIALIZADOS DO PROJETO ──

        // 1. Sessão de Autenticação (compatível com legacy adesp_auth_session)
        auth: {
            getSession: function () {
                // Tenta nova chave, com fallback para adesp_auth_session
                const modern = window.CDHU_STORAGE.get('auth_session');
                if (modern) return modern;

                try {
                    const legacy = localStorage.getItem('adesp_auth_session');
                    return legacy ? JSON.parse(legacy) : null;
                } catch (e) {
                    return null;
                }
            },

            setSession: function (sessionData, ttlMs = 24 * 60 * 60 * 1000) {
                // Grava em ambos para manter compatibilidade total
                window.CDHU_STORAGE.set('auth_session', Object.assign({}, sessionData, { expiresAt: Date.now() + ttlMs }), ttlMs);
                try {
                    localStorage.setItem('adesp_auth_session', JSON.stringify({
                        ...sessionData,
                        expiresAt: Date.now() + ttlMs
                    }));
                } catch (e) { }
            },

            clearSession: function () {
                window.CDHU_STORAGE.remove('auth_session');
                try {
                    localStorage.removeItem('adesp_auth_session');
                } catch (e) { }
            }
        },

        // 2. Solicitações de Acesso
        requests: {
            getAll: function () {
                const modern = window.CDHU_STORAGE.get('access_requests');
                if (modern) return modern;
                try {
                    const legacy = localStorage.getItem('adesp_access_requests');
                    return legacy ? JSON.parse(legacy) : [];
                } catch (e) {
                    return [];
                }
            },

            add: function (requestObj) {
                const list = this.getAll();
                list.push({
                    ...requestObj,
                    id: Date.now(),
                    createdAt: new Date().toISOString(),
                    status: 'pendente'
                });
                window.CDHU_STORAGE.set('access_requests', list);
                try {
                    localStorage.setItem('adesp_access_requests', JSON.stringify(list));
                } catch (e) { }
                return true;
            }
        },

        // 3. Sequências e Pranchetas Táticas Salvas Localmente
        tactical: {
            getAllPlays: function () {
                return window.CDHU_STORAGE.get('saved_plays', []);
            },

            savePlay: function (name, playData) {
                const plays = this.getAllPlays();
                const existingIdx = plays.findIndex(p => p.name === name);
                const playItem = {
                    id: 'play_' + Date.now(),
                    name,
                    updatedAt: new Date().toISOString(),
                    data: playData
                };

                if (existingIdx >= 0) {
                    plays[existingIdx] = playItem;
                } else {
                    plays.push(playItem);
                }
                window.CDHU_STORAGE.set('saved_plays', plays);
                return true;
            }
        }
    };
})(window);

