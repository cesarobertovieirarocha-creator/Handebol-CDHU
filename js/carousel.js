/* ========================================
   CARROSSEL SPOTLIGHT DE ATLETAS 🌟
   Destaque automático no card central
   durante a rolagem horizontal.
======================================== */

/**
 * Inicializa o carrossel spotlight.
 */
function initSpotlightCarousel() {
    var track = document.getElementById('spotlightTrack');
    if (track) {
        function updateSpotlight() {
            var cards = track.querySelectorAll('.spotlight-card');
            var trackCenter = track.scrollLeft + track.clientWidth / 2;
            var closestCard = null;
            var minDist = Infinity;
            cards.forEach(function (card) {
                var cardCenter = card.offsetLeft + card.offsetWidth / 2;
                var dist = Math.abs(trackCenter - cardCenter);
                if (dist < minDist) {
                    minDist = dist;
                    closestCard = card;
                }
            });
            cards.forEach(function (c) { c.classList.remove('active'); });
            if (closestCard) closestCard.classList.add('active');
        }
        track.addEventListener('scroll', updateSpotlight, { passive: true });
        // Ativa o primeiro card visível ao carregar
        setTimeout(updateSpotlight, APP_CONFIG.animation.spotlightDelay);
    }
}
