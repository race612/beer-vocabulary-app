// --- DATABASE DEI DESCRITTORI ---
// In futuro, questo potrà essere caricato da un file JSON.
// Per ora, lo teniamo qui per semplicità.

const db = [
    {
        id: 1,
        name: "Banana",
        category: "Fruity",
        translation: "Banana",
        description: "Aroma di estere (acetato di isoamile) che ricorda le banane mature. Tipico di molte birre Weissbier bavaresi.",
        sources: [
            { name: "BJCP", url: "https://www.bjcp.org/" }
        ]
    },
    {
        id: 2,
        name: "Clove",
        category: "Spicy",
        translation: "Chiodo di Garofano",
        description: "Composto fenolico (4-vinil guaiacolo) che ricorda i chiodi di garofano. Caratteristica tipica di alcuni ceppi di lievito (es. Weizen).",
        sources: [
            { name: "The Beer Aroma Wheel", url: "#" }
        ]
    },
    {
        id: 3,
        name: "Bread Crust",
        category: "Malty",
        translation: "Crosta di Pane",
        description: "Aroma ricco, derivato dai malti tostati (es. Monaco, Vienna) che ricorda la crosta del pane appena sfornato.",
        sources: []
    },
    {
        id: 4,
        name: "Grapefruit",
        category: "Hoppy",
        translation: "Pompelmo",
        description: "Nota agrumata e resinosa tipica di molti luppoli americani (es. Cascade, Centennial), spesso dovuta a composti come il mircene.",
        sources: []
    },
    {
        id: 5,
        name: "Caramel",
        category: "Malty",
        translation: "Caramello",
        description: "Aroma dolce e ricco che può variare da caramella mou a zucchero bruciato, derivato da malti speciali caramellati.",
        sources: []
    }
];

// --- GESTIONE DATI UTENTE (localStorage) ---

/**
 * Carica i dati utente salvati in localStorage
 */
function loadUserData() {
    const data = localStorage.getItem("beerUserData"); // "beerUserData" è la chiave della nostra "scatola"
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
// NOTA: ora è 'let', non 'const', perché lo modificheremo.
let userData = loadUserData();

document.addEventListener("DOMContentLoaded", () => {
    
    console.log("App JavaScript caricata!");

    // --- SELETTORI DEGLI ELEMENTI (index.html) ---
    const descriptorListContainer = document.querySelector(".descriptor-list");
    const searchBar = document.querySelector('input[type="search"]');
    const filterButtons = document.querySelectorAll(".filter-btn");

    // --- STATO ATTUALE DEI FILTRI ---
    let currentCategory = "All";
    let currentSearchTerm = "";

    /**
     * Funzione per renderizzare la lista dei descrittori
     * @param {Array} descriptors - L'array di descrittori da mostrare
     */
    function renderDescriptorList(descriptors) {
        // Svuotiamo la lista prima di riempirla
        descriptorListContainer.innerHTML = "";
        
        // Se non ci sono risultati, mostra un messaggio
        if (descriptors.length === 0) {
            descriptorListContainer.innerHTML = "<p class='no-results'>Nessun descrittore trovato.</p>";
            return;
        }

        // Per ogni descrittore nel nostro DB...
        descriptors.forEach(descriptor => {
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
                        <h2>${descriptor.name}</h2>
                        <p>${descriptor.category}</p>
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
     * NUOVA FUNZIONE: Applica i filtri e la ricerca correnti
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

    // --- LOGICA DI INIZIALIZZAZIONE (index.html) ---
    if (descriptorListContainer) {
        // Applica filtri e ricerca all'avvio (mostra tutto)
        applyFiltersAndSearch(); 

        // NUOVO: Aggiungi listener per la barra di ricerca
        searchBar.addEventListener("input", (event) => {
            currentSearchTerm = event.target.value;
            applyFiltersAndSearch(); // Ridisegna la lista ad ogni lettera digitata
        });

        // NUOVO: Aggiungi listeners per i bottoni filtro
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
    
    const descriptorNameEl = document.getElementById("desc-name");

    if (descriptorNameEl) {
        
        // 1. Leggi l'ID dall'URL
        const urlParams = new URLSearchParams(window.location.search);
        const descriptorId = parseInt(urlParams.get('id'));

        // 2. Trova i dati del descrittore
        const descriptor = db.find(d => d.id === descriptorId);

        // 3. Trova i dati utente (ora caricati da localStorage)
        const userEntry = userData[descriptorId] || {}; 

        // 4. Popola la pagina
        if (descriptor) {
            document.title = descriptor.name;
            descriptorNameEl.textContent = descriptor.name;
            document.getElementById("desc-translation").textContent = descriptor.translation;
            document.getElementById("desc-category").textContent = descriptor.category;
            document.getElementById("desc-description").textContent = descriptor.description;

            const sourcesListEl = document.getElementById("desc-sources");
            sourcesListEl.innerHTML = "";
            if (descriptor.sources.length > 0) {
                descriptor.sources.forEach(source => {
                    sourcesListEl.innerHTML += `<li><a href="${source.url}" target="_blank">${source.name}</a></li>`;
                });
            } else {
                sourcesListEl.innerHTML = "<li>Nessuna fonte specificata.</li>";
            }

            // Popola i campi utente
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

            // --- NUOVO: LISTENER PER SALVARE I DATI ---

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
            // ... (codice di errore invariato) ...
        }
    }
    
    // --- LOGICA PER LA BARRA DI NAVIGAZIONE (INVARIATA) ---
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
});

    // --- REGISTRAZIONE SERVICE WORKER ---
    // Questo codice viene eseguito all'avvio

    if ('serviceWorker' in navigator) {
    // Aspetta che la pagina sia completamente caricata
    window.addEventListener('load', ()_ => {
        // Registra il nostro file sw.js
        navigator.serviceWorker.register('sw.js')
        .then((reg) => {
            console.log('Service worker registrato con successo.', reg);
        })
        .catch((err) => {
            console.error('Errore durante la registrazione del Service Worker:', err);
        });
    });
    }