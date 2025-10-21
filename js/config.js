// --- VERSIONE GLOBALE APP ---
// Logica dell'app, file HTML/CSS/JS
const APP_VERSION = "0.1.0";

// --- VERSIONE DATABASE DESCRITTORI ---
// Dati nel 'db' array
const DB_VERSION = "0.0.1";

// --- DATABASE DEI DESCRITTORI ---
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