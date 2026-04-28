## Crea file di calendario senza uscire dal browser

Questo strumento genera file evento `.ics` standard direttamente nel browser. Puoi definire eventi con orario o per l’intera giornata, scegliere una strategia di fuso orario, aggiungere promemoria ed esportare la voce finale del calendario senza sincronizzare dati con un server.

### Perché usarlo

- È utile quando ti serve solo un file di calendario e non un intero flusso con account calendario.
- Mantiene in locale gli orari sensibili e genera comunque un allegato evento basato su standard.
- Ti permette di regolare regole di ricorrenza e promemoria prima di scaricare il file `.ics` finale.

### Flusso consigliato

1. Compila il riepilogo dell’evento, la posizione, le note e l’URL di riferimento opzionale.
2. Scegli l’intervallo dell’evento e decidi se esportare timestamp `UTC` oppure mantenere il fuso orario originale con `TZID`.
3. Aggiungi ricorrenze e promemoria solo se servono, poi scarica il file e allegalo dove condividi l’evento.

### Note

- L’output `UTC` è in genere la scelta più sicura quando vuoi un’ampia compatibilità tra calendari.
- L’output `TZID` conserva il contesto originale di pianificazione per i client che comprendono i fusi orari nominali.
- Per gli eventi di un’intera giornata, il modulo mantiene la data finale inclusiva anche se il file ICS la salva come data finale esclusiva.
