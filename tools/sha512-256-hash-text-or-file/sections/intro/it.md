## Che cos'è SHA-512/256 (FIPS 180-4)?

SHA-512/256 (FIPS 180-4) è una funzione hash crittografica della famiglia SHA-2 che produce un digest di 256 bit (32 byte), generalmente rappresentato come stringa esadecimale di 64 caratteri. Si basa su SHA-512 con valori iniziali diversi e un output troncato, fornendo un digest più breve e mantenendo la struttura interna di SHA-512.

**Caratteristiche principali:**

- **Deterministica**: Lo stesso input produce sempre lo stesso hash
- **Calcolo rapido**: Il calcolo è veloce per qualsiasi input
- **Effetto valanga**: Piccole modifiche all'input producono output molto diversi
- **Irreversibile**: È computazionalmente impraticabile risalire dall'hash all'input originale
- **Resistente alle collisioni**: È molto difficile trovare due input diversi che producano lo stesso hash

**Usi comuni:**

- Firme digitali e certificati
- Controlli di integrità e checksum
- Costruzioni HMAC
- Verifica di file e processi di elaborazione dei dati
- Protocolli che richiedono hash a 256 bit
