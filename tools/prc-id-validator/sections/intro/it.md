## Che cos’è un ID residente della RPC?

Il numero ID residente della RPC è composto da 18 caratteri e include codice dell’indirizzo, data di nascita, codice di sequenza e cifra di controllo. Questo validatore verifica queste parti offline e aiuta a capire come è strutturato il numero.

### Come funziona la validazione

- Rimuove spazi e trattini e normalizza l’ultimo carattere in `X` maiuscola
- Richiede esattamente 18 caratteri: 17 cifre più una cifra finale oppure `X`
- Confronta le prime 6 cifre con il dataset delle divisioni amministrative 2023 e analizza la data di nascita di 8 cifre
- Ricalcola la cifra di controllo dai primi 17 caratteri e la confronta con l’ultimo carattere

### Cosa mostra il risultato

- Dettaglio della regione: provincia, città, distretto/contea e codice regione originale
- Data di nascita, età attuale, codice di sequenza e genere derivato dal codice di sequenza
- ID normalizzato insieme alla cifra di controllo attesa e a quella effettiva per il debug

### Esempio

`110101199001010015` può essere letto così:

- `110101` -> distretto di Dongcheng, Pechino
- `19900101` -> data di nascita `1990-01-01`
- `001` -> codice di sequenza
- `5` -> cifra di controllo

### Nota importante

Questo strumento esegue solo una validazione strutturale e del checksum offline. Un numero che supera questi controlli non dimostra che corrisponda a un’identità reale o a un documento ancora attivo.

I nomi delle regioni si basano sul dataset delle divisioni amministrative del 2023.
