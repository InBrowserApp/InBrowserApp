## Cos'è RIPEMD-160?

RIPEMD-160 (RACE Integrity Primitives Evaluation Message Digest) è una funzione hash crittografica che produce un valore hash di 160 bit (20 byte), tipicamente rappresentato come un numero esadecimale di 40 caratteri. È stato sviluppato nel 1996 da Hans Dobbertin, Antoon Bosselaers e Bart Preneel come parte del progetto europeo RACE.

**Caratteristiche chiave:**

- **Deterministico**: Lo stesso input produce sempre lo stesso hash
- **Calcolo veloce**: Ragionevolmente veloce da calcolare per qualsiasi input dato
- **Effetto valanga**: Piccoli cambiamenti nell'input producono output drasticamente diversi
- **Dimensione output fissa**: Produce sempre un hash di 160 bit indipendentemente dalla dimensione dell'input
- **Struttura parallela a due linee**: Usa due linee di calcolo parallele per sicurezza migliorata

**Stato di sicurezza:**
✅ **RIPEMD-160 è considerato crittograficamente sicuro** senza attacchi pratici conosciuti. Fornisce un buon margine di sicurezza ed è ancora raccomandato per applicazioni crittografiche dove un hash di 160 bit è sufficiente.

**Usi comuni:**

- Generazione di indirizzi Bitcoin (codifica Base58Check)
- Firme digitali e certificati
- Verifica dell'integrità dei dati
- Protocolli crittografici che richiedono hash di 160 bit
- Alternativa a SHA-1 quando necessario

**Confronto con altri algoritmi:**

- Più sicuro di MD5 e SHA-1
- Output più piccolo di SHA-256 (160 bit vs 256 bit)
- Buone caratteristiche di prestazione
- Ben studiato e fidato nella comunità crittografica

**Raccomandato per:**

- Applicazioni che richiedono sicurezza hash di 160 bit
- Operazioni crittografiche relative a Bitcoin
- Compatibilità con sistemi legacy dove RIPEMD-160 è specificato
