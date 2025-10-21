const CACHE_NAME = 'beer-vocab-cache-v1';

// Lista dei file fondamentali dell'app da salvare subito.
const FILES_TO_CACHE = [
  '/beer-vocabulary-app/', // L'alias per la index
  'index.html',
  'descriptor.html',
  'categories.html',
  'settings.html',
  'css/style.css',
  'js/app.js',
  'manifest.json',
  'images/icon-192x192.png', // Aggiungi qui le tue icone
  'images/icon-256x256.png',
  'images/icon-384x384.png',
  'images/icon-512x512.png'
];

// 1. Evento "install": Salva i file fondamentali nella cache
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
  
  // Aspetta che la cache sia pronta
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching app shell');
      // Aggiunge tutti i file della lista alla cache
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// 2. Evento "activate": Pulisce le vecchie cache
self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  // Rimuove le cache vecchie che non servono più
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

// 3. Evento "fetch": Intercetta le richieste di rete (il cuore!)
self.addEventListener('fetch', (evt) => {
  // Ignora le richieste che non sono GET (es. POST)
  if (evt.request.method !== 'GET') {
    return;
  }
  
  // Strategia: Cache First (prima cerco in cache)
  evt.respondWith(
    caches.match(evt.request) // Cerca nella cache
      .then((response) => {
        if (response) {
          // Se trovato in cache, ritorna la risposta dalla cache
          console.log('[ServiceWorker] Fetching from cache:', evt.request.url);
          return response;
        }
        
        // Se non trovato in cache, vai su Internet
        console.log('[ServiceWorker] Fetching from network:', evt.request.url);
        return fetch(evt.request);
      })
  );
});