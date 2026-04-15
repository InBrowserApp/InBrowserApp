## Cos'è MD5?

MD5 (Message Digest Algorithm 5) è una funzione hash crittografica ampiamente utilizzata che produce un valore hash di 128 bit (16 byte), tipicamente rappresentato come un numero esadecimale di 32 caratteri. È stato progettato da Ron Rivest nel 1991 come successore di MD4.

**Caratteristiche chiave:**

- **Deterministico**: Lo stesso input produce sempre lo stesso hash
- **Calcolo veloce**: Veloce da calcolare per qualsiasi input dato
- **Effetto valanga**: Piccoli cambiamenti nell'input producono output drasticamente diversi
- **Dimensione output fissa**: Produce sempre un hash di 128 bit indipendentemente dalla dimensione dell'input
- **Vulnerabile alle collisioni**: Le vulnerabilità note rendono possibile trovare collisioni

**Stato di sicurezza:**
⚠️ **MD5 è crittograficamente compromesso e non dovrebbe essere usato per applicazioni critiche per la sicurezza**. Gli attacchi di collisione sono stati dimostrati nel 2004, e la generazione pratica di collisioni è diventata fattibile con la potenza di calcolo moderna.

**Usi comuni (attuali e storici):**

- Verifica dell'integrità dei file (non critica per la sicurezza)
- Checksum per la rilevazione della corruzione dei dati
- Sistemi legacy che richiedono MD5
- Generazione di chiavi del database (non crittografico)
- Alcuni protocolli e sistemi più vecchi

**Alternative raccomandate:**

- SHA-256 o SHA-3 per nuove applicazioni
- SHA-512 per requisiti di alta sicurezza
- BLAKE2 per applicazioni ad alte prestazioni
