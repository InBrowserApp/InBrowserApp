## Come usare il terminale seriale nel browser

Collega Arduino, ESP32, Raspberry Pi Pico o un adattatore seriale USB con un cavo dati. Imposta la velocità baud usata dal dispositivo, ad esempio 9600 o 115200, poi seleziona **Connetti** e scegli la porta nel browser. Questo monitor seriale usa 8 bit di dati, nessuna parità, un bit di arresto e nessun controllo di flusso (8N1).

## Invio di testo e byte esadecimali

Il testo viene inviato in UTF-8. Se il dispositivo usa un carattere di fine riga per inviare i comandi, scegli LF, CR o CR + LF. Per i comandi binari, seleziona **Esadecimale** e inserisci byte completi, ad esempio `41 54 0D 0A`. In modalità esadecimale i byte vengono inviati come inseriti, senza aggiungere automaticamente un carattere di fine riga.

## Lettura e salvataggio dei registri seriali

Il registro mostra i dati ricevuti (RX) e inviati (TX) con l'indicazione dell'ora. Passa alla modalità esadecimale per esaminare i singoli byte se il testo appare illeggibile. Sospendi lo scorrimento per controllare una voce precedente mentre continuano ad arrivare dati, oppure scarica il registro conservato come file di testo. I dati seriali rimangono in questa scheda finché non scegli di salvarli.

## Perché non riesco a connettermi al dispositivo?

Usa un browser aggiornato che supporti Web Serial e verifica che il sistema operativo riconosca la porta seriale. Prova un altro cavo e chiudi gli altri monitor seriali che stanno già usando la porta. Se il dispositivo si connette ma produce testo illeggibile, controlla la velocità baud e prova a visualizzare i byte in formato esadecimale.
