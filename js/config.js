/* ========================================
   CONFIGURAÇÕES GLOBAIS DA APLICAÇÃO ⚙️
   Constantes, durações, thresholds e
   demais parâmetros centralizados.
======================================== */
var APP_CONFIG = {

    // IntersectionObserver
    observer: {
        threshold: 0,          // threshold padrão do observer
        rootMargin: '0px'      // margem do root
    },

    // Animações
    animation: {
        fadeInUpDuration: '0.5s',   // duração do fadeInUp nos cards filtrados
        fadeInUpEasing: 'ease',     // easing do fadeInUp
        spotlightDelay: 200         // delay (ms) para ativar o primeiro card do spotlight
    },

    // Scroll
    scroll: {
        navbarScrollThreshold: 50,  // px para adicionar classe "scrolled" na navbar
        backToTopThreshold: 300     // px para exibir o botão voltar ao topo
    },

    // Notificações
    notifications: {
        duration: 3000,             // tempo (ms) de exibição da notificação
        animationOut: 300           // tempo (ms) da animação de saída
    },

    // Seletores observados pelo IntersectionObserver
    observedSelectors: '.section, .player-card, .match-card, .competicao-card',

    // Seletores dos cards de jogadores (clicáveis)
    playerCardSelectors: '.player-card, .spotlight-card'
};
