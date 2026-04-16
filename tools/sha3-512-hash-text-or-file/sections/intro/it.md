## Cos'è SHA3-512 (FIPS 202)?

SHA3-512 (FIPS 202) (Secure Hash Algorithm 512-bit) è una funzione hash crittografica che produce un valore hash di 512 bit (64 byte), tipicamente rappresentato come un numero esadecimale di 128 caratteri. Fa parte della famiglia di funzioni hash SHA-3 standardizzate dal NIST (FIPS 202).

**Caratteristiche chiave:**

- **Deterministico**: Lo stesso input produce sempre lo stesso hash
- **Calcolo veloce**: Veloce da calcolare per qualsiasi input dato
- **Effetto valanga**: Piccoli cambiamenti nell'input producono output drasticamente diversi
- **Irreversibile**: Computazionalmente impossibile invertire l'hash per trovare l'input originale
- **Resistente alle collisioni**: Molto difficile trovare due input diversi che producano lo stesso hash

**Usi comuni:**

- Firme digitali e certificati
- Blockchain e criptovalute (alcuni sistemi usano SHA3-512 (FIPS 202))
- Archiviazione password (con salting appropriato)
- Verifica dell'integrità dei file
- Algoritmi proof-of-work
