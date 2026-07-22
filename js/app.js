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

    // ── Formulário "Participe" ──
    var form = document.querySelector(".participe-form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var nome = form.querySelector('input[type="text"]').value.trim();
            var email = form.querySelector('input[type="email"]').value.trim();

            if (!nome || !email) {
                showNotification("Preencha todos os campos!", "error");
                return;
            }
            showNotification("Inscrição enviada com sucesso! 🚀", "success");
            form.reset();
        });
    }
});
