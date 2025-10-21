// --- GESTIONE DATI UTENTE (localStorage) ---

/**
 * Carica i dati utente salvati in localStorage
 */
function loadUserData() {
    const data = localStorage.getItem("beerUserData"); // "beerUserData" è la chiave
    return data ? JSON.parse(data) : {}; // Se non c'è nulla, ritorna un oggetto vuoto
}

/**
 * Salva l'oggetto userData corrente in localStorage
 */
function saveUserData() {
    // localStorage può salvare solo stringhe, quindi convertiamo il nostro oggetto in JSON
    localStorage.setItem("beerUserData", JSON.stringify(userData));
    console.log("Dati utente salvati in localStorage.");
}

// All'avvio dell'app, carichiamo i dati.
let userData = loadUserData();


// --- EVENT LISTENER PRINCIPALE ---
// Aspetta che l'HTML sia caricato prima di eseguire lo script
document.addEventListener("DOMContentLoaded", () => {
    
    console.log("App JavaScript caricata!");

    // --- SELETTORI GLOBALI (per index.html) ---
    const descriptorListContainer = document.querySelector(".descriptor-list");
    const searchBar = document.querySelector('input[type="search"]');
    const filterButtons = document.querySelectorAll(".filter-btn");

    // Stato attuale dei filtri
    let currentCategory = "All";
    let currentSearchTerm = "";

    /**
     * Funzione per renderizzare la lista dei descrittori (index.html)
     * @param {Array} descriptors - L'array di descrittori da mostrare
     */
    function renderDescriptorList(descriptors) {
        if (!descriptorListContainer) return; // Non fare nulla se non siamo in index.html

        // Svuotiamo la lista prima di riempirla
        descriptorListContainer.innerHTML = "";
        
        // Se non ci sono risultati, mostra un messaggio
        if (descriptors.length === 0) {
            descriptorListContainer.innerHTML = "<p class='no-results'>Nessun descrittore trovato.</p>";
            return;
        }

        // Per ogni descrittore nel nostro DB...
        descriptors.forEach(descriptor => {
            // Controlliamo se ci sono dati utente per questo ID
            const userEntry = userData[descriptor.id];
            
            // Determiniamo il livello di confidenza da mostrare
            let confidenceLevel = "--";
            let confidenceData = "not-set";
            
            if (userEntry && userEntry.confidence) {
                confidenceLevel = userEntry.confidence;
                confidenceData = userEntry.confidence;
            }

            // Creiamo l'HTML per il singolo descrittore
            const itemHTML = `
                <a href="descriptor.html?id=${descriptor.id}" class="descriptor-item">
                    <div class="item-content">
                        <h2>${descriptor.name}</h2>
                        <p>${descriptor.category}</p>
                    </div>
                    <div class="item-confidence" data-level="${confidenceData}">
                        ${confidenceLevel}
                    </div>
                </a>
            `;
            
            // Aggiungiamo il nuovo HTML al contenitore
            descriptorListContainer.insertAdjacentHTML("beforeend", itemHTML);
        });
    }

    /**
     * Funzione che applica i filtri e la ricerca correnti
     */
    function applyFiltersAndSearch() {
        let filteredDb = db; // Inizia con il database completo

        // 1. Filtra per Categoria
        if (currentCategory !== "All") {
            filteredDb = filteredDb.filter(descriptor => 
                descriptor.category === currentCategory
            );
        }

        // 2. Filtra per Ricerca (sulla lista già filtrata)
        const searchTerm = currentSearchTerm.toLowerCase();
        if (searchTerm !== "") {
            filteredDb = filteredDb.filter(descriptor => 
                descriptor.name.toLowerCase().includes(searchTerm)
            );
        }

        // 3. Renderizza il risultato
        renderDescriptorList(filteredDb);
    }

    // --- LOGICA DI INIZIALIZZAZIONE (Solo per index.html) ---
    if (descriptorListContainer) {
        
        // NUOVO: Controlla se arriviamo da un link di categoria (es. ?filter=Fruity)
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFilter = urlParams.get('filter');

        if (categoryFilter) {
            currentCategory = categoryFilter; // Imposta il filtro
            
            // Aggiorna anche lo stile del pulsante filtro
            filterButtons.forEach(btn => {
                if (btn.textContent === categoryFilter) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
        
        // Applica filtri e ricerca all'avvio (ora con il filtro pre-impostato)
        applyFiltersAndSearch();

        // Aggiungi listener per la barra di ricerca
        searchBar.addEventListener("input", (event) => {
            currentSearchTerm = event.target.value;
            applyFiltersAndSearch(); // Ridisegna la lista ad ogni lettera digitata
        });

        // Aggiungi listeners per i bottoni filtro
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                // Aggiorna lo stato della categoria
                currentCategory = button.textContent; // Es. "Fruity", "All"
                
                // Aggiorna la UI dei bottoni (stile "active")
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                // Ridisegna la lista con il nuovo filtro
                applyFiltersAndSearch();
            });
        });
    }


    // --- LOGICA PER LA PAGINA DESCRIPTOR.HTML ---
    
    // Selezioniamo l'h1 della pagina di dettaglio
    const descriptorNameEl = document.getElementById("desc-name");

    // Questo blocco di codice viene eseguito SOLO se siamo in descriptor.html
    if (descriptorNameEl) {
        
        // 1. Leggi l'ID dall'URL
        const urlParams = new URLSearchParams(window.location.search);
        const descriptorId = parseInt(urlParams.get('id')); // "id" è il nome che abbiamo dato nel link (es. ?id=1)

        // 2. Trova i dati nel nostro "database"
        const descriptor = db.find(d => d.id === descriptorId);

        // 3. Trova i dati utente (da localStorage)
        const userEntry = userData[descriptorId] || {}; // Usa un oggetto vuoto se non c'è

        // 4. Popola la pagina
        if (descriptor) {
            // Popola Header e Titolo della pagina
            document.title = descriptor.name; // Aggiorna il titolo della scheda del browser
            descriptorNameEl.textContent = descriptor.name;

            // Popola le card
            document.getElementById("desc-translation").textContent = descriptor.translation;
            document.getElementById("desc-category").textContent = descriptor.category;
            document.getElementById("desc-description").textContent = descriptor.description;

            // Popola le fonti
            const sourcesListEl = document.getElementById("desc-sources");
            sourcesListEl.innerHTML = ""; // Pulisci prima
            if (descriptor.sources.length > 0) {
                descriptor.sources.forEach(source => {
                    sourcesListEl.innerHTML += `<li><a href="${source.url}" target="_blank">${source.name}</a></li>`;
                });
            } else {
                sourcesListEl.innerHTML = "<li>Nessuna fonte specificata.</li>";
            }

            // Popola i campi utente (Note e Slider)
            const notesTextarea = document.getElementById("desc-notes");
            notesTextarea.value = userEntry.notes || "";
            
            const slider = document.getElementById("desc-slider");
            const sliderValue = document.getElementById("desc-slider-value");
            const sliderLabel = document.getElementById("slider-label");
            
            if (userEntry.confidence) {
                slider.value = userEntry.confidence;
                sliderValue.textContent = userEntry.confidence;
                sliderLabel.textContent = "Your rating:";
            } else {
                // Valori di default se non ancora impostato
                slider.value = 1; 
                sliderValue.textContent = "1";
                sliderLabel.textContent = "Not yet set";
            }

            // --- LISTENER PER SALVARE I DATI ---

            // 1. Salva quando lo SLIDER viene mosso
            slider.addEventListener("input", (event) => {
                const newConfidence = parseInt(event.target.value);
                sliderValue.textContent = newConfidence;
                sliderLabel.textContent = "Your rating:";
                
                // Aggiorna l'oggetto 'userData'
                if (!userData[descriptorId]) userData[descriptorId] = {}; // Crea l'oggetto se non esiste
                userData[descriptorId].confidence = newConfidence;
                
                // Salva in localStorage
                saveUserData();
            });

            // 2. Salva quando l'utente SCRIVE NELLE NOTE
            notesTextarea.addEventListener("input", (event) => {
                const newNotes = event.target.value;
                
                // Aggiorna l'oggetto 'userData'
                if (!userData[descriptorId]) userData[descriptorId] = {};
                userData[descriptorId].notes = newNotes;
                
                // Salva in localStorage
                saveUserData();
            });

        } else {
            // Se l'ID non è valido o non trovato
            descriptorNameEl.textContent = "Errore";
            document.getElementById("desc-description").textContent = "Descrittore non trovato. Torna alla lista principale.";
        }
    }

    // --- LOGICA PER LA PAGINA CATEGORIES.HTML ---
    const categoryListContainer = document.querySelector(".category-list");

    if (categoryListContainer) {
        // 1. Estrai tutte le categorie uniche dal database
        const allCategories = db.map(descriptor => descriptor.category);
        const uniqueCategories = [...new Set(allCategories)]; // Rimuove i duplicati
        uniqueCategories.sort(); // Ordina alfabeticamente

        // 2. Popola la lista
        uniqueCategories.forEach(category => {
            const categoryHTML = `
                <a href="index.html?filter=${category}" class="category-item">
                    ${category}
                </a>
            `;
            categoryListContainer.insertAdjacentHTML("beforeend", categoryHTML);
        });
    }

    // --- LOGICA PER LA PAGINA SETTINGS.HTML ---
const appVersionEl = document.getElementById("app-version-info");

if (appVersionEl) { // Se siamo in settings.html

    // 1. Mostra la versione dell'app (da config.js)
    appVersionEl.textContent = `App Version: ${APP_VERSION}`;

    // 2. Mostra la versione del DB (da config.js)
    const dbVersionEl = document.getElementById("db-version-info");
    dbVersionEl.textContent = `Database Version: ${DB_VERSION}`;

    // 3. Controlla lo stato del Service Worker
    const cacheStatusEl = document.getElementById("cache-status-info");
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        // Se c'è un SW attivo, l'app è "cache-enabled"
        // Mostriamo la versione della cache (che è la stessa dell'app)
        cacheStatusEl.textContent = `Cache Status: Active (App v${APP_VERSION} / DB v${DB_VERSION})`;
    } else {
        cacheStatusEl.textContent = "Cache Status: Not Active (Online only)";
    }
}

    // --- LOGICA PER LA BARRA DI NAVIGAZIONE (TUTTE LE PAGINE) ---
    // Recupera il nome del file della pagina attuale
    const currentPage = window.location.pathname.split('/').pop() || "index.html"; 
    const navLinks = document.querySelectorAll("footer .nav-item");

    navLinks.forEach(link => {
        const linkHref = link.getAttribute("href");
        
        if (currentPage === linkHref) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

}); // Fine di DOMContentLoaded

// --- REGISTRAZIONE SERVICE WORKER (versione avanzata con popup) ---

if ('serviceWorker' in navigator) {
  
  // Funzione per mostrare il popup
  function showUpdatePopup(registration) {
    const popup = document.getElementById('update-popup');
    const button = document.getElementById('update-button');

    if (!popup || !button) {
        console.log('Elementi popup non trovati');
        return; // Esci se non siamo in una pagina con il popup
    }

    // Aggiungi l'azione al pulsante
    button.addEventListener('click', () => {
      // Dici al nuovo SW (in attesa) di attivarsi
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      popup.style.display = 'none'; // Nascondi il popup
    });

    // Mostra il popup
    popup.style.display = 'flex';
  }
  
  // Registra il Service Worker
  navigator.serviceWorker.register('sw.js')
    .then((reg) => {
      console.log('Service worker registrato.', reg);

      // 1. C'È GIÀ UN NUOVO WORKER IN ATTESA?
      // Questo accade se l'utente ha caricato la pagina 
      // mentre l'aggiornamento era già pronto.
      if (reg.waiting) {
        console.log('Trovato un SW in attesa. Mostro popup.');
        showUpdatePopup(reg);
        return; // Fatto
      }

      // 2. UN NUOVO WORKER VIENE TROVATO?
      // Questo listener rileva quando un *nuovo* SW 
      // viene scaricato in background.
      reg.addEventListener('updatefound', () => {
        console.log('Trovato aggiornamento. In attesa di installazione...');
        
        // Prendiamo il nuovo worker
        const newWorker = reg.installing;
        
        // Aspettiamo che finisca l'installazione
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Installazione completata! Ora è in stato 'waiting'.
            // È il momento di mostrare il popup.
            console.log('Nuovo SW installato e in attesa. Mostro popup.');
            showUpdatePopup(reg);
          }
        });
      });
    })
    .catch((err) => {
      console.error('Errore durante la registrazione del Service Worker:', err);
    });

  // 3. RICARICA LA PAGINA DOPO L'UPDATE
  // Quando il nuovo SW prende finalmente il controllo 
  // (dopo il click sul pulsante), ricarichiamo la pagina
  // per assicurarci che usi i nuovi file della cache v3.
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Controller cambiato! Ricarico la pagina.');
    window.location.reload();
  });
}