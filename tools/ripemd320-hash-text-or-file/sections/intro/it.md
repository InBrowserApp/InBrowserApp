## Cos'è RIPEMD-320?

RIPEMD-320 (RACE Integrity Primitives Evaluation Message Digest) è una funzione hash crittografica che produce un valore hash di 320 bit (40 byte), tipicamente rappresentato come un numero esadecimale di 80 caratteri. Fa parte della famiglia RIPEMD sviluppata in Europa come alternativa a MD4/MD5.

Usa questo strumento quando devi calcolare un digest RIPEMD-320 per testo incollato, dati di configurazione copiati o un file locale. Il calcolo viene eseguito nel browser, quindi il contenuto del file non deve essere caricato su un server.

**Caratteristiche chiave:**

- **Deterministico**: Lo stesso input produce sempre lo stesso hash
- **Calcolo veloce**: Rapido da calcolare per qualsiasi input
- **Effetto valanga**: Piccoli cambiamenti nell'input producono output drasticamente diversi
- **Dimensione di output fissa**: Produce sempre un hash di 320 bit indipendentemente dalla dimensione dell'input
- **Unidirezionale**: È computazionalmente impraticabile recuperare l'input originale dall'hash

**Usi comuni:**

- Verifica dell'integrità dei dati
- Fingerprinting e deduplicazione
- Compatibilità con sistemi legacy

**Nota sulla sicurezza:**

RIPEMD-320 è utile soprattutto quando un protocollo, un archivio, un elenco di checksum o un sistema legacy lo specifica già. Per nuovi progetti sensibili alla sicurezza, preferisci un hash attualmente standardizzato come SHA-256, SHA-512, SHA-3 o BLAKE3, a meno che non sia richiesta la compatibilità con RIPEMD.
