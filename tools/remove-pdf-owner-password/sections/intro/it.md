Rimuovi le restrizioni della password proprietario da un PDF direttamente nel browser. Lo strumento crea un nuovo PDF che non contiene più i flag di autorizzazione per modifica, stampa, copia o estrazione delle pagine.

## Quando usarlo

Usalo quando hai già un PDF che si apre normalmente, ma il documento blocca azioni comuni come stampare, copiare testo, modificare pagine o assemblare pagine in un altro strumento PDF. Succede spesso con moduli, report esportati, vecchie fatture e documenti creati con impostazioni restrittive di autorizzazione PDF.

## Come funziona

Carica un PDF, controlla il file selezionato, poi esegui il passaggio di rimozione. Lo strumento esegue qpdf in un worker del browser con l'operazione `--decrypt` sul PDF e restituisce un nuovo file PDF da scaricare. Il file originale resta invariato, così puoi confrontare o eliminare l'output se non è la versione che ti serve.

## Privacy e limitazioni

Il PDF resta in questa sessione del browser; non viene caricato su un server. Questo strumento rimuove le restrizioni di autorizzazione da password proprietario dai PDF che possono già essere aperti. Non recupera una password utente/di apertura persa e non può sbloccare file danneggiati o modalità di crittografia non supportate dalla build di qpdf eseguita nel browser.
