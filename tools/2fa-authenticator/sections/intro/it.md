## Ottieni un codice 2FA da una chiave di configurazione o da un codice QR

Apri le impostazioni di autenticazione a due fattori del sito che vuoi proteggere e scegli l’opzione per l’app di autenticazione. Carica o scansiona il codice QR del sito, oppure incolla la chiave di configurazione o il link `otpauth://` e seleziona **Aggiungi account**. Incolla il codice corrente nel campo di verifica del sito per completare la configurazione.

## Trasferisci gli account da un altro autenticatore

In Google Authenticator, scegli **Trasferisci account** ed esporta quelli che vuoi spostare. Qui puoi scansionare i codici QR di esportazione con **Usa fotocamera** o caricare insieme le immagini salvate. Nell’[autenticatore originale di InBrowser.App](https://authenticator.inbrowser.app/), apri **Export**, scegli **Google Authenticator**, quindi scarica l’immagine del codice QR e caricala qui.

Gli account TOTP importati dai codici QR di trasferimento di Google usano un intervallo di 30 secondi. Per mantenere gli intervalli personalizzati dell’autenticatore originale, trasferisci gli account singolarmente. Fai clic sull’ingranaggio di ogni account, espandi **Key URI** in **Config** e incolla qui il link.

Gli account vengono salvati in questo browser. Scarica un backup da **Esporta account** prima di cancellare i dati del sito o passare a un altro browser. Tienilo al sicuro perché contiene le tue chiavi di configurazione.

## Perché il sito rifiuta il mio codice di verifica?

La maggior parte dei siti usa codici basati sull’ora (TOTP). Verifica che il dispositivo imposti l’ora automaticamente e, se il codice sta per scadere, aspetta il successivo. I codici basati su un contatore (HOTP) restano uguali finché non selezioni **Codice successivo**. In entrambi i casi, usa il codice dell’account giusto e le impostazioni personalizzate fornite dal sito.
