## Come connettersi a un dispositivo Bluetooth Low Energy

Attiva il Bluetooth e imposta il dispositivo in modalità di connessione. Seleziona **Connetti dispositivo** e scegli la periferica nel browser. Questo strumento richiede l'accesso a servizi GATT comuni come Battery Service, Device Information, Heart Rate ed Environmental Sensing. Per un servizio GATT personalizzato, inserisci il suo UUID prima di aprire la finestra di selezione. Usa un UUID a 16 bit come `180F` oppure un UUID completo a 128 bit riportato nella documentazione del dispositivo.

## Come leggere le caratteristiche GATT

Espandi un servizio per vedere le sue caratteristiche e le operazioni supportate. Seleziona **Leggi** per richiedere il valore corrente. Il formato esadecimale mostra i byte esattamente come ricevuti, mentre UTF-8 è utile per le caratteristiche che contengono testo. Il livello della batteria, una misurazione o un altro valore binario potrebbero richiedere un'interpretazione secondo la specifica della caratteristica.

## Come acquisire le notifiche Bluetooth

Seleziona **Attiva notifiche** su una caratteristica che supporta Notify o Indicate. Gli aggiornamenti appaiono con l'ora e l'UUID della caratteristica. Scarica le ultime 100 notifiche come file JSON per esaminarle in seguito, oppure seleziona **Disattiva notifiche** per interrompere quel flusso. La pagina conserva il registro localmente.

## Perché non vedo il dispositivo o i suoi servizi?

Il supporto di Web Bluetooth dipende dal browser e dal sistema operativo. Usa un browser supportato tramite HTTPS, tieni il dispositivo nelle vicinanze e disconnettilo da altre app se consente una sola connessione. Il browser rende disponibili i servizi GATT autorizzati sulle periferiche Bluetooth LE. I dispositivi Bluetooth Classic, come le cuffie che espongono solo profili audio, richiedono un'interfaccia diversa.
