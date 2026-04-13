## Hva er et VIN?

Et kjøretøyidentifikasjonsnummer (VIN) er en 17-tegns kode som unikt identifiserer et kjøretøy.

- `1M8GDM9AXKP042788`
- Bokstavene I, O, Q brukes ikke
- Det 9. tegnet er et kontrollsiffer

### VIN-struktur

1. **WMI** (posisjon 1–3): Verdens produsentidentifikator
2. **VDS** (posisjon 4–8): Kjøretøybeskrivelsesdel
3. **Kontrollsiffer** (posisjon 9): beregnet fra alle andre tegn
4. **VIS** (posisjon 10–17): Kjøretøyidentifikasjonsdel

### Kontrollsiffer

Hver bokstav translittereres til et tall (A=1, B=2, … I, O, Q hoppes over). Hver posisjon har en vekt. Den vektede summen modulo 11 gir kontrollsifferet; 10 representeres med X.

`(w1×v1 + w2×v2 + ... + w17×v17) mod 11 = kontrollsiffer`

Dette verktøyet validerer kun format og kontrollsifferregler. Det verifiserer ikke registrering i den virkelige verden.
