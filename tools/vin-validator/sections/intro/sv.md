## Vad är ett VIN?

Ett Vehicle Identification Number (VIN) är en 17 tecken lång kod som unikt identifierar ett fordon.

- `1M8GDM9AXKP042788`
- Bokstäverna I, O, Q används inte
- Det nionde tecknet är en kontrollsiffra

### VIN-struktur

1. **WMI** (position 1–3): World Manufacturer Identifier
2. **VDS** (position 4–8): Vehicle Descriptor Section
3. **Kontrollsiffra** (position 9): beräknas från alla övriga tecken
4. **VIS** (position 10–17): Vehicle Identifier Section

### Kontrollsiffra

Varje bokstav översätts till ett tal (A=1, B=2, … med undantag för I, O, Q). Varje position har en vikt. Den viktade summan modulo 11 ger kontrollsiffran; 10 representeras av X.

`(w1×v1 + w2×v2 + … + w17×v17) mod 11 = kontrollsiffra`

Det här verktyget validerar enbart format och kontrollsiffreregler. Det verifierar inte registrering i verkligheten.
