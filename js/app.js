// Aggiungiamo un "listener" che aspetta il caricamento completo della pagina
document.addEventListener("DOMContentLoaded", () => {
    
    console.log("App JavaScript caricata!"); // Messaggio per noi, visibile nella console del browser

    // --- LOGICA PER LA PAGINA DESCRIPTOR.HTML ---
    
    // Selezioniamo gli elementi dello slider solo se siamo nella pagina giusta
    const slider = document.querySelector(".slider");
    const sliderValue = document.querySelector(".slider-value");

    // Controlliamo se lo slider esiste in questa pagina
    if (slider && sliderValue) {
        
        // Impostiamo il valore iniziale del testo (es. "5") uguale a quello dello slider
        sliderValue.textContent = slider.value;

        // Aggiungiamo un evento: ogni volta che l'utente MUOVE lo slider...
        slider.addEventListener("input", (event) => {
            // ...aggiorniamo il testo con il nuovo valore
            sliderValue.textContent = event.target.value;
        });
    }


    // --- LOGICA PER LA BARRA DI NAVIGAZIONE (TUTTE LE PAGINE) ---

    // Recuperiamo il percorso della pagina attuale (es. "/index.html")
    const currentPage = window.location.pathname;

    // Selezioniamo tutti i link nella barra di navigazione
    const navLinks = document.querySelectorAll("footer .nav-item");

    // Iteriamo su ogni link
    navLinks.forEach(link => {
        // "href" è l'attributo che dice al link dove puntare
        const linkHref = link.getAttribute("href");
        
        // Controlliamo se il link punta alla pagina in cui ci troviamo
        // Usiamo .includes() per far funzionare sia "index.html" che "/"
        if (currentPage.includes(linkHref)) {
            // Se sì, aggiungiamo la classe "active"
            link.classList.add("active");
        } else {
            // Altrimenti, ci assicuriamo che non ce l'abbia
            link.classList.remove("active");
        }
    });

});