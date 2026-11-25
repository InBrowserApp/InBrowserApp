## Generare date casuali in un intervallo

Compila i campi **Data di inizio** e **Data di fine**, scegli il formato di output e seleziona **Genera**. L’intervallo include entrambe le date indicate. Per esempio, tra `2024-02-28` e `2024-03-01` può essere estratto anche il giorno bisestile `2024-02-29`. Una stessa data può comparire più volte nell’elenco. Copia i risultati o scarica un file di testo `UTF-8` con una data per riga.

## Scegliere il formato ISO o quello locale

Usa **ISO (YYYY-MM-DD)** per i dati di test, le importazioni nei fogli di calcolo o per ordinare cronologicamente le date come testo. Scegli **Data nel formato locale** per visualizzare le date del calendario gregoriano nella lingua della pagina. Per esempio, `2024-02-29` appare come `Feb 29, 2024` nella pagina in inglese e come `29.02.2024` in quella in tedesco.

## Mantenere lo stesso giorno in tutti i fusi orari

L’intervallo si basa sull’inizio e sulla fine del giorno in UTC. Una data estratta all’inizio o alla fine dell’intervallo resta lo stesso giorno ovunque si usi il generatore. Impostando la stessa data di inizio e di fine, si ottiene sempre quella data. È utile per testare un giorno bisestile o il primo o l’ultimo giorno di un mese.
