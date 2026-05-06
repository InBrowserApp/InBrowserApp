## Cos'è RIPEMD-128?

RIPEMD-128 (RACE Integrity Primitives Evaluation Message Digest) è una funzione hash crittografica che produce un valore hash di 128 bit (16 byte), tipicamente rappresentato come un numero esadecimale di 32 caratteri. Fa parte della famiglia RIPEMD sviluppata in Europa come alternativa a MD4/MD5.

**Caratteristiche chiave:**

- **Deterministico**: Lo stesso input produce sempre lo stesso hash
- **Calcolo veloce**: Veloce da calcolare per qualsiasi input dato
- **Effetto valanga**: Piccoli cambiamenti nell'input producono output drasticamente diversi
- **Dimensione di output fissa**: Produce sempre un hash di 128 bit indipendentemente dalla dimensione dell'input
- **Unidirezionale**: È computazionalmente impraticabile recuperare l'input originale dall'hash

**Usi comuni:**

- Verifica dell'integrità dei dati
- Fingerprinting e deduplicazione
- Compatibilità con sistemi legacy
