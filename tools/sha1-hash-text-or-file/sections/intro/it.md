## Cos'è SHA-1?

SHA-1 (Secure Hash Algorithm 1) è una funzione hash crittografica che produce un valore hash di 160 bit (20 byte), tipicamente rappresentato come un numero esadecimale di 40 caratteri. È stato progettato dalla NSA e pubblicato dal NIST nel 1995 come parte del Digital Signature Standard.

**Caratteristiche chiave:**

- **Deterministico**: Lo stesso input produce sempre lo stesso hash
- **Calcolo veloce**: Veloce da calcolare per qualsiasi input dato
- **Effetto valanga**: Piccoli cambiamenti nell'input producono output drasticamente diversi
- **Irreversibile**: Computazionalmente impossibile invertire l'hash per trovare l'input originale
- **Vulnerabile alle collisioni**: Le vulnerabilità note rendono possibile trovare collisioni

**Stato di sicurezza:**
⚠️ **SHA-1 è crittograficamente compromesso e non dovrebbe essere usato per applicazioni critiche per la sicurezza**. Gli attacchi teorici sono stati dimostrati nel 2005, e gli attacchi pratici di collisione sono stati raggiunti nel 2017.

**Usi comuni (storici):**

- Firme digitali e certificati (deprecato)
- Sistema di controllo versione Git (per compatibilità)
- Sistemi legacy che richiedono SHA-1
- Verifica dell'integrità dei file (non critica per la sicurezza)
- Algoritmi proof-of-work (alcune criptovalute più vecchie)

**Alternative raccomandate:**

- SHA-256 o SHA-3 per nuove applicazioni
- SHA-512 per requisiti di alta sicurezza
