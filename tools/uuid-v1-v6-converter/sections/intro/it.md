UUID v1 e UUID v6 contengono le stesse informazioni di base: un timestamp, una sequenza di clock e un identificatore di nodo. UUID v1 memorizza il timestamp nell'ordine storico dei campi UUID, mentre UUID v6 riordina quei bit del timestamp in modo che un semplice ordinamento lessicografico segua più naturalmente il momento di creazione.

Usa questo strumento quando devi spostare identificatori tra sistemi che si aspettano layout UUID basati sul tempo diversi. Incolla un UUID v1 per ottenere il suo equivalente UUID v6, oppure incolla un UUID v6 per recuperare la rappresentazione UUID v1. La conversione è deterministica e mantiene invariati la sequenza di clock e i byte del nodo.

## Quando usarlo

- Migrazione di record da archiviazioni UUID v1 legacy a UUID v6, preservando i metadati di identità.
- Debug di database, log o code che mescolano valori UUID v1 e UUID v6.
- Verifica che un valore UUID v6 corrisponda al valore UUID v1 atteso da un'integrazione precedente.

## Formato di input

Il convertitore accetta stringhe UUID canoniche con trattini, stringhe UUID compatte di 32 caratteri, UUID maiuscoli, valori `urn:uuid:` e UUID racchiusi tra parentesi graffe. I risultati sono sempre normalizzati nella forma UUID canonica minuscola.

## Note su privacy e compatibilità

UUID v1 e UUID v6 possono codificare l'ora di creazione e le informazioni del nodo. Trattali come identificatori operativi, non come segreti, ed evita di esporli quando i metadati del timestamp o del nodo potrebbero essere sensibili. Questo strumento viene eseguito localmente nel tuo browser e non carica i tuoi UUID.
