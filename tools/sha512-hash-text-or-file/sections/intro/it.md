## Cos'è SHA-512?

SHA-512 (Secure Hash Algorithm 512-bit) è una funzione hash crittografica che produce un valore hash di 512 bit (64 byte), tipicamente rappresentato come un numero esadecimale di 128 caratteri. Fa parte della famiglia di funzioni hash SHA-2 progettate dalla NSA e pubblicate dal NIST.

**Caratteristiche chiave:**

- **Deterministico**: Lo stesso input produce sempre lo stesso hash
- **Calcolo veloce**: Veloce da calcolare per qualsiasi input dato
- **Effetto valanga**: Piccoli cambiamenti nell'input producono output drasticamente diversi
- **Irreversibile**: Computazionalmente impossibile invertire l'hash per trovare l'input originale
- **Resistente alle collisioni**: Molto difficile trovare due input diversi che producano lo stesso hash

**Usi comuni:**

- Firme digitali e certificati
- Blockchain e criptovalute (Bitcoin usa SHA-256, ma SHA-512 è usato in altri sistemi)
- Archiviazione password (con salting appropriato)
- Verifica dell'integrità dei file
- Algoritmi proof-of-work
