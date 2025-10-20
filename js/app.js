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

    // Seleziona il contenitore della lista
    const descriptorListContainer = document.querySelector(".descriptor-list");

    // --- LOGICA PER GENERARE LA LISTA IN INDEX.HTML ---
    if (descriptorListContainer) {
        // Chiamiamo una funzione per "disegnare" la lista
        renderDescriptorList(db);
    }

    /**
     * Funzione per renderizzare la lista dei descrittori
     * @param {Array} descriptors - L'array di descrittori da mostrare
     */
    function renderDescriptorList(descriptors) {
        // Svuotiamo la lista prima di riempirla
        descriptorListContainer.innerHTML = "";
        
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
            // NOTA: Per ora, tutti i link puntano a descriptor.html.
            // In futuro, passeremo l'ID (es. descriptor.html?id=2)
            const itemHTML = `
                <a href="descriptor.html" class="descriptor-item">
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


    // --- LOGICA PER LA PAGINA DESCRIPTOR.HTML ---
    const slider = document.querySelector(".slider");
    const sliderValue = document.querySelector(".slider-value");

    if (slider && sliderValue) {
        sliderValue.textContent = slider.value;
        slider.addEventListener("input", (event) => {
            sliderValue.textContent = event.target.value;
        });
    }

    // --- LOGICA PER LA BARRA DI NAVIGAZIONE (TUTTE LE PAGINE) ---
    const currentPage = window.location.pathname.split('/').pop() || "index.html"; // Gestisce sia "/" che "/index.html"
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