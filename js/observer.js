/* ========================================
   INTERSECTION OBSERVER 🎬
   Animações de entrada ao scroll.
======================================== */

/**
 * Inicializa o IntersectionObserver para revelar
 * seções e cards ao entrarem na viewport.
 */
function initScrollObserver() {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) entry.target.classList.add("show");
        });
    }, {
        threshold: APP_CONFIG.observer.threshold,
        rootMargin: APP_CONFIG.observer.rootMargin
    });

    document.querySelectorAll(APP_CONFIG.observedSelectors).forEach(function (el) {
        el.classList.add("hidden");
        observer.observe(el);
    });
}
