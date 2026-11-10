/**
 * ADESP / CDHU 3.0 — GUARDA DE ROTAS RESTRITAS (AUTH GUARD)
 * Protege performance.html e tatica.html contra acesso não autenticado
 * Simulação de autorização comportamental no front-end (Fase 1)
 */

(function () {
    'use strict';

    // Helper anti-XSS para sanitização de strings inseridas no DOM
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // 1. Verificação imediata e síncrona de sessão no <head>
    let session = null;
    const sessionRaw = localStorage.getItem('cdhu_auth_session') || localStorage.getItem('adesp_auth_session');

    if (sessionRaw) {
        try {
            const parsed = JSON.parse(sessionRaw);
            session = parsed.val ? Object.assign({}, parsed.val, { expiresAt: parsed.val.expiresAt || parsed.expiresAt }) : parsed; // Suporte a CDHU_STORAGE e legado
        } catch (e) {
            session = null;
        }
    }

    const currentPage = window.location.pathname.split('/').pop() || 'performance.html';

    // Se não houver sessão ou estiver expirada, limpa todas as chaves e redireciona
    if (!session || !session.expiresAt || session.expiresAt < Date.now()) {
        localStorage.removeItem('cdhu_auth_session');
        localStorage.removeItem('adesp_auth_session');
        window.location.replace('dev-auth.html?redirect=' + encodeURIComponent(currentPage));
        return;
    }

    // Exporta utilitário global de autenticação com logout seguro
    window.ADESP_AUTH = {
        session: session,
        role: session.role || 'tecnica',
        name: session.name || 'Profissional',
        cargo: session.cargo || 'Comissão Técnica',
        logout: function () {
            if (confirm('Deseja realmente encerrar sua sessão na Área Dev?')) {
                // Limpa ambas as chaves de sessão para evitar persistência indevida
                localStorage.removeItem('cdhu_auth_session');
                localStorage.removeItem('adesp_auth_session');
                if (window.CDHU_STORAGE && window.CDHU_STORAGE.auth) {
                    window.CDHU_STORAGE.auth.clearSession();
                }
                window.location.replace('dev-auth.html');
            }
        }
    };

    // 2. Integração com as páginas ao carregar a interface
    document.addEventListener('DOMContentLoaded', function () {
        injectUserBadge();
        enforceRolePermissions();
    });

    function injectUserBadge() {
        const roleIcons = {
            admin: '<i class="fas fa-user-shield" style="color:#F4C542;"></i>',
            tecnica: '<i class="fas fa-clipboard-check" style="color:#38bdf8;"></i>',
            medica: '<i class="fas fa-heartbeat" style="color:#22c55e;"></i>'
        };

        const safeName = escapeHtml(session.name || 'Profissional');
        const safeCargo = escapeHtml(session.cargo || session.role);
        const safeIcon = roleIcons[session.role] || '<i class="fas fa-user"></i>';

        const badgeHtml = `
            <div class="auth-user-pill" style="
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 5px 12px;
                background: rgba(255,255,255,0.08);
                border: 1px solid rgba(255,255,255,0.15);
                border-radius: 30px;
                font-size: 0.78rem;
                color: #e2e8f0;
            ">
                ${safeIcon}
                <span style="font-weight:600;">${safeName}</span>
                <span style="opacity:0.6;font-size:0.7rem;">(${safeCargo})</span>
                <button onclick="window.ADESP_AUTH.logout()" title="Encerrar Sessão" style="
                    background: transparent;
                    border: none;
                    color: #ef4444;
                    cursor: pointer;
                    margin-left: 6px;
                    padding: 2px 4px;
                    font-size: 0.85rem;
                    transition: transform 0.2s;
                ">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        `;

        // Se estiver em performance.html
        const perfNav = document.querySelector('.perf-user-nav');
        if (perfNav) {
            const roleSelect = document.getElementById('roleSelector');
            if (roleSelect) {
                roleSelect.value = session.role;
                if (session.role !== 'admin') {
                    roleSelect.disabled = true;
                    roleSelect.title = "Perfil definido pela autenticação da Área Dev";
                }
            }
            perfNav.insertAdjacentHTML('afterbegin', badgeHtml);
        }

        // Se estiver em tatica.html
        const tacNav = document.querySelector('.tac-nav-right');
        if (tacNav) {
            tacNav.insertAdjacentHTML('afterbegin', badgeHtml);
        }
    }

    function enforceRolePermissions() {
        // Controle de acesso à aba médica em performance.html
        if (session.role === 'tecnica') {
            const medTabBtn = document.querySelector('[data-tab="medico"]');
            if (medTabBtn) {
                medTabBtn.addEventListener('click', function () {
                    const notice = document.getElementById('medRoleNotice');
                    if (!notice) {
                        const alertBox = document.createElement('div');
                        alertBox.id = 'medRoleNotice';
                        alertBox.style.cssText = 'background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #fca5a5; padding: 12px 18px; border-radius: 8px; margin-bottom: 20px; font-size: 0.85rem; display: flex; align-items: center; gap: 10px;';
                        alertBox.innerHTML = '<i class="fas fa-lock"></i> <div><strong>Acesso Restrito LGPD (Simulado):</strong> Você está no perfil Comissão Técnica. Visualização de prontuários clínicos detalhados é restrita à Equipe Médica.</div>';
                        const medPanel = document.getElementById('tab-medico');
                        if (medPanel) medPanel.prepend(alertBox);
                    }
                }, { once: true });
            }
        }
    }
})();
