UUID v7 è un formato UUID moderno che posiziona un timestamp Unix in millisecondi all'inizio dell'identificatore e riempie i bit rimanenti con casualità. In questo modo i valori sono, in pratica, univoci a livello globale e rimangono naturalmente ordinabili per momento di creazione.

## Cosa fa questo strumento

Questo generatore crea valori UUID v7 interamente nel browser. Puoi generare un singolo identificatore o un lotto fino a 100, quindi copiare l'elenco o scaricarlo come file di testo per dati iniziali, record di database, fixture di eventi o payload di test.

## Quando UUID v7 è utile

UUID v7 è utile quando vuoi identificatori opachi che si ordinino comunque bene in database, log, code e flussi di eventi distribuiti. Rispetto ai valori UUID v4 casuali, UUID v7 riduce la riorganizzazione degli indici perché i record più recenti tendono a comparire vicino alla fine di uno spazio di chiavi ordinato.

## Note su ordinabilità e sicurezza

La porzione di timestamp registra i millisecondi, non un valore privato o segreto. Se un identificatore non deve rivelare l'orario approssimativo di creazione, usa invece un formato completamente casuale. All'interno di un lotto generato, questo strumento mantiene i valori monotoni per lo stesso millisecondo preservando i bit di versione e variante di UUID v7.
