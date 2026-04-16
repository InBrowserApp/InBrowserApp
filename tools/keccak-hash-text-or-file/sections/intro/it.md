## Cos'è Keccak?

Keccak è una famiglia di funzioni hash crittografiche che serve come base per lo standard SHA-3 (Secure Hash Algorithm 3). Sviluppato da Guido Bertoni, Joan Daemen, Michaël Peeters e Gilles Van Assche, ha vinto la competizione NIST per le funzioni hash nel 2012.

**Caratteristiche chiave:**

- **Costruzione a spugna**: Utilizza un design innovativo di funzione a spugna con fasi di assorbimento e spremitura
- **Lunghezza di output variabile**: Può produrre output hash di qualsiasi lunghezza desiderata
- **Alto margine di sicurezza**: Progettato con riserve di sicurezza sostanziali
- **Diverso da SHA-1/SHA-2**: Basato su principi matematici completamente diversi
- **Variante Keccak[c=2d]**: Questa implementazione usa la specifica Keccak originale con capacità c = 2d (dove d è la lunghezza dell'output)

**Differenze tra Keccak e SHA-3 (FIPS 202):**
🔍 **Distinzione importante**: Il Keccak originale e lo SHA-3 standardizzato **non sono identici**:

- **Keccak originale**: Usa capacità c = 2d e padding diverso (padding Keccak: 0x01)
- **FIPS 202 SHA-3**: Usa capacità c = 2d ma padding diverso (padding SHA-3: 0x06)
- **Separazione di dominio**: La differenza nel padding assicura che Keccak e SHA-3 producano output diversi per lo stesso input
- **Questo strumento implementa**: La **specifica Keccak originale** con parametrizzazione Keccak[c=2d]

**Stato di sicurezza:**
✅ **Keccak è considerato altamente sicuro** senza attacchi pratici conosciuti. Fornisce eccellenti margini di sicurezza e resistenza contro varie tecniche crittoanalitiche.

**Usi comuni:**

- Blockchain Ethereum (usa Keccak-256 originale)
- Ricerca accademica e protocolli crittografici
- Applicazioni che richiedono output hash di lunghezza variabile
- Sistemi che necessitano alternative alla famiglia SHA-2
- Implementazioni blockchain e criptovalute

**Vantaggi rispetto agli hash tradizionali:**

- Design fondamentalmente diverso riduce il rischio di attacchi correlati
- Lunghezza di output flessibile (non limitata a dimensioni fisse)
- Solida base di sicurezza teorica
- Resistenza agli attacchi di estensione della lunghezza
- Eccellenti prestazioni su varie piattaforme

**Nota tecnica:**

- **Keccak-256**: Produce output a 256 bit (variante più comune)
- **Formula della capacità**: c = 2d assicura il livello di sicurezza appropriato
- **Uso Ethereum**: Ethereum usa specificamente Keccak-256 originale, non SHA3-256
