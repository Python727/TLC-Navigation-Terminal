'use strict';
/**
 * notify.js  — src/data/JS/utils/notify.js
 * ─────────────────────────────────────────────────────────────────────
 * Global helper function for triggering toast notifications.
 * Communicates with the <tlc-notification> component via CustomEvent.
 * ─────────────────────────────────────────────────────────────────────
 */

/**
 * @param {string} message  – Message text to display in the notification.
 * @param {'info'|'warn'|'danger'} [type='info']
 */
function tlcNotify(message, type = 'info') {
  window.dispatchEvent(new CustomEvent('tlc:notify', {
    detail: { message, type }
  }));
}

window.tlcNotify = tlcNotify;
