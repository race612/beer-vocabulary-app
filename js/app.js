// --- IMPOSTAZIONI GLOBALI APP ---
let appSettings = {};
const defaultSettings = {
    primaryLang: 'en',
    secondaryLang: 'it',
    showAllTranslations: false
};

/**
 * Carica le impostazioni da localStorage o usa i default
 */
function loadAppSettings() {
    const savedSettings = localStorage.getItem('beerAppSettings');
    appSettings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
}

/**
 * Salva le impostazioni correnti in localStorage
 */
function saveAppSettings() {
    localStorage.setItem('beerAppSettings', JSON.stringify(appSettings));
}

// Carica le impostazioni SUBITO, prima che la pagina si disegni
loadAppSettings();

/**
 * Funzione Globale per Tradurre la UI
 * Trova tutti gli elementi con [data-translate-key] e li traduce
 */
function translateUI() {
    const lang = appSettings.primaryLang;
    
    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.dataset.translateKey;
        if (uiStrings[key] && uiStrings[key][lang]) {
            el.textContent = uiStrings[key][lang];
        }
    });
    
    // Gestisce i placeholder
    document.querySelectorAll('[data-translate-key-placeholder]').forEach(el => {
        const key = el.dataset.translateKeyPlaceholder;
         if (uiStrings[key] && uiStrings[key][lang]) {
            el.placeholder = uiStrings[key][lang];
        }
    });

    // Gestione speciale per la label "Translation"
    const transLabel = document.getElementById("desc-translation-label");
    if (transLabel) {
        if (appSettings.secondaryLang !== 'none') {
            const otherLangKey = appSettings.secondaryLang === 'en' ? 'English' : 'Italiano';
            transLabel.textContent = `${uiStrings["descriptor_translation"][lang]} (${otherLangKey})`;
        }
    }
}


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
    
    // TRADUCI LA UI DINAMICAMENTE
    translateUI();

    // --- SELETTORI GLOBALI ---
    const descriptorListContainer = document.querySelector(".descriptor-list");
    const searchBar = document.querySelector('input[type="search"]');
    const filterContainer = document.querySelector(".filters-container");

    // Stato filtri
    let currentCategoryKey = "all";
    let currentSearchTerm = "";

    /**
     * Renderizza la lista descrittori (Home / Search)
     */
    function renderDescriptorList(descriptors) {
        if (!descriptorListContainer) return; 
        descriptorListContainer.innerHTML = "";
        
        const noResultsMessage = uiStrings["search_prompt"][appSettings.primaryLang] || "No descriptors found.";
        if (descriptors.length === 0) {
            descriptorListContainer.innerHTML = `<p class='no-results'>${noResultsMessage}</p>`;
            return;
        }

        descriptors.forEach(descriptor => {
            // Lingue
            const pLang = appSettings.primaryLang;
            const sLang = appSettings.secondaryLang;
            const showAll = appSettings.showAllTranslations;

            // Dati primari
            const name = descriptor.translations[pLang].name;
            const categoryName = categoryTranslations[descriptor.category_key][pLang];
            
            // Dati secondari (opzionali)
            let secondaryHTML = '';
            if (sLang !== 'none' && showAll) {
                const secondaryName = descriptor.translations[sLang].name;
                // Mostra anche la categoria secondaria
                const secondaryCategory = categoryTranslations[descriptor.category_key][sLang];
                secondaryHTML = `<p class="secondary-translation" style="margin-top: 0; margin-bottom: 5px;">${secondaryName} (${secondaryCategory})</p>`;
            }

            // Dati utente
            const userEntry = userData[descriptor.id];
            let confidenceLevel = "--";
            let confidenceData = "not-set";
            
            if (userEntry && userEntry.confidence) {
                confidenceLevel = userEntry.confidence;
                confidenceData = userEntry.confidence;
            }

            const itemHTML = `
                <a href="descriptor.html?id=${descriptor.id}" class="descriptor-item">
                    <div class="item-content">
                        <h2>${name}</h2>
                        <p style="margin-top: 5px;">${categoryName}</p>
                        ${secondaryHTML}
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
     * Applica filtri e ricerca
     */
    function applyFiltersAndSearch() {
        let filteredDb = db; 
        const pLang = appSettings.primaryLang;
        const sLang = appSettings.secondaryLang;

        if (currentCategoryKey !== "all") {
            filteredDb = filteredDb.filter(descriptor => 
                descriptor.category_key === currentCategoryKey
            );
        }

        const searchTerm = currentSearchTerm.toLowerCase();
        if (searchTerm !== "") {
            filteredDb = filteredDb.filter(descriptor => 
                descriptor.translations[pLang].name.toLowerCase().includes(searchTerm) ||
                (sLang !== 'none' && descriptor.translations[sLang].name.toLowerCase().includes(searchTerm))
            );
        }

        renderDescriptorList(filteredDb);
    }
    
    /**
     * Genera i pulsanti filtro
     */
    function renderFilterButtons() {
        if (!filterContainer) return;
        
        const pLang = appSettings.primaryLang;
        filterContainer.innerHTML = `<button class="filter-btn active" data-key="all">${uiStrings["search_all"][pLang]}</button>`;
        
        appCategories.forEach(category => {
            const translatedName = categoryTranslations[category.key][pLang];
            const buttonHTML = `<button class="filter-btn" data-key="${category.key}">${translatedName}</button>`;
            filterContainer.insertAdjacentHTML("beforeend", buttonHTML);
        });
        
        const filterButtons = document.querySelectorAll(".filter-btn");
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                currentCategoryKey = button.dataset.key;
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                applyFiltersAndSearch();
                
                const prompt = document.getElementById("search-prompt");
                if (prompt) {
                    prompt.style.display = 'none';
                }
            });
        });
    }

    // --- LOGICA HOME (index.html) ---
    if (descriptorListContainer && !searchBar) {
        applyFiltersAndSearch(); 
    }

    // --- LOGICA SEARCH (search.html) ---
    if (searchBar) {
        renderFilterButtons();
        
        searchBar.addEventListener("input", (event) => {
            currentSearchTerm = event.target.value;
            applyFiltersAndSearch();
            
            const prompt = document.getElementById("search-prompt");
            if (prompt) {
                prompt.style.display = (currentSearchTerm.length > 0 || currentCategoryKey !== 'all') ? 'none' : 'block';
            }
        });
    }

    // --- LOGICA DETTAGLIO (descriptor.html) ---
    const descriptorNameEl = document.getElementById("desc-name");
    if (descriptorNameEl) {
        
        const urlParams = new URLSearchParams(window.location.search);
        const descriptorId = parseInt(urlParams.get('id'));
        const descriptor = db.find(d => d.id === descriptorId);
        const userEntry = userData[descriptorId] || {}; 
        
        // Seleziona elementi UI
        const nameSecondaryEl = document.getElementById("desc-name-secondary");
        const categoryEl = document.getElementById("desc-category");
        const categorySecondaryEl = document.getElementById("desc-category-secondary");
        const translationCard = document.getElementById("translation-card");
        const translationEl = document.getElementById("desc-translation");
        const descriptionPrimaryEl = document.getElementById("desc-description-primary");
        const descriptionSecondaryEl = document.getElementById("desc-description-secondary");
        const descriptionToggleEl = document.getElementById("desc-description-toggle");
        const confidenceLabelEl = document.getElementById("slider-label");
        const notesTextarea = document.getElementById("desc-notes");

        if (descriptor) {
            const pLang = appSettings.primaryLang;
            const sLang = appSettings.secondaryLang;

            // Dati primari
            const pData = descriptor.translations[pLang];
            const pCategory = categoryTranslations[descriptor.category_key][pLang];
            let pSubcategory = "";
            if (descriptor.subcategory_key && categoryTranslations[descriptor.subcategory_key]) {
                pSubcategory = categoryTranslations[descriptor.subcategory_key][pLang];
            }

            // Dati secondari (se esistono)
            let sData, sCategory, sSubcategory;
            if (sLang !== 'none') {
                sData = descriptor.translations[sLang];
                sCategory = categoryTranslations[descriptor.category_key][sLang];
                if (descriptor.subcategory_key && categoryTranslations[descriptor.subcategory_key]) {
                    sSubcategory = categoryTranslations[descriptor.subcategory_key][sLang];
                }
            }

            // --- POPOLA UI ---
            
            // Titolo
            document.title = pData.name;
            descriptorNameEl.textContent = pData.name;
            
            // Categoria
            categoryEl.textContent = pSubcategory ? `${pCategory} > ${pSubcategory}` : pCategory;

            // Descrizione (mostra primaria di default)
            descriptionPrimaryEl.textContent = pData.description;

            // LOGICA SECONDARIA (come da tua richiesta)
            if (sLang !== 'none') {
                // Card Traduzione
                translationCard.style.display = "block";
                translationEl.textContent = sData.name;
                
                // Mostra traduzione secondaria per Titolo (sotto H1)
                nameSecondaryEl.textContent = sData.name;
                nameSecondaryEl.style.display = "block";
                
                // Mostra traduzione secondaria per Categoria
                const sCategoryString = sSubcategory ? `${sCategory} > ${sSubcategory}` : sCategory;
                categorySecondaryEl.textContent = sCategoryString;
                categorySecondaryEl.style.display = "block";
                
                // Attiva il Toggle Descrizione
                descriptionToggleEl.style.display = "block";
                descriptionSecondaryEl.textContent = sData.description; // Carica dati secondari
                let isShowingPrimary = true;
                
                descriptionToggleEl.addEventListener('click', () => {
                    isShowingPrimary = !isShowingPrimary;
                    descriptionPrimaryEl.style.display = isShowingPrimary ? 'block' : 'none';
                    descriptionSecondaryEl.style.display = isShowingPrimary ? 'none' : 'block';
                    
                    // Aggiorna testo del pulsante
                    const toggleKey = isShowingPrimary ? "descriptor_toggle_description" : (pLang === 'en' ? "Show Original (EN)" : "Mostra Originale (IT)");
                    // Aggiungiamo un fallback
                    descriptionToggleEl.textContent = uiStrings[toggleKey] ? uiStrings[toggleKey][pLang] : (isShowingPrimary ? "Show Translation" : "Show Original");
                });

            } else {
                // Nascondi tutti gli elementi secondari
                translationCard.style.display = "none";
                nameSecondaryEl.style.display = "none";
                categorySecondaryEl.style.display = "none";
                descriptionToggleEl.style.display = "none";
            }
            
            // Logica Note e Slider (con traduzione)
            const slider = document.getElementById("desc-slider");
            const sliderValue = document.getElementById("desc-slider-value");
            
            if (userEntry.confidence) {
                slider.value = userEntry.confidence;
                sliderValue.textContent = userEntry.confidence;
                confidenceLabelEl.textContent = uiStrings["descriptor_confidence_set"][pLang];
            } else {
                slider.value = 1; 
                sliderValue.textContent = "1";
                confidenceLabelEl.textContent = uiStrings["descriptor_confidence_not_set"][pLang];
            }
            
            slider.addEventListener("input", (event) => {
                const newConfidence = parseInt(event.target.value);
                sliderValue.textContent = newConfidence;
                confidenceLabelEl.textContent = uiStrings["descriptor_confidence_set"][pLang];
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
            descriptorNameEl.textContent = uiStrings["descriptor_error_title"][pLang];
            descriptionPrimaryEl.textContent = uiStrings["descriptor_error_text"][pLang];
        }
    }

    // --- LOGICA SETTINGS (settings.html) ---
    const primaryLangSelect = document.getElementById("primary-lang-select");
    const secondaryLangSelect = document.getElementById("secondary-lang-select");
    const showTranslationsToggle = document.getElementById("show-translations-toggle");

    if (primaryLangSelect) {
        // 1. Popola i controlli con i valori salvati
        primaryLangSelect.value = appSettings.primaryLang;
        secondaryLangSelect.value = appSettings.secondaryLang;
        showTranslationsToggle.checked = appSettings.showAllTranslations;
        
        // 2. Aggiungi listener per salvare e ricaricare
        function handleSettingChange() {
            appSettings.primaryLang = primaryLangSelect.value;
            appSettings.secondaryLang = secondaryLangSelect.value;
            appSettings.showAllTranslations = showTranslationsToggle.checked;
            
            // Validazione: non puoi avere la stessa lingua
            if (appSettings.primaryLang === appSettings.secondaryLang) {
                appSettings.secondaryLang = 'none';
                secondaryLangSelect.value = 'none';
            }
            
            saveAppSettings();
            // Ricarica la pagina per applicare le traduzioni ovunque
            window.location.reload();
        }
        
        primaryLangSelect.addEventListener('change', handleSettingChange);
        secondaryLangSelect.addEventListener('change', handleSettingChange);
        showTranslationsToggle.addEventListener('change', handleSettingChange);

        // 3. Popola i testi di App Info (con traduzione)
        const pLang = appSettings.primaryLang;
        document.getElementById("app-version-info").textContent = `${uiStrings["settings_app_version"][pLang]}: ${APP_VERSION}`;
        document.getElementById("db-version-info").textContent = `${uiStrings["settings_db_version"][pLang]}: ${DB_VERSION}`;
        const cacheStatusKey = ('serviceWorker' in navigator && navigator.serviceWorker.controller) ? "settings_cache_status_active" : "settings_cache_status_inactive";
        const cacheStatusText = uiStrings[cacheStatusKey][pLang] || cacheStatusKey;
        document.getElementById("cache-status-info").textContent = `${uiStrings["settings_cache_status"][pLang]}: ${cacheStatusText} (App v${APP_VERSION} / DB v${DB_VERSION})`;
    }

    // --- LOGICA NAV BAR (TUTTE LE PAGINE) ---
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


// --- REGISTRAZIONE SERVICE WORKER ---
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