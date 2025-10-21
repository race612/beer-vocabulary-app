// --- MODIFICA OBBLIGATORIA ---
// Sostituisci con il nome del tuo repo
const REPO_PREFIX = '/beer-vocabulary-app/'; 
// ------------------------------

// 1. INCREMENTA LA VERSIONE DELLA CACHE
const CACHE_NAME = 'beer-vocab-cache-v3'; // Da v2 a v3

const FILES_TO_CACHE = [
  REPO_PREFIX,
  REPO_PREFIX + 'index.html',
  REPO_PREFIX + 'descriptor.html',
  REPO_PREFIX + 'categories.html',
  REPO_PREFIX + 'settings.html',
  REPO_PREFIX + 'css/style.css',
  REPO_PREFIX + 'js/app.js',
  REPO_PREFIX + 'manifest.json',
  REPO_PREFIX + 'images/icon-192x192.png',
  REPO_PREFIX + 'images/icon-256x256.png',
  REPO_PREFIX + 'images/icon-384x384.png',
  REPO_PREFIX + 'images/icon-512x512.png'
];

// Evento "install"
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install v3');
  
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching app shell');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  
  // 2. RIMUOVI self.skipWaiting() DA QUI!
  // Non lo vogliamo più automatico.
});

// Evento "activate" (invariato)
self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// 3. AGGIUNGI QUESTO NUOVO BLOCCO
// Questo listener aspetta il messaggio dal popup
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[ServiceWorker] Ricevuto comando SKIP_WAITING');
    self.skipWaiting(); // Attiva il nuovo Service Worker
  }
});

// Evento "fetch" (invariato)
self.addEventListener('fetch', (evt) => {
    // ... (il tuo codice 'fetch' rimane identico) ...
});