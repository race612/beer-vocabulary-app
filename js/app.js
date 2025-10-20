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

// --- DATI UTENTE (Simulazione) ---
// In futuro, questi dati saranno salvati nel localStorage del browser.
// Per ora, usiamo un oggetto semplice per simulare che l'utente
// abbia già impostato un livello per alcuni descrittori.
const userData = {
    1: { confidence: 7, notes: "Molto evidente nelle Weizen" },
    3: { confidence: 9, notes: "Tipico delle Marzen/Oktoberfest" },
    4: { confidence: 5, notes: "Ancora difficile da isolare" }
};

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
    
    // Selezioniamo gli elementi della pagina di dettaglio
    const descriptorNameEl = document.getElementById("desc-name");

    // Controlliamo se siamo effettivamente nella pagina di dettaglio (cercando l'elemento h1)
    if (descriptorNameEl) {
        
        // 1. Leggi l'ID dall'URL
        const urlParams = new URLSearchParams(window.location.search);
        const descriptorId = parseInt(urlParams.get('id')); // "id" è il nome che abbiamo dato nel link (es. ?id=1)

        // 2. Trova i dati nel nostro "database"
        // usiamo .find() per cercare nell'array db l'oggetto con l'id giusto
        const descriptor = db.find(d => d.id === descriptorId);

        // 3. Trova i dati utente
        const userEntry = userData[descriptorId] || {}; // Usa un oggetto vuoto se non c'è

        // 4. Popola la pagina!
        if (descriptor) {
            // Popola Header e Titolo della pagina
            document.title = descriptor.name; // Aggiorna il titolo della scheda del browser
            descriptorNameEl.textContent = descriptor.name;

            // Popola le card
            document.getElementById("desc-translation").textContent = descriptor.translation;
            document.getElementById("desc-category").textContent = descriptor.category;
            document.getElementById("desc-description").textContent = descriptor.description;

            // Popola le fonti (creando <li> dinamicamente)
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
            document.getElementById("desc-notes").value = userEntry.notes || "";
            
            const slider = document.getElementById("desc-slider");
            const sliderValue = document.getElementById("desc-slider-value");
            const sliderLabel = document.getElementById("slider-label");
            
            if (userEntry.confidence) {
                slider.value = userEntry.confidence;
                sliderValue.textContent = userEntry.confidence;
                sliderLabel.textContent = "Your rating:"; // Etichetta se impostato
            } else {
                // Valori di default se non ancora impostato
                slider.value = 1; 
                sliderValue.textContent = "1";
                sliderLabel.textContent = "Not yet set";
            }

            // Aggiungi l'evento allo slider (come prima, ma usando i nuovi selettori)
            slider.addEventListener("input", (event) => {
                sliderValue.textContent = event.target.value;
                sliderLabel.textContent = "Your rating:"; // Cambia l'etichetta
            });

        } else {
            // Se l'ID non è valido o non trovato
            descriptorNameEl.textContent = "Errore";
            document.getElementById("desc-description").textContent = "Descrittore non trovato. Torna alla lista principale.";
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