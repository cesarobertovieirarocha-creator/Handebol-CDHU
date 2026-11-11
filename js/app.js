/* ========================================
   APP.JS — ORQUESTRADOR DA APLICAÇÃO 🎯
   Ponto de entrada: inicializa todos os
   módulos sem concentrar lógica de negócio.
======================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ── Navegação ──
    initHamburgerMenu();
    initNavbarScroll();
    initSmoothScroll();

    // ── Componentes visuais ──
    initSpotlightCarousel();
    initScrollObserver();

    // ── Interações ──
    initMatchFilters();
    initModalKeyListeners();
    initPlayerCardClicks();
    initBackToTop();

    // Nota: O envio, validação em tempo real e redirecionamento
    // do formulário .participe-form são gerenciados por js/modern-effects.js
});
