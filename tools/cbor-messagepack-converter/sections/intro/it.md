## Esaminare i dati binari delle API

CBOR e MessagePack sono formati compatti di serializzazione binaria per dati strutturati. Usa questo convertitore per esaminare risposte API, messaggi WebSocket o valori nella cache come JSON, oppure per creare dati binari da JSON per il debug. Tutto viene elaborato nel browser; gli input non vengono caricati né salvati.

## Codificare JSON o decodificare byte

Scegli il formato binario e la direzione della conversione. Per codificare, inserisci JSON e scegli Hex, Base64 o Base64URL per l’output. Per decodificare, incolla i byte e seleziona la loro codifica di input. Cambiando la codifica di input, il testo già presente nell’editor viene reinterpretato.

Apri un file JSON per la codifica oppure un file binario `.cbor`, `.msgpack` o `.bin` per la decodifica. Il testo codificato, come Hex o Base64, va incollato nell’editor. Esegui la conversione, poi copia il testo visualizzato o scarica il risultato. I download binari contengono i byte effettivi e possono essere importati nuovamente.

## Preservare i valori e comprendere i limiti

I letterali interi mantengono tutte le cifre entro l’intervallo a 64 bit supportato dal formato. I valori che JSON non può rappresentare, come campi binari, tag CBOR ed estensioni MessagePack, vengono mostrati come oggetti con tipo esplicito. Abilita JSON esteso per ricodificare questi oggetti in binario; lascialo disabilitato per i normali oggetti JSON che usano casualmente chiavi di tipo speciale.

Ad esempio, con JSON esteso abilitato, `{"id":{"$integer":"9007199254740993"},"data":{"$binary":"AQI="}}` codifica un intero esatto e due byte binari.

Ogni conversione gestisce un valore, con un limite di input di 1 MiB. «Byte JSON formattato» conta i byte del JSON visualizzato e formattato, non quelli dell’input originale. La ricodifica preserva i valori supportati, ma può cambiare l’ordine delle mappe o la codifica binaria scelta. Apri «Formati e fedeltà dei tipi» qui sopra per consultare la sintassi degli oggetti con tipo esplicito e i tipi non supportati.
