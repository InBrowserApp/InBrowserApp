## Che cos'è SipHash-128-2-4?

SipHash-128-2-4 è una funzione hash veloce con chiave, progettata per messaggi brevi e per la protezione delle tabelle hash. Usa una chiave segreta a 128 bit e produce un output a 128 bit, di solito visualizzato come valore esadecimale di 32 caratteri.

## Quando usarlo

- Proteggi le tabelle hash lato server dagli attacchi di hash flooding quando la chiave resta privata.
- Crea checksum deterministici con chiave per chiavi cache, sharding o tabelle di consultazione interne.
- Confronta frammenti di testo o file con la stessa chiave quando non è richiesta autenticazione crittografica.

## Formato della chiave

Inserisci la chiave come esattamente 16 byte di dati esadecimali, ad esempio `0x000102030405060708090a0b0c0d0e0f`. Il prefisso `0x` è facoltativo e lo strumento accetta spazi, due punti, trattini e trattini bassi per rendere più facili da leggere le chiavi lunghe.

## Note sulla sicurezza

SipHash-128-2-4 non sostituisce HMAC, firme digitali o hashing delle password. Usalo per flussi di lavoro con tabelle hash e checksum con chiave, non per provare l'autenticità tra sistemi che richiedono garanzie di sicurezza crittografica.
