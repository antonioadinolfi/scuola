/**
 * pwa-register.js
 * Prof. Antonio Adinolfi | antonioadinolfi.it
 *
 * Registra il Service Worker e gestisce:
 * - Notifica di aggiornamento disponibile
 * - Prompt di installazione (A2HS) su Android/Chrome
 */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     1. Registrazione Service Worker
  --------------------------------------------------------------- */
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('[PWA] Service Worker registrato:', reg.scope);

      /* -------------------------------------------------------
         Controlla aggiornamenti ogni volta che la pagina
         torna in primo piano (utile per chi lascia il sito
         aperto a lungo)
      ------------------------------------------------------- */
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          reg.update();
        }
      });

      /* -------------------------------------------------------
         Mostra banner "Aggiornamento disponibile" quando
         un nuovo SW è in attesa di attivazione
      ------------------------------------------------------- */
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (
            newWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            showUpdateBanner(reg);
          }
        });
      });

    } catch (err) {
      console.warn('[PWA] Registrazione fallita:', err);
    }
  });

  /* ---------------------------------------------------------------
     2. Banner "Aggiornamento disponibile"
     Appare in basso a destra, sparisce da solo dopo 12 secondi
  --------------------------------------------------------------- */
  function showUpdateBanner(reg) {
    // Evita banner duplicati
    if (document.getElementById('pwa-update-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'pwa-update-banner';
    banner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        background: #0b3b75;
        color: #fff;
        border-radius: 14px;
        padding: 14px 18px;
        max-width: 320px;
        box-shadow: 0 8px 28px rgba(0,0,0,0.32);
        display: flex;
        align-items: center;
        gap: 14px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        animation: slideUp 0.3s ease;
      ">
        <i class="fas fa-rotate" style="font-size:18px; flex:0 0 auto;"></i>
        <div style="flex:1;">
          <strong style="display:block; margin-bottom:2px;">
            Aggiornamento disponibile
          </strong>
          <span style="opacity:0.85; font-size:13px;">
            Ricarica per applicare le novità.
          </span>
        </div>
        <div style="display:flex; gap:8px; flex:0 0 auto;">
          <button id="pwa-reload-btn" style="
            background: #38bdf8;
            color: #0f172a;
            border: none;
            border-radius: 8px;
            padding: 7px 13px;
            font-weight: 700;
            font-size: 12px;
            cursor: pointer;
          ">Ricarica</button>
          <button id="pwa-dismiss-btn" style="
            background: rgba(255,255,255,0.12);
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 7px 10px;
            cursor: pointer;
            font-size: 12px;
          ">✕</button>
        </div>
      </div>
      <style>
        @keyframes slideUp {
          from { opacity:0; transform: translateY(14px); }
          to   { opacity:1; transform: translateY(0); }
        }
      </style>
    `;

    document.body.appendChild(banner);

    document.getElementById('pwa-reload-btn').addEventListener('click', () => {
      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      window.location.reload();
    });

    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
      banner.remove();
    });

    // Rimozione automatica dopo 12 secondi
    setTimeout(() => banner?.remove(), 12000);
  }

  /* ---------------------------------------------------------------
     3. Prompt installazione A2HS (Add to Home Screen)
     Intercetta l'evento beforeinstallprompt e mostra un bottone
     personalizzato invece del prompt nativo del browser
  --------------------------------------------------------------- */
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Mostra il bottone solo se non già installata
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    showInstallButton();
  });

  function showInstallButton() {
    if (document.getElementById('pwa-install-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'pwa-install-btn';
    btn.innerHTML = '<i class="fas fa-download"></i> Installa app';
    btn.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 9998;
      background: #0b3b75;
      color: #fff;
      border: none;
      border-radius: 14px;
      padding: 13px 18px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0,0,0,0.28);
      display: flex;
      align-items: center;
      gap: 10px;
    `;

    btn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] Installazione:', outcome);
      deferredPrompt = null;
      btn.remove();
    });

    document.body.appendChild(btn);
  }

  // Nascondi il bottone se l'app viene installata
  window.addEventListener('appinstalled', () => {
    document.getElementById('pwa-install-btn')?.remove();
    deferredPrompt = null;
    console.log('[PWA] App installata con successo');
  });

})();
