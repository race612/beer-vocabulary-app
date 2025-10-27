// --- VERSIONE GLOBALE APP ---
// Incrementata per la nuova struttura dati i18n
const APP_VERSION = "0.1.81"; 

// --- VERSIONE DATABASE DESCRITTORI ---
// Incrementata per la nuova struttura dati i18n
const DB_VERSION = "0.0.6"; 

// --- DIZIONARIO TRADUZIONI UI ---
const uiStrings = {
    // Navigazione
    "nav_descriptors": { en: "Descriptors", it: "Descrittori" },
    "nav_categories": { en: "Categories", it: "Categorie" },
    "nav_settings": { en: "Settings", it: "Impostazioni" },

    // Home
    "home_title": { en: "Beer Descriptors", it: "Descrittori Birra" },

    // Categorie
    "categories_title": { en: "Categories", it: "Categorie" },

    // Search
    "search_title": { en: "Search", it: "Cerca" },
    "search_placeholder": { en: "Type to search...", it: "Scrivi per cercare..." },
    "search_prompt": { en: "Start typing to find descriptors.", it: "Inizia a scrivere per trovare i descrittori." },
    "search_all": { en: "All", it: "Tutti" },

    // Dettaglio
    "descriptor_translation": { en: "Translation", it: "Traduzione" },
    "descriptor_category": { en: "Category", it: "Categoria" },
    "descriptor_description": { en: "Description", it: "Descrizione" },
    "descriptor_sources": { en: "Sources & Documents", it: "Fonti e Documenti" },
    "descriptor_confidence": { en: "My Confidence Level", it: "Mio Livello di Confidenza" },
    "descriptor_confidence_not_set": { en: "Not yet set", it: "Non ancora impostato" },
    "descriptor_confidence_set": { en: "Your rating:", it: "Tua valutazione:" },
    "descriptor_notes": { en: "My Personal Notes", it: "Miei Appunti Personali" },
    "descriptor_notes_placeholder": { en: "Write your personal notes here...", it: "Scrivi qui i tuoi appunti..." },
    "descriptor_toggle_description": { en: "Show translation", it: "Mostra traduzione" },
    "descriptor_error_title": { en: "Error", it: "Errore" },
    "descriptor_error_text": { en: "Descriptor not found. Please go back.", it: "Descrittore non trovato. Per favore torna indietro." },

    // Settings
    "settings_title": { en: "Settings", it: "Impostazioni" },
    "settings_language_title": { en: "Language Settings", it: "Impostazioni Lingua" },
    "settings_primary_lang": { en: "Primary Language", it: "Lingua Principale" },
    "settings_secondary_lang": { en: "Secondary Language", it: "Lingua Secondaria" },
    "settings_secondary_lang_none": { en: "None", it: "Nessuna" },
    "settings_show_translations_label": { en: "Show translations everywhere", it: "Mostra traduzioni ovunque" },
    "settings_info_title": { en: "App Info", it: "Info App" },
    "settings_app_version": { en: "App Version", it: "Versione App" },
    "settings_db_version": { en: "Database Version", it: "Versione Database" },
    "settings_cache_status": { en: "Cache Status", it: "Stato Cache" },
    "settings_cache_status_active": { en: "Active", it: "Attiva" },
    "settings_cache_status_inactive": { en: "Not Active (Online only)", it: "Non Attiva (Solo online)" }
};

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