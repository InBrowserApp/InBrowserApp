# Che cos'è la cifratura AES?

AES è un algoritmo di cifratura simmetrica, il che significa che lo stesso segreto viene usato per cifrare e decifrare i dati. Questo strumento funziona interamente nel tuo browser e usa la Web Crypto API, quindi testo in chiaro, password e file selezionati non vengono caricati.

La modalità predefinita è AES-GCM perché cifra e autentica l'output. L'autenticazione è importante: se il ciphertext, il salt o l'IV cambiano in seguito, la decifratura dovrebbe fallire invece di restituire dati alterati. AES-CBC e AES-CTR sono disponibili per compatibilità, ma da soli non autenticano il ciphertext.

## Quando usare questo strumento

Usalo quando devi proteggere una nota, un token, un frammento di configurazione o un piccolo file prima di archiviarlo o condividerlo tramite un altro canale. L'output è un envelope JSON che contiene modalità, impostazioni di derivazione della chiave, salt, IV e ciphertext, così questi parametri restano insieme per il passaggio di decifratura corrispondente.

Per la cifratura basata su password, la password viene elaborata con PBKDF2 e un salt casuale. Aumenta il numero di iterazioni quando puoi tollerare cifratura e decifratura più lente. Per la cifratura con chiave grezza, incolla una chiave esadecimale con esattamente la lunghezza selezionata: 32 caratteri hex per 128 bit, 48 per 192 bit o 64 per 256 bit.

## Note pratiche

Tieni la password o la chiave grezza separate dal JSON cifrato. Chiunque abbia sia il JSON sia il materiale della chiave può decifrare i dati. Se cifri un file, scarica il risultato JSON e conserva separatamente il nome file originale se quel contesto è importante.

Non riutilizzare un IV manuale con la stessa chiave. Questo strumento genera un IV e un salt nuovi a ogni esecuzione, che è l'impostazione predefinita più sicura. Preferisci AES-GCM a meno che un altro sistema non richieda specificamente AES-CBC o AES-CTR.
