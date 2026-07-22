/* ========================================
   SISTEMA DE NOTIFICAÇÕES 🔔
   Exibe alertas visuais temporários.
======================================== */

/**
 * Exibe uma notificação temporária na tela.
 * @param {string} message - Texto da notificação.
 * @param {string} type - Tipo: "success", "error", "info".
 */
function showNotification(message, type) {
    type = type || 'info';
    var duration = APP_CONFIG.notifications.duration;
    var animationOut = APP_CONFIG.notifications.animationOut;

    // Remove notificação existente
    var existing = document.querySelector('.app-notification');
    if (existing) existing.remove();

    var notification = document.createElement('div');
    notification.className = 'app-notification notification-' + type;
    notification.textContent = message;
    notification.style.cssText = 'position:fixed;top:20px;right:20px;padding:15px 25px;border-radius:8px;color:#fff;font-weight:600;z-index:10000;opacity:0;transform:translateY(-20px);transition:all 0.3s ease;';

    if (type === 'success') {
        notification.style.background = '#1F8A4D';
    } else if (type === 'error') {
        notification.style.background = '#E53935';
    } else {
        notification.style.background = '#0A509E';
    }

    document.body.appendChild(notification);

    // Anima entrada
    requestAnimationFrame(function () {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    });

    // Remove após duração configurada
    setTimeout(function () {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(function () {
            if (notification.parentNode) notification.remove();
        }, animationOut);
    }, duration);
}
