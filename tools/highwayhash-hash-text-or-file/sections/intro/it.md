## Che cos'è HighwayHash?

HighwayHash è una funzione hash veloce con chiave, progettata da Google per fingerprint ad alta velocità e controlli di integrità. Usa una chiave a 256 bit e può produrre output a 64 bit, 128 bit o 256 bit dallo stesso input di testo o file.

## Quando usarlo

- Crea checksum deterministici con chiave per chiavi cache, ID oggetto, sharding o tabelle di ricerca interne.
- Confronta file o payload di testo con la stessa chiave quando la velocità conta più della compatibilità crittografica ampia.
- Genera fingerprint a 128 bit o 256 bit quando un hash non-password più grande è utile nei flussi di lavoro di integrità.

## Opzioni di chiave e output

Inserisci la chiave come esattamente 32 byte di dati esadecimali, ad esempio `0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f`. Il prefisso `0x` è facoltativo e lo strumento accetta spazi, due punti, trattini e trattini bassi per rendere più facili da leggere le chiavi lunghe. Lasciare la chiave vuota usa la chiave predefinita della libreria, comoda per controlli rapidi ma da non trattare come segreta.

## Note sulla sicurezza

HighwayHash non sostituisce HMAC, firme digitali o hashing delle password. Usalo per fingerprint veloci con chiave e flussi di lavoro di checksum, non per provare l'autenticità tra sistemi che richiedono una verifica crittografica standard.
