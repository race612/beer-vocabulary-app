// --- MODIFICA OBBLIGATORIA ---
const REPO_PREFIX = '/beer-vocabulary-app/'; 
// ------------------------------

// --- IMPORTA CONFIGURAZIONE ---
// Percorso aggiornato a 'js/config.js'
try {
    importScripts(REPO_PREFIX + 'js/config.js');
} catch (e) {
    console.error('Impossibile importare config.js in sw.js', e);
    importScripts('js/config.js'); 
}
// ------------------------------

// Ora abbiamo accesso alla variabile 'APP_VERSION' definita in config.js
const CACHE_NAME = `beer-vocab-cache-app-v${APP_VERSION}-db-v${DB_VERSION}`;

const FILES_TO_CACHE = [
  REPO_PREFIX, 
  REPO_PREFIX + 'index.html',
  REPO_PREFIX + 'descriptor.html',
  REPO_PREFIX + 'categories.html',
  REPO_PREFIX + 'settings.html',
  REPO_PREFIX + 'search.html',
  REPO_PREFIX + 'css/style.css',
  REPO_PREFIX + 'js/app.js',
  REPO_PREFIX + 'manifest.json',
  REPO_PREFIX + 'js/config.js',
  // Icone
  REPO_PREFIX + 'images/icon-192x192.png',
  REPO_PREFIX + 'images/icon-256x256.png',
  REPO_PREFIX + 'images/icon-384x384.png',
  REPO_PREFIX + 'images/icon-512x512.png'
];

// --- Evento "install" ---
self.addEventListener('install', (evt) => {
  console.log(`[ServiceWorker] Install v${APP_VERSION}`);
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching app shell');
      return cache.addAll(FILES_TO_CACHE)
        .catch(error => {
            console.error('[ServiceWorker] Impossibile eseguire il pre-caching', error);
        });
    })
  );
});

// --- Evento "activate" ---
self.addEventListener('activate', (evt) => {
  console.log(`[ServiceWorker] Activate v${APP_VERSION}`);
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

// --- Evento "message" ---
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting(); 
  }
});

// --- Evento "fetch" ---
self.addEventListener('fetch', (evt) => {
    if (evt.request.method !== 'GET') {
      return;
    }
    const requestUrl = new URL(evt.request.url);

    // Logica per pagine "template" come descriptor.html
    if (requestUrl.pathname.endsWith('/descriptor.html')) {
        const templateRequest = new Request(REPO_PREFIX + 'descriptor.html');
        evt.respondWith(
            caches.match(templateRequest)
                .then((response) => {
                    return response || fetch(templateRequest);
                })
        );
        return; 
    }

    // Logica standard (Cache First)
    evt.respondWith(
        caches.match(evt.request)
            .then((response) => {
                return response || fetch(evt.request);
            })
    );
});