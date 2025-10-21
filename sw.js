// --- MODIFICA OBBLIGATORIA ---
// Sostituisci '/beer-vocabulary-app/' con il nome del tuo repository GitHub, 
// assicurandoti che inizi e finisca con uno slash '/'.
const REPO_PREFIX = '/beer-vocabulary-app/'; 

// Aumentiamo la versione della cache. Ogni volta che modifichi questo file,
// aumenta il numero (v2, v3...) per forzare l'aggiornamento.
const CACHE_NAME = 'beer-vocab-cache-v2';

// Lista dei file fondamentali dell'app da salvare subito.
// Ora usiamo il REPO_PREFIX per creare i percorsi corretti.
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

// 1. Evento "install": Salva i file fondamentali nella cache
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
  
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching app shell con percorsi corretti');
      return cache.addAll(FILES_TO_CACHE)
        .catch(error => {
            // Se c'è un errore, loggalo! Così sappiamo quale file ha fallito.
            console.error('[ServiceWorker] Impossibile eseguire il pre-caching', error);
        });
    })
  );

  self.skipWaiting();
});

// 2. Evento "activate": Pulisce le vecchie cache
self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        // Elimina tutte le cache che NON sono quella attuale (v2)
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// 3. Evento "fetch": Intercetta le richieste di rete
self.addEventListener('fetch', (evt) => {
  if (evt.request.method !== 'GET') {
    return;
  }
  
  // Strategia: Cache First
  evt.respondWith(
    caches.match(evt.request)
      .then((response) => {
        if (response) {
          // Trovato in cache
          // console.log('[ServiceWorker] Fetching from cache:', evt.request.url);
          return response;
        }
        
        // Non trovato in cache, vai su Internet
        // console.log('[ServiceWorker] Fetching from network:', evt.request.url);
        return fetch(evt.request)
            .then(networkResponse => {
                // (Opzionale) Potremmo salvare in cache anche queste nuove richieste
                // ma per ora lo lasciamo semplice.
                return networkResponse;
            });
      })
  );
});