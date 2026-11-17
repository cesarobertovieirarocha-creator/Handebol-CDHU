/* =========================================================================
   MODERN EFFECTS & LUXURY INTERACTIONS — ADESP/CDHU UBERLÂNDIA
   Preloader, Scroll Reveal, 3D Tilt, Mouse Spotlight, Cookie Consent & Form
========================================================================= */

(function () {
    "use strict";

    /* ── 1. PRELOADER CONTROLLER ── */
    function initPreloader() {
        var preloader = document.getElementById("site-preloader");
        if (!preloader) return;

        function hidePreloader() {
            preloader.classList.add("fade-out");
            setTimeout(function () {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 650);
        }

        // Se a página já carregou ou ao disparar load
        if (document.readyState === "complete") {
            setTimeout(hidePreloader, 400);
        } else {
            window.addEventListener("load", function () {
                setTimeout(hidePreloader, 400);
            });
        }

        // Fallback de segurança (máximo 2.5s)
        setTimeout(hidePreloader, 2500);
    }

    /* ── 2. SCROLL REVEAL OBSERVER ── */
    function initScrollReveal() {
        var revealElements = document.querySelectorAll(".scroll-reveal");
        if (!revealElements.length || !("IntersectionObserver" in window)) return;

        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ── 3. 3D TILT EFFECT & MOUSE SPOTLIGHT GLOW ── */
    function init3DTiltAndGlow() {
        // Spotlight Glow com variáveis CSS
        var glowCards = document.querySelectorAll(".mouse-glow-card, .player-card, .tour-card");
        glowCards.forEach(function (card) {
            card.classList.add("mouse-glow-card");
            card.addEventListener("mousemove", function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                card.style.setProperty("--mouse-x", x + "px");
                card.style.setProperty("--mouse-y", y + "px");
            });
        });

        // 3D Tilt nos cards de jogadores e de preço
        var tiltCards = document.querySelectorAll(".card-tilt-3d, .player-card, .glass-pricing-card");
        tiltCards.forEach(function (card) {
            card.classList.add("card-tilt-3d");
            
            card.addEventListener("mousemove", function (e) {
                var rect = card.getBoundingClientRect();
                var cardWidth = rect.width;
                var cardHeight = rect.height;
                var centerX = rect.left + cardWidth / 2;
                var centerY = rect.top + cardHeight / 2;
                
                var mouseX = e.clientX - centerX;
                var mouseY = e.clientY - centerY;
                
                var rotateX = (mouseY / (cardHeight / 2)) * -8; // Máximo 8 graus
                var rotateY = (mouseX / (cardWidth / 2)) * 8;
                
                card.style.transform = "perspective(1000px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg) scale3d(1.02, 1.02, 1.02)";
            });

            card.addEventListener("mouseleave", function () {
                card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
            });
        });
    }

    /* ── 4. MODAL DE VÍDEO EXPANSIVO ── */
    window.openVideoModal = function (videoUrl) {
        var modal = document.getElementById("videoExpansivoModal");
        var iframe = document.getElementById("videoModalIframe");
        if (!modal || !iframe) return;

        iframe.src = videoUrl || "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1";
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    window.closeVideoModal = function () {
        var modal = document.getElementById("videoExpansivoModal");
        var iframe = document.getElementById("videoModalIframe");
        if (!modal) return;

        modal.classList.remove("active");
        if (iframe) iframe.src = "";
        document.body.style.overflow = "auto";
    };

    /* ── 5. BANNER DE COOKIES (LGPD) ── */
    function initCookieConsent() {
        var banner = document.getElementById("cookieConsentBanner");
        if (!banner) return;

        var consent = localStorage.getItem("adesp_cookie_consent");
        if (!consent) {
            setTimeout(function () {
                banner.classList.add("visible");
            }, 1200);
        }

        var btnAccept = document.getElementById("btnAcceptCookies");
        var btnDecline = document.getElementById("btnDeclineCookies");

        if (btnAccept) {
            btnAccept.addEventListener("click", function () {
                localStorage.setItem("adesp_cookie_consent", "accepted");
                banner.classList.remove("visible");
            });
        }

        if (btnDecline) {
            btnDecline.addEventListener("click", function () {
                localStorage.setItem("adesp_cookie_consent", "declined");
                banner.classList.remove("visible");
            });
        }
    }

    /* ── 6. FORMULÁRIO "FAÇA PARTE": VALIDAÇÃO E WHATSAPP SYNC ── */
    function initEnhancedForm() {
        var form = document.querySelector(".participe-form");
        if (!form) return;

        var phoneInput = form.querySelector('input[type="tel"]');
        if (phoneInput) {
            // Máscara dinâmica (99) 99999-9999
            phoneInput.addEventListener("input", function (e) {
                var value = e.target.value.replace(/\D/g, "");
                if (value.length > 11) value = value.slice(0, 11);

                if (value.length > 6) {
                    e.target.value = "(" + value.slice(0, 2) + ") " + value.slice(2, 7) + "-" + value.slice(7);
                } else if (value.length > 2) {
                    e.target.value = "(" + value.slice(0, 2) + ") " + value.slice(2);
                } else if (value.length > 0) {
                    e.target.value = "(" + value;
                }
            });
        }

        // Limpa feedback de erro quando o usuário digita ou altera o campo
        form.querySelectorAll('input, select').forEach(function (input) {
            input.addEventListener("input", function () {
                this.classList.remove("form-input-error");
            });
            input.addEventListener("change", function () {
                this.classList.remove("form-input-error");
            });
        });

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            var nameInput = form.querySelector('input[type="text"]');
            var emailInput = form.querySelector('input[type="email"]');
            var selectCat = form.querySelector("select");
            var submitBtn = form.querySelector('button[type="submit"]');

            var nome = nameInput ? nameInput.value.trim() : "";
            var email = emailInput ? emailInput.value.trim() : "";
            var phone = phoneInput ? phoneInput.value.trim() : "";
            var categoria = selectCat ? selectCat.value : "";

            var hasError = false;

            // Validação de nome
            if (nome.length < 3) {
                nameInput.classList.add("form-input-error");
                hasError = true;
            } else {
                nameInput.classList.remove("form-input-error");
            }

            // Validação de email
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                emailInput.classList.add("form-input-error");
                hasError = true;
            } else {
                emailInput.classList.remove("form-input-error");
            }

            // Validação de telefone
            var rawPhone = phone.replace(/\D/g, "");
            if (rawPhone.length < 10) {
                phoneInput.classList.add("form-input-error");
                hasError = true;
            } else {
                phoneInput.classList.remove("form-input-error");
            }

            // Validação de categoria
            if (!categoria) {
                selectCat.classList.add("form-input-error");
                hasError = true;
            } else {
                selectCat.classList.remove("form-input-error");
            }

            if (hasError) {
                if (typeof showNotification === "function") {
                    showNotification("Por favor, preencha os campos destacados corretamente.", "error");
                }
                return;
            }

            // Feedback de Carregamento
            if (submitBtn) {
                submitBtn.classList.add("btn-loading");
                submitBtn.disabled = true;
            }

            // Prepara mensagem oficial formatada para o WhatsApp do clube
            var msg = "🏆 *NOVO INTERESSADO - ADESP/CDHU*%0A%0A" +
                      "👤 *Nome:* " + encodeURIComponent(nome) + "%0A" +
                      "📧 *E-mail:* " + encodeURIComponent(email) + "%0A" +
                      "📱 *WhatsApp:* " + encodeURIComponent(phone) + "%0A" +
                      "🤾 *Categoria:* " + encodeURIComponent(categoria) + "%0A%0A" +
                      "_Enviado através do site oficial adespcdhu.com_";

            var waUrl = "https://wa.me/5534999781368?text=" + msg;

            if (typeof showNotification === "function") {
                showNotification("Inscrição validada! Abrindo WhatsApp oficial... 🚀", "success");
            }

            setTimeout(function () {
                // Abre o WhatsApp com a mensagem pronta
                window.open(waUrl, "_blank");

                // Redireciona para a página de obrigado
                window.location.href = "obrigado.html";
            }, 800);
        });
    }

    /* ── INICIALIZAÇÃO GERAL ── */
    document.addEventListener("DOMContentLoaded", function () {
        initPreloader();
        initScrollReveal();
        init3DTiltAndGlow();
        initCookieConsent();
        initEnhancedForm();

        // Fechar modal de vídeo com ESC
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                window.closeVideoModal();
            }
        });
    });

})();

