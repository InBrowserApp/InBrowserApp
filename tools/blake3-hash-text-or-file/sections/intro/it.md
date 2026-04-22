## Cos'è BLAKE3?

BLAKE3 è una funzione hash crittografica moderna derivata da BLAKE2. È progettata per prestazioni molto elevate e parallelismo mantenendo una sicurezza robusta. Produce un hash a 256 bit per impostazione predefinita e supporta una lunghezza di output estendibile (XOF).

**Caratteristiche chiave:**

- **Lunghezza di output estendibile**: Può produrre hash di qualsiasi lunghezza
- **Alte prestazioni**: Veloce e parallelizzabile su CPU moderne
- **Deterministico**: Lo stesso input produce sempre lo stesso hash
- **Effetto valanga**: Piccoli cambiamenti nell'input producono output drasticamente diversi
- **Irreversibile**: Computazionalmente impossibile invertire l'hash per trovare l'input originale
- **Resistente alle collisioni**: Molto difficile trovare due input diversi che producano lo stesso hash
- **Hash con chiave**: Supporta una chiave opzionale di 32 byte per la funzionalità MAC
- **Derivazione delle chiavi**: Può derivare sottochiavi da materiale di chiave e contesto

**Usi comuni:**

- Verifica dell'integrità dei file
- Archiviazione indirizzata al contenuto e deduplicazione
- Firme digitali e certificati
- Archiviazione e autenticazione password
- Protocolli e sistemi crittografici
