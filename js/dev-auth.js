/**
 * ADESP / CDHU — AUTENTICAÇÃO E CONTROLE DE ACESSO (ÁREA DEV)
 * Módulo de Login & Solicitação de Acesso com Suporte a RBAC e Supabase Auth
 */

(function () {
    'use strict';

    // ── CONFIGURAÇÕES E ESTADO ──
    const DEMO_ACCOUNTS = (window.CDHU_USERS && window.CDHU_USERS.accounts) ? window.CDHU_USERS.accounts : {
        'admin@adesp.com': {
            role: 'admin',
            name: 'Diretoria ADESP',
            cargo: 'Administrador Geral',
            pass: 'adesp2026'
        },
        'tecnico@adesp.com': {
            role: 'tecnica',
            name: 'Prof. Carlos Mendes',
            cargo: 'Treinador Principal',
            pass: 'adesp2026'
        },
        'medico@adesp.com': {
            role: 'medica',
            name: 'Dr. Lucas Vieira',
            cargo: 'Fisiologista / Depto. Médico',
            pass: 'adesp2026'
        }
    };

    // Obter parâmetro de redirecionamento (?redirect=tatica.html ou performance.html)
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTarget = urlParams.get('redirect') || 'performance.html';

    // Elementos DOM
    const authCard = document.getElementById('authCard');
    const loginForm = document.getElementById('loginForm');
    const requestForm = document.getElementById('requestForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('passwordInput');
    const emailInput = document.getElementById('emailInput');
    const authToast = document.getElementById('authToast');

    // ── TROCA DE MODO (ENTRAR <-> SOLICITAR ACESSO) ──
    window.setAuthMode = function (mode) {
        if (mode === 'request') {
            authCard.classList.remove('mode-login');
            authCard.classList.add('mode-request');
            renderRequestMode();
        } else {
            authCard.classList.remove('mode-request');
            authCard.classList.add('mode-login');
            renderLoginMode();
        }
    };

    function renderLoginMode() {
        authCard.innerHTML = `
            <!-- LADO ESQUERDO: FORMULÁRIO DE LOGIN (CREME) -->
            <div class="panel panel-cream" id="panelLeft">
                <h1 class="title-serif">Entrar</h1>
                <div class="gold-bar"></div>
                <p class="subtitle">Acesso restrito à comissão técnica e à equipe autorizada.</p>

                <form id="loginForm" autocomplete="on">
                    <div class="form-group">
                        <input type="email" id="emailInput" class="input-underline" placeholder="E-mail" required autocomplete="username">
                        <i class="far fa-envelope input-icon"></i>
                    </div>

                    <div class="form-group">
                        <input type="password" id="passwordInput" class="input-underline" placeholder="Senha" required autocomplete="current-password">
                        <i class="far fa-eye input-icon toggle-password-btn" id="togglePassword" title="Mostrar/ocultar senha"></i>
                    </div>

                    <div class="forgot-pass-wrapper">
                        <a href="#" class="forgot-pass-link" onclick="handleForgotPassword(event)">Esqueci minha senha</a>
                    </div>

                    <button type="submit" class="btn-submit" id="loginSubmitBtn">
                        <span>Entrar na Área Dev</span>
                    </button>
                </form>

                <p class="auth-switch-text">
                    Ainda sem acesso? <a class="auth-switch-link" onclick="setAuthMode('request')">Solicitar acesso</a>
                </p>

                <!-- Atalhos rápidos para homologação / teste -->
                <details class="demo-creds-box">
                    <summary>🔑 Contas de Teste Rápido (Clique para preencher)</summary>
                    <div class="creds-list">
                        <div class="cred-item" onclick="quickFill('tecnico@adesp.com', 'adesp2026')">
                            <strong>👤 Comissão Técnica:</strong> tecnico@adesp.com
                        </div>
                        <div class="cred-item" onclick="quickFill('medico@adesp.com', 'adesp2026')">
                            <strong>🩺 Depto. Médico:</strong> medico@adesp.com
                        </div>
                        <div class="cred-item" onclick="quickFill('admin@adesp.com', 'adesp2026')">
                            <strong>🔒 Administrador:</strong> admin@adesp.com
                        </div>
                    </div>
                </details>
            </div>

            <!-- LADO DIREITO: BRANDING (FLORESTA ESCURA) -->
            <div class="panel panel-forest" id="panelRight">
                <div class="brand-badge">
                    <img src="Imagens/CDHU.png" alt="Escudo ADESP/CDHU" onerror="this.style.display='none'">
                    <span>ADESP/CDHU · DEV</span>
                </div>

                <h2 class="brand-title">
                    Bem-vindo
                    <span class="italic-gold">de volta.</span>
                </h2>

                <p class="brand-desc">
                    Scout, prancheta tática e gestão de atletas num só lugar.
                </p>

                <div class="feature-pills">
                    <div class="feature-pill"><i class="fas fa-chart-line"></i> Performance</div>
                    <div class="feature-pill"><i class="fas fa-chess-board"></i> Prancheta Tática</div>
                    <div class="feature-pill"><i class="fas fa-bullseye"></i> Scout</div>
                </div>
            </div>
        `;
        attachLoginEvents();
    }

    function renderRequestMode() {
        authCard.innerHTML = `
            <!-- LADO ESQUERDO: BRANDING (FLORESTA ESCURA) -->
            <div class="panel panel-forest" id="panelLeft">
                <div class="brand-badge">
                    <img src="Imagens/CDHU.png" alt="Escudo ADESP/CDHU" onerror="this.style.display='none'">
                    <span>ADESP/CDHU · DEV</span>
                </div>

                <h2 class="brand-title">
                    Entre para o
                    <span class="italic-gold">time técnico.</span>
                </h2>

                <p class="brand-desc">
                    O acesso é por convite. Envie seu pedido e a administração libera.
                </p>

                <div class="feature-pills">
                    <div class="feature-pill"><i class="fas fa-shield-alt"></i> Acesso Protegido</div>
                    <div class="feature-pill"><i class="fas fa-user-check"></i> Convite Nominal</div>
                </div>
            </div>

            <!-- LADO DIREITO: FORMULÁRIO DE SOLICITAÇÃO (CREME) -->
            <div class="panel panel-cream" id="panelRight">
                <h1 class="title-serif">Solicitar acesso</h1>
                <div class="gold-bar"></div>
                <p class="subtitle">O cadastro é fechado. A administração do clube analisa o pedido e envia um convite por e-mail.</p>

                <form id="requestForm">
                    <div class="form-group">
                        <input type="text" id="reqName" class="input-underline" placeholder="Nome completo" required>
                        <i class="far fa-user input-icon"></i>
                    </div>

                    <div class="form-group">
                        <input type="email" id="reqEmail" class="input-underline" placeholder="E-mail profissional" required>
                        <i class="far fa-envelope input-icon"></i>
                    </div>

                    <div class="form-group">
                        <select id="reqRole" class="input-underline" required>
                            <option value="" disabled selected>Função no clube</option>
                            <option value="tecnico">Treinador / Auxiliar Técnico</option>
                            <option value="preparador">Preparador Físico / Fisiologista</option>
                            <option value="medico">Médico / Fisioterapeuta</option>
                            <option value="analista">Analista de Desempenho / Scout</option>
                            <option value="diretor">Diretoria / Gestão Esportiva</option>
                        </select>
                        <i class="fas fa-chevron-down select-arrow"></i>
                    </div>

                    <button type="submit" class="btn-submit" id="requestSubmitBtn">
                        <span>Enviar solicitação</span>
                    </button>
                </form>

                <p class="auth-switch-text">
                    Já tem acesso? <a class="auth-switch-link" onclick="setAuthMode('login')">Entrar</a>
                </p>
            </div>
        `;
        attachRequestEvents();
    }

    // ── ATALHO RÁPIDO DE PREENCHIMENTO ──
    window.quickFill = function (email, pass) {
        const emailEl = document.getElementById('emailInput');
        const passEl = document.getElementById('passwordInput');
        if (emailEl && passEl) {
            emailEl.value = email;
            passEl.value = pass;
            showToast('Credencial preenchida. Clique em "Entrar na Área Dev".', 'info');
        }
    };

    // ── VINCULAÇÃO DE EVENTOS DE LOGIN ──
    function attachLoginEvents() {
        const form = document.getElementById('loginForm');
        const toggleBtn = document.getElementById('togglePassword');
        const passInput = document.getElementById('passwordInput');

        if (toggleBtn && passInput) {
            toggleBtn.addEventListener('click', function () {
                const isPassword = passInput.getAttribute('type') === 'password';
                passInput.setAttribute('type', isPassword ? 'text' : 'password');
                toggleBtn.classList.toggle('fa-eye');
                toggleBtn.classList.toggle('fa-eye-slash');
            });
        }

        if (form) {
            form.addEventListener('submit', handleLoginSubmit);
        }
    }

    // ── VINCULAÇÃO DE EVENTOS DE SOLICITAÇÃO ──
    function attachRequestEvents() {
        const form = document.getElementById('requestForm');
        if (form) {
            form.addEventListener('submit', handleRequestSubmit);
        }
    }

    // ── PROCESSAMENTO DO LOGIN ──
    async function handleLoginSubmit(e) {
        e.preventDefault();
        const email = document.getElementById('emailInput').value.trim().toLowerCase();
        const password = document.getElementById('passwordInput').value;
        const submitBtn = document.getElementById('loginSubmitBtn');

        if (!email || !password) {
            showToast('Por favor, preencha todos os campos.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Autenticando...';

        try {
            // 1. Caso o cliente Supabase esteja ativo
            if (window.supabase && typeof window.supabase.auth?.signInWithPassword === 'function') {
                const { data, error } = await window.supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) {
                    throw new Error(error.message);
                }

                // Determinar perfil a partir dos metadados do usuário no Supabase
                const userRole = data.user.user_metadata?.role || 'tecnica';
                salvarSessao({
                    email: data.user.email,
                    role: userRole,
                    name: data.user.user_metadata?.name || 'Profissional ADESP',
                    token: data.session.access_token,
                    provider: 'supabase'
                });

                showToast('Login efetuado com sucesso! Redirecionando...', 'success');
                setTimeout(() => window.location.href = redirectTarget, 800);
                return;
            }

            // 2. Modo Autenticação Local / Homologação (com validação de perfil)
            await new Promise(resolve => setTimeout(resolve, 600)); // Simula latência de rede

            const account = DEMO_ACCOUNTS[email];
            if (account) {
                // Verificação estrita da credencial cadastrada na conta
                if (password === account.pass) {
                    salvarSessao({
                        email: email,
                        role: account.role,
                        name: account.name,
                        cargo: account.cargo,
                        token: 'tok_' + btoa(email + ':' + Date.now()),
                        provider: 'local_secure'
                    });

                    showToast(`Bem-vindo, ${account.name}! Redirecionando...`, 'success');
                    setTimeout(() => window.location.href = redirectTarget, 800);
                } else {
                    showToast('Senha incorreta para a conta informada.', 'error');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Entrar na Área Dev</span>';
                }
            } else {
                // Caso não seja um e-mail pré-cadastrado na demo
                showToast('E-mail não autorizado para acesso à Área Dev. Solicite seu convite.', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Entrar na Área Dev</span>';
            }

        } catch (err) {
            console.error('Erro de autenticação:', err);
            showToast('Falha na autenticação: ' + (err.message || 'Credenciais inválidas'), 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Entrar na Área Dev</span>';
        }
    }

    // ── PROCESSAMENTO DA SOLICITAÇÃO DE ACESSO ──
    async function handleRequestSubmit(e) {
        e.preventDefault();
        const name = document.getElementById('reqName').value.trim();
        const email = document.getElementById('reqEmail').value.trim();
        const role = document.getElementById('reqRole').value;
        const submitBtn = document.getElementById('requestSubmitBtn');

        if (!name || !email || !role) {
            showToast('Por favor, preencha todos os dados da solicitação.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando solicitação...';

        await new Promise(resolve => setTimeout(resolve, 700));

        // Armazenar solicitação no localStorage para aprovação do admin
        const requests = JSON.parse(localStorage.getItem('adesp_access_requests') || '[]');
        requests.push({
            id: Date.now(),
            name,
            email,
            role,
            createdAt: new Date().toISOString(),
            status: 'pendente'
        });
        localStorage.setItem('adesp_access_requests', JSON.stringify(requests));

        showToast('Solicitação enviada com sucesso! A administração da ADESP entrará em contato por e-mail.', 'success');

        setTimeout(() => {
            setAuthMode('login');
            showToast('Use as contas demonstrativas abaixo para explorar a Área Dev agora.', 'info');
        }, 1500);
    }

    // ── RECUPERAÇÃO DE SENHA ──
    window.handleForgotPassword = function (e) {
        e.preventDefault();
        const email = document.getElementById('emailInput')?.value.trim();
        if (!email) {
            showToast('Digite seu e-mail no campo acima para redefinir a senha.', 'info');
            document.getElementById('emailInput')?.focus();
            return;
        }
        showToast(`Instruções de redefinição enviadas para ${email} (verifique sua caixa de entrada).`, 'success');
    };

    // ── GRAVAÇÃO DE SESSÃO COM EXPIRAÇÃO ──
    function salvarSessao(dados) {
        if (window.CDHU_STORAGE && window.CDHU_STORAGE.auth) {
            window.CDHU_STORAGE.auth.setSession(dados);
            return;
        }
        const sessao = {
            ...dados,
            loginTime: new Date().toISOString(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
        };
        localStorage.setItem('adesp_auth_session', JSON.stringify(sessao));
    }

    // ── SISTEMA DE TOAST / NOTIFICAÇÃO ──
    function showToast(message, type = 'info') {
        let toast = document.getElementById('authToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'authToast';
            toast.className = 'auth-toast';
            document.body.appendChild(toast);
        }

        const icons = {
            error: '<i class="fas fa-exclamation-triangle"></i>',
            success: '<i class="fas fa-check-circle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };

        toast.innerHTML = `${icons[type] || ''} <span>${message}</span>`;
        toast.className = `auth-toast show ${type}`;

        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 4500);
    }

    // ── INICIALIZAÇÃO ──
    document.addEventListener('DOMContentLoaded', function () {
        // Se já tiver sessão válida, avisar ou permitir entrar direto
        const sessionStr = localStorage.getItem('adesp_auth_session');
        if (sessionStr) {
            try {
                const s = JSON.parse(sessionStr);
                if (s.expiresAt > Date.now()) {
                    showToast(`Sessão ativa como ${s.name}. Redirecionando...`, 'info');
                    setTimeout(() => window.location.href = redirectTarget, 1000);
                    return;
                }
            } catch (e) { }
        }

        // Renderiza o modo padrão (Login)
        setAuthMode('login');
    });

})();

