/* ========================================
   MODAL ESTATÍSTICAS DO JOGADOR 📊
   Consome dados de: data/players.js
======================================== */

/**
 * Abre o modal de estatísticas de um jogador.
 * @param {string} playerName - Nome do jogador.
 */
function openPlayerStats(playerName) {
    var modal = document.getElementById('playerStatsModal');
    var modalBody = document.getElementById('playerModalBody');

    var data = playerStatsData[playerName];
    if (!data) {
        // Gera stats fictícios baseando no tamanho do nome (para ficar consistente por jogador)
        var nameLen = playerName.length;
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

    modalBody.innerHTML = '\
        <div class="modal-header">\
            <h2>' + playerName + '</h2>\
            <p style="color: #1F8A4D; font-weight: 700; margin-top: 5px; text-transform: uppercase;">Estatísticas da Temporada</p>\
        </div>\
        <div class="modal-stats-grid" style="grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px;">\
            <div class="stat-box" style="padding: 15px;">\
                <strong style="color: #0A509E; font-size: 1.6rem;">' + data.jogos + '</strong>\
                <span>Jogos</span>\
            </div>\
            <div class="stat-box" style="padding: 15px;">\
                <strong style="color: #1F8A4D; font-size: 1.6rem;">' + data.gols + '</strong>\
                <span>Gols</span>\
            </div>\
            <div class="stat-box" style="padding: 15px;">\
                <strong style="color: #F4C542; font-size: 1.6rem;">' + data.assistencias + '</strong>\
                <span>Assistências</span>\
            </div>\
            <div class="stat-box" style="padding: 15px;">\
                <strong style="color: #FF9800; font-size: 1.6rem;">' + data.vitorias + '</strong>\
                <span>Vitórias</span>\
            </div>\
            <div class="stat-box" style="padding: 15px;">\
                <strong style="color: #9E9E9E; font-size: 1.6rem;">' + data.empates + '</strong>\
                <span>Empates</span>\
            </div>\
            <div class="stat-box" style="padding: 15px;">\
                <strong style="color: #E53935; font-size: 1.6rem;">' + data.derrotas + '</strong>\
                <span>Derrotas</span>\
            </div>\
            <div class="stat-box" style="padding: 15px;">\
                <strong style="color: #FFB300; font-size: 1.6rem;">' + data.cartoesAmarelos + '</strong>\
                <span>C. Amarelos</span>\
            </div>\
            <div class="stat-box" style="padding: 15px;">\
                <strong style="color: #F44336; font-size: 1.6rem;">' + data.cartoesVermelhos + '</strong>\
                <span>C. Vermelhos</span>\
            </div>\
        </div>';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Fecha o modal de estatísticas do jogador.
 * Chamada via onclick inline no HTML.
 */
function closePlayerModal() {
    var modal = document.getElementById('playerStatsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

/**
 * Inicializa os eventos de clique nos cards de jogadores.
 */
function initPlayerCardClicks() {
    var playerCards = document.querySelectorAll(APP_CONFIG.playerCardSelectors);
    playerCards.forEach(function (card) {
        card.addEventListener('click', function () {
            var h3 = this.querySelector('h3');
            if (h3) {
                // Usa textContent para pegar o nome original sem transformação do CSS uppercase
                openPlayerStats(h3.textContent.trim());
            }
        });
    });
}
