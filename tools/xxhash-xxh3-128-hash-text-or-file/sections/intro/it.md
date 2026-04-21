## Che cos’è xxHash (XXH3 128)?

XXH3 è il moderno algoritmo xxHash, progettato per offrire velocità molto elevate e un’eccellente distribuzione. XXH3 128 produce un valore hash a 128 bit (16 byte), normalmente mostrato come una stringa esadecimale di 32 caratteri. È un hash non crittografico e supporta anche un seed opzionale per risultati riproducibili.

**Caratteristiche principali:**

- **Estremamente veloce**: Ottimizzato per alte prestazioni su input di grandi dimensioni
- **Deterministico**: Lo stesso input e lo stesso seed producono sempre lo stesso hash
- **Non crittografico**: Non adatto a scopi di sicurezza
- **Buona distribuzione**: Utile per tabelle hash e indicizzazione
- **Con seed**: Il seed opzionale aiuta a differenziare gli output hash

**Usi comuni:**

- Tabelle hash e strutture dati
- Verifica dell’integrità dei file (non per la sicurezza)
- Deduplicazione dei dati e chunking
- Chiavi di cache e indicizzazione dei database
- Pipeline dati ad alto throughput
