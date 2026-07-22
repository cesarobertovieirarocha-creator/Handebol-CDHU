/* ========================================
   UTILITÁRIOS 🔧
   - Scroll suave para links âncora
   - Botão "Voltar ao topo"
   - Função global toggleNews
======================================== */

/**
 * Inicializa scroll suave para todos os links âncora.
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute("href"));
            if (target) target.scrollIntoView({ behavior: "smooth" });
        });
    });
}

/**
 * Inicializa o botão "Voltar ao topo".
 */
function initBackToTop() {
    var backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > APP_CONFIG.scroll.backToTopThreshold) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });
        backToTopBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
}

/**
 * Função global: expandir/recolher texto das notícias.
 * Chamada via onclick inline no HTML.
 */
function toggleNews(btn, excerptClass) {
    var paragraph = btn.parentElement.querySelector('.' + excerptClass);

    if (paragraph) {
        paragraph.classList.toggle('expanded');

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
