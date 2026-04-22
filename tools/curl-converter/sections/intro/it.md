## Che cos'è un convertitore cURL?

Un convertitore cURL trasforma un comando cURL in codice pronto all'uso per molti linguaggi e client HTTP. È utile quando la documentazione di un'API, gli strumenti sviluppatore del browser o la cronologia del terminale ti danno una richiesta già funzionante e vuoi portarla nel codice dell'app senza ricostruire a mano metodo, URL, header, cookie o body.

**Crediti**
Basato su [curlconverter](https://curlconverter.com) di Nick Carneiro.

## Quando questo strumento è utile

- Parti da un esempio cURL già funzionante nella documentazione API o nella cronologia del terminale.
- Vuoi confrontare la stessa richiesta tra `fetch`, Python `requests`, Go, Java, PHP e altri target prima di scegliere.
- Vuoi generare rapidamente una base e poi aggiungere la gestione errori, i retry, il refresh dell'autenticazione e la configurazione del tuo progetto.

## Cosa controllare dopo la conversione

- Assicurati che il target selezionato corrisponda davvero alla libreria HTTP e al runtime usati dal tuo progetto.
- Leggi con attenzione gli avvisi. Alcune regole di quoting della shell, variabili d'ambiente o flag cURL non supportati possono richiedere correzioni manuali.
- Sostituisci token segnaposto, segreti o URL di esempio prima di salvare il codice generato.
