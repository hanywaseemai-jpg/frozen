/* js/utils.js
   Shared helper functions for every FrozenShop page.
   Exposes everything under window.fsUtils. Safe to include on every
   page — guards against being initialized twice. */
(function () {
  if (window.fsUtils) return; // duplicate-inclusion guard

  // Quote-free inline SVG placeholder (no literal ' or " characters,
  // so it's safe to embed inside onerror="this.src='...'" attributes).
  const PLACEHOLDER_IMG =
    'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 300%22%3E' +
    '%3Crect width=%22300%22 height=%22300%22 fill=%22%23EAF7FC%22/%3E' +
    '%3Cpath d=%22M150 90v120M95 125l110 60M95 185l110-60%22 stroke=%22%230E84B8%22 ' +
    'stroke-width=%2210%22 stroke-linecap=%22round%22/%3E%3C/svg%3E';

  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function safeGetJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      console.error(`safeGetJSON failed for key "${key}":`, err);
      return fallback;
    }
  }

  function safeSetJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`safeSetJSON failed for key "${key}":`, err);
      return false;
    }
  }

  function safeRemove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error(`safeRemove failed for key "${key}":`, err);
      return false;
    }
  }

  // Moves data from a legacy unnamespaced key (e.g. "cart") to the new
  // fs_-prefixed key (e.g. "fs_cart") so existing users don't lose data.
  function migrateLegacyKey(oldKey, newKey) {
    try {
      if (localStorage.getItem(newKey) !== null) return; // already migrated
      const legacy = localStorage.getItem(oldKey);
      if (legacy === null) return; // nothing to migrate
      localStorage.setItem(newKey, legacy);
      localStorage.removeItem(oldKey);
    } catch (err) {
      console.error(`migrateLegacyKey failed for "${oldKey}" -> "${newKey}":`, err);
    }
  }

  function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    if (!container) { console.warn('toastContainer not found; toast message:', message); return; }

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : 'success'}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    const icon = document.createElement('i');
    icon.className = type === 'error' ? 'fas fa-circle-exclamation' : 'fas fa-circle-check';
    icon.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(text);
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 300);
    }, 2600);
  }

  function emptyStateHTML(opts) {
    opts = opts || {};
    const icon = escapeHTML(opts.icon || 'fa-box-open');
    const title = escapeHTML(opts.title || 'لا توجد عناصر');
    const subtitle = opts.subtitle ? `<p>${escapeHTML(opts.subtitle)}</p>` : '';
    return `
      <div class="empty-state">
        <i class="fas ${icon}" aria-hidden="true"></i>
        <h3>${title}</h3>
        ${subtitle}
      </div>
    `;
  }

  window.fsUtils = {
    escapeHTML,
    debounce,
    safeGetJSON,
    safeSetJSON,
    safeRemove,
    migrateLegacyKey,
    showToast,
    emptyStateHTML,
    PLACEHOLDER_IMG,
  };
})();
