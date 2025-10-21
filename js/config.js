// --- VERSIONE GLOBALE APP ---
// Incrementata per la nuova struttura dati i18n
const APP_VERSION = "0.1.5"; 

// --- VERSIONE DATABASE DESCRITTORI ---
// Incrementata per la nuova struttura dati i18n
const DB_VERSION = "0.0.5"; 

// --- DIZIONARIO TRADUZIONI CATEGORIE ---
// Questa è la nostra "fonte di verità" per i nomi
const categoryTranslations = {
    // Categorie
    "fruity": { en: "Fruity", it: "Fruttato" },
    "spicy": { en: "Spicy", it: "Speziato" },
    "malty": { en: "Malty", it: "Maltato" },
    "hoppy": { en: "Hoppy", it: "Luppolato" },
    "off-flavor": { en: "Off-Flavor", it: "Difetto" },
    
    // Sottocategorie
    "estery": { en: "Estery", it: "Estereo" },
    "phenolic": { en: "Phenolic", it: "Fenolico" },
    "toasted": { en: "Toasted", it: "Tostato" },
    "citrus": { en: "Citrus", it: "Agrumato" },
    "caramelized": { en: "Caramelized", it: "Caramellato" },
    "fermentation": { en: "Fermentation", it: "Fermentazione" },
    "tropical_fruit": { en: "Tropical Fruit", it: "Frutta Tropicale" }
};

// --- STRUTTURA CATEGORIE PER FORM ---
// Usata per popolare i menu a tendina (usa le chiavi)
const appCategories = [
    { 
        key: "fruity", 
        subcategories: ["tropical_fruit", "citrus"] 
    },
    { key: "spicy", subcategories: [] },
    { key: "malty", subcategories: [] },
    { key: "hoppy", subcategories: [] },
    { key: "off-flavor", subcategories: [] }
];

// --- DATABASE DEI DESCRITTORI (AGGIORNATO) ---
// Ora usa 'category_key' e 'subcategory_key'
const db = [
    {
        id: 1,
        category_key: "fruity",
        subcategory_key: "estery",
        translations: {
            en: { name: "Banana", description: "Aroma of ester (isoamyl acetate) reminiscent of ripe bananas." },
            it: { name: "Banana", description: "Aroma di estere (acetato di isoamile) che ricorda le banane mature." }
        },
        sources: [ { name: "BJCP", url: "https://www.bjcp.org/" } ]
    },
    {
        id: 2,
        category_key: "spicy",
        subcategory_key: "phenolic",
        translations: {
            en: { name: "Clove", description: "A phenolic compound (4-vinyl guaiacol) reminiscent of cloves." },
            it: { name: "Chiodo di Garofano", description: "Composto fenolico (4-vinil guaiacolo) che ricorda i chiodi di garofano." }
        },
        sources: [ { name: "The Beer Aroma Wheel", url: "#" } ]
    },
    {
        id: 3,
        category_key: "malty",
        subcategory_key: "toasted",
        translations: {
            en: { name: "Bread Crust", description: "Rich aroma, derived from kilned malts, reminiscent of freshly baked bread crust." },
            it: { name: "Crosta di Pane", description: "Aroma ricco, derivato dai malti tostati, che ricorda la crosta del pane appena sfornato." }
        },
        sources: []
    },
    {
        id: 4,
        category_key: "hoppy",
        subcategory_key: "citrus",
        translations: {
            en: { name: "Grapefruit", description: "A citrusy and resinous note typical of many American hops." },
            it: { name: "Pompelmo", description: "Nota agrumata e resinosa tipica di molti luppoli americani." }
        },
        sources: []
    },
    {
        id: 5,
        category_key: "malty",
        subcategory_key: "caramelized",
        translations: {
            en: { name: "Caramel", description: "Sweet, rich aroma that can range from toffee to burnt sugar." },
            it: { name: "Caramello", description: "Aroma dolce e ricco che può variare da caramella mou a zucchero bruciato." }
        },
        sources: []
    },
    {
        id: 6,
        category_key: "off-flavor",
        subcategory_key: "fermentation",
        translations: {
            en: { name: "Diacetyl", description: "Aroma and flavor of butter, butterscotch, or soured milk." },
            it: { name: "Diacetile", description: "Aroma e sapore di burro, caramella mou (butterscotch) o latte inacidito." }
        },
        sources: [ { name: "BJCP Off-Flavor List", url: "https://www.bjcp.org/" } ]
    }
];