/**
 * sw.js — Service Worker
 * Prof. Antonio Adinolfi | antonioadinolfi.it
 *
 * Strategia: Cache-first per asset statici, Network-first per pagine HTML e JS.
 * Aggiorna CACHE_VERSION ogni volta che pubblichi modifiche significative.
 */

const CACHE_VERSION = 'adinolfi-v1';

/* ---------------------------------------------------------------
   Asset da pre-cachare all'installazione (shell dell'app).
   Questi file saranno disponibili ANCHE offline.
   Aggiorna l'elenco se aggiungi nuove pagine o file critici.
--------------------------------------------------------------- */
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/app-config-v2.js',
  '/materiali.html',
  '/classe_sql.html',
  '/pubblicazioni.html',
  '/privacy.html',
  '/immagini/logo_liceo_embedded.png',
  '/immagini/foto_adinolfi_embedded.png',
  '/immagini/logo_liceo.png',
  // Font Awesome (da CDN — verrà cachato al primo caricamento,
  // non in pre-cache perché è su dominio esterno)
];

/* ---------------------------------------------------------------
   Pattern di URL da NON cachare mai
   (feed RSS, API esterne, counter visite, Google Sign-In)
--------------------------------------------------------------- */
const NEVER_CACHE = [
  'hitscounter.dev',
  'accounts.google.com',
  'rss2json.com',
  'allorigins.win',
  'api.',
  'feed',
];

/* ---------------------------------------------------------------
   INSTALL — pre-cacha la shell dell'app
--------------------------------------------------------------- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()) // attiva subito senza aspettare la chiusura delle tab
  );
});

/* ---------------------------------------------------------------
   ACTIVATE — rimuove cache vecchie di versioni precedenti
--------------------------------------------------------------- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_VERSION)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim()) // prende controllo di tutte le tab aperte
  );
});

/* ---------------------------------------------------------------
   FETCH — strategia per tipo di risorsa
--------------------------------------------------------------- */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora richieste non-GET (POST per Google Sign-In, ecc.)
  if (request.method !== 'GET') return;

  // Non cachare mai URL in blacklist
  if (NEVER_CACHE.some(pattern => request.url.includes(pattern))) return;

  // Solo richieste http/https
  if (!url.protocol.startsWith('http')) return;

  // Pagine HTML → Network-first con fallback cache
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(networkFirstHTML(request));
    return;
  }

  // JS/CSS/Immagini dello stesso dominio → Cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Font Google / Font Awesome CDN → Cache-first (stale-while-revalidate)
  if (
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('cdnjs.cloudflare.com')
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Tutto il resto → passa direttamente alla rete
});

/* ---------------------------------------------------------------
   Strategia: Network-first con fallback alla cache (per HTML)
--------------------------------------------------------------- */
async function networkFirstHTML(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Fallback offline: mostra index.html
    return caches.match('/index.html');
  }
}

/* ---------------------------------------------------------------
   Strategia: Cache-first con aggiornamento in background (per asset)
--------------------------------------------------------------- */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    // Aggiorna in background senza bloccare la risposta
    fetch(request)
      .then(async networkResponse => {
        if (networkResponse.ok) {
          const cache = await caches.open(CACHE_VERSION);
          cache.put(request, networkResponse);
        }
      })
      .catch(() => {}); // silenzioso se offline
    return cached;
  }
  // Non in cache → prova la rete
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return new Response('Risorsa non disponibile offline', { status: 503 });
  }
}
