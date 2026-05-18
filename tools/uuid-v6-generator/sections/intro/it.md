Generatore UUID v6 crea UUID basati sul tempo che mantengono la forma familiare degli UUID, mettendo però il timestamp all'inizio per un ordinamento lessicale naturale. Funziona interamente nel browser, quindi gli identificatori generati e i valori nodo opzionali non lasciano mai la pagina.

## Quando UUID v6 è utile

Usa UUID v6 quando hai bisogno di identificatori che restino ampiamente compatibili con gli strumenti UUID, ma che si ordinino anche vicino all'ordine di creazione in log, indici di database, stream di eventi o script di migrazione. UUID v6 è semanticamente molto vicino a UUID v1: usa un timestamp gregoriano, una sequenza di clock e un campo nodo a 48 bit, ma riordina i bit del timestamp in modo che gli ID più recenti vengano ordinati dopo quelli più vecchi.

## ID nodo e privacy

I generatori UUID v1 classici usano spesso un vero indirizzo MAC come campo nodo. Questo strumento usa per impostazione predefinita un ID nodo casuale e amministrato localmente per ogni UUID generato, così non espone un indirizzo hardware. Passa a un nodo personalizzato solo quando hai intenzionalmente bisogno di output compatibile con v1 per fixture di test, verifiche di interoperabilità o sistemi controllati.

## Sequenza di clock e ora personalizzata

La sequenza di clock aiuta a evitare collisioni quando i timestamp si ripetono o gli orologi tornano indietro. La sequenza casuale predefinita è la scelta più sicura per l'uso normale. Timestamp, ID nodo e sequenze di clock personalizzati sono utili per esempi deterministici, ma i valori personalizzati ripetuti devono essere usati con cautela nei dati di produzione.
