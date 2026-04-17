## Cos'è xxHash (XXH64)?

xxHash è un algoritmo hash non crittografico estremamente veloce che si concentra sulla velocità e le prestazioni mantenendo buone proprietà di distribuzione. XXH64 è la variante a 64 bit che produce un valore hash a 64 bit (8 byte), tipicamente visualizzato come numero esadecimale a 16 caratteri.

**Caratteristiche chiave:**

- **Estremamente veloce**: Ottimizzato per la velocità, molto più veloce delle funzioni hash crittografiche
- **Deterministico**: Lo stesso input produce sempre lo stesso hash
- **Buona distribuzione**: Fornisce eccellente distribuzione hash per tabelle hash
- **Non crittografico**: Non adatto per scopi di sicurezza, progettato per le prestazioni
- **Output più grande**: L'hash a 64 bit fornisce migliore resistenza alle collisioni rispetto alle varianti a 32 bit
- **Ottimizzato per piattaforma**: Usa istruzioni SIMD quando disponibili per massima velocità

**Usi comuni:**

- Tabelle hash e strutture dati
- Controlli integrità file (non-sicurezza)
- Deduplicazione dati
- Checksum per trasmissione dati
- Applicazioni critiche per prestazioni
- Indicizzazione database
- Generazione chiavi cache
