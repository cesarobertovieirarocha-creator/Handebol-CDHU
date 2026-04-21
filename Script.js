
// =========================
// 🎯 INICIALIZAÇÃO COMPLETA
// =========================
document.addEventListener("DOMContentLoaded", function () {

    // SPOTLIGHT CAROUSEL - destaque no card central 🎯
    const track = document.getElementById('spotlightTrack');
    if (track) {
        function updateSpotlight() {
            const cards = track.querySelectorAll('.spotlight-card');
            const trackCenter = track.scrollLeft + track.clientWidth / 2;
            let closestCard = null;
            let minDist = Infinity;
            cards.forEach(card => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                const dist = Math.abs(trackCenter - cardCenter);
                if (dist < minDist) {
                    minDist = dist;
                    closestCard = card;
                }
            });
            cards.forEach(c => c.classList.remove('active'));
            if (closestCard) closestCard.classList.add('active');
        }
        track.addEventListener('scroll', updateSpotlight, { passive: true });
        // Activa o primeiro card visível ao carregar
        setTimeout(updateSpotlight, 200);
    }


    // MENU HAMBURGER 📱
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            hamburger.classList.toggle("active");
        });

        document.querySelectorAll(".nav-menu a").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                hamburger.classList.remove("active");
            });
        });
    }

    // NAVBAR SCROLL ✨
    window.addEventListener("scroll", () => {
        const navbar = document.querySelector(".navbar");
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // SCROLL SUAVE 🚀
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) target.scrollIntoView({ behavior: "smooth" });
        });
    });

    // ANIMAÇÕES SCROLL 🎬
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("show");
        });
    });

    document.querySelectorAll(".section, .player-card, .match-card, .competicao-card").forEach(el => {
        el.classList.add("hidden");
        observer.observe(el);
    });

    // FORMULÁRIO ✅
    const form = document.querySelector(".participe-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const nome = form.querySelector('input[type="text"]').value.trim();
            const email = form.querySelector('input[type="email"]').value.trim();

            if (!nome || !email) {
                showNotification("Preencha todos os campos!", "error");
                return;
            }
            showNotification("Inscrição enviada com sucesso! 🚀", "success");
            form.reset();
        });
    }

    // FILTROS DE JOGOS
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active de todos
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            document.querySelectorAll('.match-card').forEach(card => {
                if (filter === 'all' || card.dataset[filter]) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // BACK TO TOP BUTTON LOGIC
    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});

// FUNÇÃO GLOBAL DE LER MAIS NAS NOTÍCIAS
function toggleNews(btn, excerptClass) {
    // Busca o parágrafo anterior ou dentro do mesmo container
    let paragraph = btn.parentElement.querySelector('.' + excerptClass);

    if (paragraph) {
        paragraph.classList.toggle('expanded');

        // Verifica se expandiu ou recolheu para trocar o texto/icone do botão
        if (paragraph.classList.contains('expanded')) {
            btn.innerHTML = 'Mostrar menos <i class="fas fa-arrow-up"></i>';
        } else {
            if (excerptClass === 'news-excerpt') {
                btn.innerHTML = 'Ler matéria completa <i class="fas fa-arrow-right"></i>';
            } else {
                btn.innerHTML = 'Ler mais <i class="fas fa-arrow-right"></i>';
            }
        }
    }
}

/* ========================================
   MODAL RESUMO DE PARTIDA 🏆
======================================== */
const matchData = {
    'funel-uberaba': {
        title: 'ADESP/CDHU 26 x 23 FUNEL Uberaba/CSND',
        date: '29 de Março, 2026',
        mvp: 'Gabriel Augusto "Bahia"',
        gols: 7,
        recap: 'A partida foi marcada por um ritmo intenso e equilíbrio constante do início ao fim. A ADESP/CDHU se manteve organizada durante todo o confronto, mostrando força coletiva, consistência e controle emocional para assumir o controle e definir o jogo na reta final',
        highlights: 'Destaque para as atuações ofensivas de Lucas Malveira e Gabriel Augusto ("Bahia"), que garantiram a eficiência necessária nos momentos decisivos para confirmar a vitória por 26 a 23.'
    }
};

function openMatchSummary(matchId) {
    const modal = document.getElementById('matchSummaryModal');
    const modalBody = document.getElementById('modalBody');
    const data = matchData[matchId];

    if (!data) return;

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${data.title}</h2>
            <p style="color: #64748b; font-weight: 600; margin-top: 5px;">${data.date}</p>
        </div>

        <div class="modal-mvp">
            <i class="fas fa-trophy"></i>
            <span>MVP da Partida: ${data.mvp} (${data.gols} Gols)</span>
        </div>

        <div class="modal-recap">
            <p>${data.recap}</p>
            <p style="margin-top: 15px; font-weight: 600; color: #1F8A4D;">${data.highlights}</p>
        </div>

        <div class="modal-stats-grid">
            <div class="stat-box">
                <strong>26</strong>
                <span>Gols Marcados</span>
            </div>
            <div class="stat-box">
                <strong>23</strong>
                <span>Gols Sofridos</span>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('matchSummaryModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Fechar com ESC
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        if (typeof closePlayerModal === 'function') closePlayerModal();
    }
});

/* ========================================
   MODAL ESTATÍSTICAS DO JOGADOR 📊
======================================== */
// Dados dinâmicos por jogador (Mock)
const playerStatsData = {
    "Alvaro Freitas": { jogos: 0, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 0, empates: 0, derrotas: 0 },
    "André Luiz": { jogos: 1, gols: 2, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 1, empates: 0, derrotas: 0 },
    "Bruno Teixeira": { jogos: 2, gols: 1, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 2, empates: 0, derrotas: 0 },
    "César Roberto": { jogos: 2, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 2, empates: 0, derrotas: 0 },
    "César Rodrigues": { jogos: 2, gols: 1, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 2, empates: 0, derrotas: 0 },
    "Claudio Junior": { jogos: 0, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 0, empates: 0, derrotas: 0 },
    "Douglas Lima": { jogos: 0, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 0, empates: 0, derrotas: 0 },
    "Eduardo Frange": { jogos: 2, gols: 1, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 1, empates: 0, derrotas: 0 },
    "Gabriel Augusto": { jogos: 2, gols: 14, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 2, empates: 0, derrotas: 0 },
    "Gabriel Fagundes": { jogos: 1, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 1, empates: 0, derrotas: 0 },
    "Ian Gois": { jogos: 1, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 1, empates: 0, derrotas: 0 },
    "Jan Fontes": { jogos: 2, gols: 2, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 2, empates: 0, derrotas: 0 },
    "Jhonny Soares": { jogos: 2, gols: 2, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 2, empates: 0, derrotas: 0 },
    "João Renato": { jogos: 0, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 0, empates: 0, derrotas: 0 },
    "João Vitor": { jogos: 0, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 0, empates: 0, derrotas: 0 },
    "Leonardo Quirino": { jogos: 2, gols: 1, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 2, empates: 0, derrotas: 0 },
    "Lucas Malveira": { jogos: 1, gols: 5, assistencias: 0, cartoesAmarelos: 1, cartoesVermelhos: 0, vitorias: 1, empates: 0, derrotas: 0 },
    "Lucas Reimer": { jogos: 2, gols: 10, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 2, empates: 0, derrotas: 0 },
    "Marco Carmin": { jogos: 0, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 0, empates: 0, derrotas: 0 },
    "Matheus Duarte": { jogos: 0, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 0, empates: 0, derrotas: 0 },
    "Natan Calixto": { jogos: 1, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 1, empates: 0, derrotas: 0 },
    "Nillander Bonfim": { jogos: 2, gols: 7, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 2, empates: 0, derrotas: 0 },
    "Paulo Linhares": { jogos: 0, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 0, empates: 0, derrotas: 0 },
    "Pedro Amaral": { jogos: 2, gols: 1, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 2, empates: 0, derrotas: 0 },
    "Pedro Lucas": { jogos: 0, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 0, empates: 0, derrotas: 0 },
    "Pedro Henrique": { jogos: 0, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 0, empates: 0, derrotas: 0 },
    "Raphael Gouveia": { jogos: 0, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 0, empates: 0, derrotas: 0 },
    "Suelso Junior": { jogos: 1, gols: 8, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 1, empates: 0, derrotas: 0 },
    "Thiago Tolomelli": { jogos: 2, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 2, empates: 0, derrotas: 0 },
    "Tulio Gabriel": { jogos: 0, gols: 0, assistencias: 0, cartoesAmarelos: 0, cartoesVermelhos: 0, vitorias: 0, empates: 0, derrotas: 0 }
};

function openPlayerStats(playerName) {
    const modal = document.getElementById('playerStatsModal');
    const modalBody = document.getElementById('playerModalBody');

    let data = playerStatsData[playerName];
    if (!data) {
        // Gera stats fictícios baseando no tamanho do nome (para ficar consistente por jogador)
        const nameLen = playerName.length;
        data = {
            jogos: (nameLen % 10) + 8,
            gols: (nameLen * 3) + 12,
            assistencias: (nameLen * 2) + 5,
            cartoesAmarelos: nameLen % 4,
            cartoesVermelhos: nameLen % 2 === 0 ? 0 : 1,
            vitorias: 5 + (nameLen % 4),
            empates: nameLen % 3,
            derrotas: nameLen % 3
        };
    }

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${playerName}</h2>
            <p style="color: #1F8A4D; font-weight: 700; margin-top: 5px; text-transform: uppercase;">Estatísticas da Temporada</p>
        </div>

        <div class="modal-stats-grid" style="grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px;">
            <div class="stat-box" style="padding: 15px;">
                <strong style="color: #0A509E; font-size: 1.6rem;">${data.jogos}</strong>
                <span>Jogos</span>
            </div>
            <div class="stat-box" style="padding: 15px;">
                <strong style="color: #1F8A4D; font-size: 1.6rem;">${data.gols}</strong>
                <span>Gols</span>
            </div>
            <div class="stat-box" style="padding: 15px;">
                <strong style="color: #F4C542; font-size: 1.6rem;">${data.assistencias}</strong>
                <span>Assistências</span>
            </div>
            <div class="stat-box" style="padding: 15px;">
                <strong style="color: #FF9800; font-size: 1.6rem;">${data.vitorias}</strong>
                <span>Vitórias</span>
            </div>
            <div class="stat-box" style="padding: 15px;">
                <strong style="color: #9E9E9E; font-size: 1.6rem;">${data.empates}</strong>
                <span>Empates</span>
            </div>
            <div class="stat-box" style="padding: 15px;">
                <strong style="color: #E53935; font-size: 1.6rem;">${data.derrotas}</strong>
                <span>Derrotas</span>
            </div>
            <div class="stat-box" style="padding: 15px;">
                <strong style="color: #FFB300; font-size: 1.6rem;">${data.cartoesAmarelos}</strong>
                <span>C. Amarelos</span>
            </div>
            <div class="stat-box" style="padding: 15px;">
                <strong style="color: #F44336; font-size: 1.6rem;">${data.cartoesVermelhos}</strong>
                <span>C. Vermelhos</span>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePlayerModal() {
    const modal = document.getElementById('playerStatsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Adicionar evento de clique em todos os cards de jogadores
document.addEventListener("DOMContentLoaded", function () {
    const playerCards = document.querySelectorAll('.player-card, .spotlight-card');
    playerCards.forEach(card => {
        card.addEventListener('click', function () {
            const h3 = this.querySelector('h3');
            if (h3) {
                // Usa textContent para pegar o nome original sem transformação do CSS uppercase
                openPlayerStats(h3.textContent.trim());
            }
        });
    });
});
