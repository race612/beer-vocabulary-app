// --- IMPOSTAZIONE LINGUA ---
// Come da tua richiesta, l'interfaccia di default è Inglese
const INTERFACE_LANG = 'en';
const SECONDARY_LANG = 'it';
// ------------------------------


// --- GESTIONE DATI UTENTE (localStorage) ---
function loadUserData() {
    const data = localStorage.getItem("beerUserData");
    return data ? JSON.parse(data) : {};
}
function saveUserData() {
    localStorage.setItem("beerUserData", JSON.stringify(userData));
    console.log("Dati utente salvati.");
}
let userData = loadUserData();


// --- EVENT LISTENER PRINCIPALE ---
document.addEventListener("DOMContentLoaded", () => {
    
    console.log("App JavaScript caricata!");

    // --- SELETTORI GLOBALI (per index.html) ---
    const descriptorListContainer = document.querySelector(".descriptor-list");
    const searchBar = document.querySelector('input[type="search"]');
    const filterContainer = document.querySelector(".filters-container"); // Aggiornato

    // Stato attuale dei filtri
    let currentCategoryKey = "all"; // Ora usiamo la chiave
    let currentSearchTerm = "";
    let currentSubcategoryKey = ""; // Non ancora usato, ma pronto

    /**
     * Funzione per renderizzare la lista dei descrittori (index.html)
     */
    function renderDescriptorList(descriptors) {
        if (!descriptorListContainer) return; 
        descriptorListContainer.innerHTML = "";
        
        if (descriptors.length === 0) {
            descriptorListContainer.innerHTML = "<p class='no-results'>Nessun descrittore trovato.</p>";
            return;
        }

        descriptors.forEach(descriptor => {
            const userEntry = userData[descriptor.id];
            
            let confidenceLevel = "--";
            let confidenceData = "not-set";
            
            if (userEntry && userEntry.confidence) {
                confidenceLevel = userEntry.confidence;
                confidenceData = userEntry.confidence;
            }

            // --- Logica Traduzione ---
            const name = descriptor.translations[INTERFACE_LANG].name;
            const categoryName = categoryTranslations[descriptor.category_key][INTERFACE_LANG];
            // --- Fine ---

            const itemHTML = `
                <a href="descriptor.html?id=${descriptor.id}" class="descriptor-item">
                    <div class="item-content">
                        <h2>${name}</h2>
                        <p>${categoryName}</p>
                    </div>
                    <div class="item-confidence" data-level="${confidenceData}">
                        ${confidenceLevel}
                    </div>
                </a>
            `;
            descriptorListContainer.insertAdjacentHTML("beforeend", itemHTML);
        });
    }

    /**
     * Funzione che applica i filtri e la ricerca correnti
     */
    function applyFiltersAndSearch() {
        let filteredDb = db; 

        // 1. Filtra per Categoria (ora usa la chiave)
        if (currentCategoryKey !== "all") {
            filteredDb = filteredDb.filter(descriptor => 
                descriptor.category_key === currentCategoryKey
            );
        }

        // 2. Filtra per Ricerca
        const searchTerm = currentSearchTerm.toLowerCase();
        if (searchTerm !== "") {
            filteredDb = filteredDb.filter(descriptor => 
                descriptor.translations[INTERFACE_LANG].name.toLowerCase().includes(searchTerm) ||
                descriptor.translations[SECONDARY_LANG].name.toLowerCase().includes(searchTerm)
            );
        }

        renderDescriptorList(filteredDb);
    }
    
    
    // NUOVA FUNZIONE: Genera i pulsanti filtro (Ora per la pagina Search)
    function renderFilterButtons() {
        if (!filterContainer) return;
        
        // 1. Pulsante "All"
        filterContainer.innerHTML = '<button class="filter-btn active" data-key="all">All</button>';
        
        // 2. Pulsanti dinamici
        appCategories.forEach(category => {
            const translatedName = categoryTranslations[category.key][INTERFACE_LANG];
            const buttonHTML = `<button class="filter-btn" data-key="${category.key}">${translatedName}</button>`;
            filterContainer.insertAdjacentHTML("beforeend", buttonHTML);
        });
        
        // 3. Aggiungi i listener
        const filterButtons = document.querySelectorAll(".filter-btn");
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                currentCategoryKey = button.dataset.key; // Legge la chiave (es. "fruity")
                
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                applyFiltersAndSearch();
                
                // Nascondi/mostra il messaggio di default
                const prompt = document.getElementById("search-prompt");
                if (prompt) {
                    prompt.style.display = (currentSearchTerm.length > 0 || currentCategoryKey !== 'all') ? 'none' : 'block';
                }
            });
        });
    }

    // --- LOGICA DI INIZIALIZZAZIONE (Solo per index.html) ---
    // Questo blocco ora si attiva solo se trova la lista MA NON la barra di ricerca
    if (descriptorListContainer && !searchBar) {
        
        // La Home Page ora mostra semplicemente TUTTI i descrittori
        applyFiltersAndSearch(); 
    }

    // --- NUOVA LOGICA (Solo per search.html) ---
    // Questo blocco si attiva solo se trova la barra di ricerca
    if (searchBar) {
        
        // 1. Crea i pulsanti filtro
        renderFilterButtons();
        
        // 2. Aggiungi listener per la barra di ricerca
        searchBar.addEventListener("input", (event) => {
            currentSearchTerm = event.target.value;
            applyFiltersAndSearch(); // Ridisegna la lista ad ogni lettera digitata
            
            // Nascondi/mostra il messaggio di default
            const prompt = document.getElementById("search-prompt");
            if (prompt) {
                prompt.style.display = (currentSearchTerm.length > 0 || currentCategoryKey !== 'all') ? 'none' : 'block';
            }
        });
        
        // 3. Modifica i listener dei filtri per la pagina di ricerca
        // (Dobbiamo ridefinire 'renderFilterButtons' per includere questa logica)
    }

    // --- LOGICA PER LA PAGINA DESCRIPTOR.HTML ---
    const descriptorNameEl = document.getElementById("desc-name");

    if (descriptorNameEl) {
        
        const urlParams = new URLSearchParams(window.location.search);
        const descriptorId = parseInt(urlParams.get('id'));
        const descriptor = db.find(d => d.id === descriptorId);
        const userEntry = userData[descriptorId] || {}; 

        if (descriptor) {
            // --- Logica Traduzione ---
            const main = descriptor.translations[INTERFACE_LANG];
            const secondary = descriptor.translations[SECONDARY_LANG];
            
            // 1. Traduci la Categoria Principale
            const categoryName = categoryTranslations[descriptor.category_key][INTERFACE_LANG];
            
            // 2. Cerca e Traduci la Sottocategoria (se esiste)
            let subcategoryName = "";
            if (descriptor.subcategory_key && categoryTranslations[descriptor.subcategory_key]) {
                subcategoryName = categoryTranslations[descriptor.subcategory_key][INTERFACE_LANG];
            }
            
            // 3. Crea la stringa di visualizzazione finale
            let categoryDisplayString = categoryName; // Default
            if (subcategoryName) {
                categoryDisplayString = `${categoryName} > ${subcategoryName}`;
            }
            // --- Fine Logica Traduzione ---

            // Popola Header e Titolo
            document.title = main.name;
            descriptorNameEl.textContent = main.name;
            
            // Popola le card
            document.getElementById("desc-translation").textContent = secondary.name;
            document.getElementById("desc-category").textContent = categoryDisplayString; // <-- USA LA STRINGA COMBINATA
            document.getElementById("desc-description").textContent = main.description;

            // Logica Fonti (come prima)
            const sourcesListEl = document.getElementById("desc-sources");
            sourcesListEl.innerHTML = "";
            if (descriptor.sources.length > 0) {
                descriptor.sources.forEach(source => {
                    sourcesListEl.innerHTML += `<li><a href="${source.url}" target="_blank">${source.name}</a></li>`;
                });
            } else {
                sourcesListEl.innerHTML = "<li>Nessuna fonte specificata.</li>";
            }
            
            // Logica Note e Slider (invariata, gestisce solo i dati utente)
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
                slider.value = 1; 
                sliderValue.textContent = "1";
                sliderLabel.textContent = "Not yet set";
            }
            
            slider.addEventListener("input", (event) => {
                const newConfidence = parseInt(event.target.value);
                sliderValue.textContent = newConfidence;
                sliderLabel.textContent = "Your rating:";
                if (!userData[descriptorId]) userData[descriptorId] = {};
                userData[descriptorId].confidence = newConfidence;
                saveUserData();
            });
            notesTextarea.addEventListener("input", (event) => {
                const newNotes = event.target.value;
                if (!userData[descriptorId]) userData[descriptorId] = {};
                userData[descriptorId].notes = newNotes;
                saveUserData();
            });

        } else {
            descriptorNameEl.textContent = "Errore";
            document.getElementById("desc-description").textContent = "Descrittore non trovato.";
        }
    }

    // --- LOGICA PER LA PAGINA CATEGORIES.HTML ---
    // (Questa logica è stata messa in pausa, la riprenderemo)


    // --- LOGICA PER LA PAGINA SETTINGS.HTML ---
    const appVersionEl = document.getElementById("app-version-info");
    if (appVersionEl) {
        appVersionEl.textContent = `App Version: ${APP_VERSION}`;
        const dbVersionEl = document.getElementById("db-version-info");
        dbVersionEl.textContent = `Database Version: ${DB_VERSION}`;
        const cacheStatusEl = document.getElementById("cache-status-info");
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            cacheStatusEl.textContent = `Cache Status: Active (App v${APP_VERSION} / DB v${DB_VERSION})`;
        } else {
            cacheStatusEl.textContent = "Cache Status: Not Active (Online only)";
        }
    }

    // --- LOGICA PER LA BARRA DI NAVIGAZIONE (TUTTE LE PAGINE) ---
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
// (Questo blocco resta invariato)
if ('serviceWorker' in navigator) {
  function showUpdatePopup(registration) {
    const popup = document.getElementById('update-popup');
    const button = document.getElementById('update-button');
    if (!popup || !button) return; 
    button.addEventListener('click', () => {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      popup.style.display = 'none';
    });
    popup.style.display = 'flex';
  }
  
  navigator.serviceWorker.register('sw.js')
    .then((reg) => {
      console.log('Service worker registrato.', reg);
      if (reg.waiting) {
        console.log('Trovato un SW in attesa. Mostro popup.');
        showUpdatePopup(reg);
        return;
      }
      reg.addEventListener('updatefound', () => {
        console.log('Trovato aggiornamento. In attesa di installazione...');
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('Nuovo SW installato e in attesa. Mostro popup.');
            showUpdatePopup(reg);
          }
        });
      });
    })
    .catch((err) => {
      console.error('Errore durante la registrazione del Service Worker:', err);
    });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Controller cambiato! Ricarico la pagina.');
    window.location.reload();
  });
}