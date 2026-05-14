La decifratura AES ripristina il testo in chiaro dai dati cifrati con lo stesso materiale della chiave AES. Questo strumento è pensato per l'envelope JSON prodotto da AES Encryptor di InBrowser.App. L'envelope conserva insieme algoritmo, impostazioni di derivazione della chiave, salt, IV, ciphertext e metadati del testo in chiaro, mentre la password o la chiave grezza restano separate.

Tutto il lavoro avviene localmente con la Web Crypto API del browser. Il JSON cifrato, la password, la chiave grezza e il risultato decifrato non vengono caricati.

## Quando usare questo strumento

Usalo quando qualcuno ti fornisce un envelope JSON `inbrowser-aes-v1` o quando devi recuperare una nota, un token, un frammento di configurazione o un file che hai cifrato in precedenza con la pagina AES Encryptor corrispondente.

Se l'envelope è stato creato con una password, inserisci la stessa password e lo strumento riutilizzerà hash PBKDF2, numero di iterazioni, salt, modalità AES e lunghezza chiave salvati. Se l'envelope è stato creato con una chiave grezza, incolla la chiave esadecimale esatta della lunghezza registrata nell'envelope.

## Note pratiche

AES-GCM autentica i dati cifrati, quindi chiavi errate o JSON modificati dovrebbero fallire invece di restituire testo in chiaro alterato. AES-CBC e AES-CTR possono decifrare envelope compatibili, ma da soli non autenticano il ciphertext.

Tieni la password o la chiave grezza separate dall'envelope JSON. Chiunque abbia sia l'envelope sia il materiale della chiave può recuperare il testo in chiaro. Per gli envelope di file, il download recuperato usa il nome file originale e il tipo di media salvati nel JSON.
