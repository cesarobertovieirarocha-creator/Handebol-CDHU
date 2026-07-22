/* ========================================
   FILTROS DE JOGOS / PARTIDAS ⚽
   Filtragem por categoria dos cards.
======================================== */

/**
 * Inicializa os filtros de partidas.
 */
function initMatchFilters() {
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Remove active de todos
            document.querySelectorAll('.filter-btn').forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');

            var filter = btn.dataset.filter;
            document.querySelectorAll('.match-card').forEach(function (card) {
                if (filter === 'all' || card.dataset[filter]) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeInUp ' + APP_CONFIG.animation.fadeInUpDuration + ' ' + APP_CONFIG.animation.fadeInUpEasing;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}
