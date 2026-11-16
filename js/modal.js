/* ========================================
   MODAL RESUMO DE PARTIDA 🏆
   Consome dados de: data/matches.js
======================================== */

/**
 * Abre o modal de resumo de uma partida.
 * Chamada via onclick inline no HTML.
 * @param {string} matchId - ID da partida em matchData.
 */
function openMatchSummary(matchId) {
    var modal = document.getElementById('matchSummaryModal');
    var modalBody = document.getElementById('modalBody');
    var data = matchData[matchId];

    if (!data) return;

    // Parse scores from the title (e.g. "Team A 21 x 28 Team B")
    var scoreMatch = data.title.match(/(\d+)\s*x\s*(\d+)/);
    var golsMarcados = '-';
    var golsSofridos = '-';
    if (scoreMatch) {
        // ADESP is always the bigger score in a win
        var s1 = parseInt(scoreMatch[1]);
        var s2 = parseInt(scoreMatch[2]);
        golsMarcados = Math.max(s1, s2);
        golsSofridos = Math.min(s1, s2);
    }

    modalBody.innerHTML = '\
        <div class="modal-header">\
            <h2>' + data.title + '</h2>\
            <p style="color: #64748b; font-weight: 600; margin-top: 5px;">' + data.date + '</p>\
        </div>\
        <div class="modal-mvp">\
            <i class="fas fa-trophy"></i>\
            <span>MVP da Partida: ' + data.mvp + ' (' + data.gols + ' Gols)</span>\
        </div>\
        <div class="modal-recap">\
            <p>' + data.recap + '</p>\
            <p style="margin-top: 15px; font-weight: 600; color: #1F8A4D;">' + data.highlights + '</p>\
        </div>\
        <div class="modal-stats-grid">\
            <div class="stat-box">\
                <strong>' + golsMarcados + '</strong>\
                <span>Gols Marcados</span>\
            </div>\
            <div class="stat-box">\
                <strong>' + golsSofridos + '</strong>\
                <span>Gols Sofridos</span>\
            </div>\
        </div>';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Fecha o modal de resumo de partida.
 * Chamada via onclick inline no HTML.
 */
function closeModal() {
    var modal = document.getElementById('matchSummaryModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

/**
 * Inicializa listener de tecla ESC para fechar modais.
 */
function initModalKeyListeners() {
    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
            if (typeof closePlayerModal === 'function') closePlayerModal();
        }
    });
}
