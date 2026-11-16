## Vad är SHA-512/256 (FIPS 180-4)?

SHA-512/256 (FIPS 180-4) är en kryptografisk hashfunktion i SHA-2-familjen som ger ett hashvärde på 256 bitar (32 byte), vanligen återgivet som en hexadecimal sträng med 64 tecken. Den bygger på SHA-512 med andra startvärden och ett avkortat resultat, vilket ger ett kortare hashvärde men behåller SHA-512:s interna struktur.

**Viktiga egenskaper:**

- **Deterministisk**: Samma indata ger alltid samma hashvärde
- **Snabb beräkning**: Går snabbt att beräkna för valfria indata
- **Lavineffekt**: Små ändringar i indata ger drastiskt annorlunda resultat
- **Icke reversibel**: Det är beräkningsmässigt ogenomförbart att återskapa ursprungliga indata från hashvärdet
- **Kollisionsresistent**: Det är mycket svårt att hitta två olika indata som ger samma hashvärde

**Vanliga användningsområden:**

- Digitala signaturer och certifikat
- Integritetskontroller och kontrollsummor
- HMAC-konstruktioner
- Filverifiering och dataflöden
- Protokoll som kräver hashvärden på 256 bitar
