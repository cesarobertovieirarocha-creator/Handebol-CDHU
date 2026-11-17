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
        function toggleMenu(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            var isActive = navMenu.classList.toggle("active");
            hamburger.classList.toggle("active");
            hamburger.setAttribute("aria-expanded", isActive ? "true" : "false");
            
            // Previne scroll da página quando menu estiver aberto
            if (isActive) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
        }

        function closeMenu() {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
        }

        // Suporte a click e toque direto
        hamburger.addEventListener("click", toggleMenu);
        hamburger.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                toggleMenu(e);
            }
        });

        // Fecha ao clicar em qualquer link do menu
        document.querySelectorAll(".nav-menu a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        // Fecha ao clicar fora do menu
        document.addEventListener("click", function (e) {
            if (navMenu.classList.contains("active") && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                closeMenu();
            }
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
