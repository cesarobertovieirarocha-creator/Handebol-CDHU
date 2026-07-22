/* ========================================
   MENU HAMBÚRGUER & NAVBAR SCROLL 📱
   - Toggle do menu mobile
   - Efeito "scrolled" na navbar
======================================== */

/**
 * Inicializa o menu hambúrguer (mobile).
 */
function initHamburgerMenu() {
    var hamburger = document.querySelector(".hamburger");
    var navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", function () {
            navMenu.classList.toggle("active");
            hamburger.classList.toggle("active");
        });

        document.querySelectorAll(".nav-menu a").forEach(function (link) {
            link.addEventListener("click", function () {
                navMenu.classList.remove("active");
                hamburger.classList.remove("active");
            });
        });
    }
}

/**
 * Inicializa o efeito de sombra/scroll na navbar.
 */
function initNavbarScroll() {
    window.addEventListener("scroll", function () {
        var navbar = document.querySelector(".navbar");
        if (window.scrollY > APP_CONFIG.scroll.navbarScrollThreshold) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });
}
