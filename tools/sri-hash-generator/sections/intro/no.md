## Hva er Subresource Integrity (SRI)?

Subresource Integrity (SRI) er en sikkerhetsfunksjon som gjør det mulig for nettlesere å verifisere at filer de henter (f.eks. fra en CDN) ikke har blitt uventet endret. Det fungerer ved å sammenligne den kryptografiske hashen til en ressurs med en hash som er oppgitt i HTML-en.

**Hvordan det fungerer:**

1. Generer en kryptografisk hash av ressursfilen din
2. Inkluder hashen i integrity-attributtet til script- eller link-tagger
3. Nettleseren henter ressursen og beregner dens hash
4. Nettleseren sammenligner den beregnede hashen med den oppgitte hashen
5. Hvis hashene stemmer overens, lastes ressursen; hvis ikke, blokkeres lastingen

**Fordeler:**

- **Sikkerhet**: Beskytter mot ondsinnet endring av tredjepartsressurser
- **CDN-beskyttelse**: Sikrer at CDN-serverte filer ikke har blitt manipulert
- **Leverandørkjedesikkerhet**: Validerer integriteten til eksterne avhengigheter
- **Nettleserstøtte**: Bredt støttet i moderne nettlesere

**Støttede algoritmer:**

- SHA-256 (anbefalt minimum)
- SHA-384 (anbefalt)
- SHA-512 (høyeste sikkerhet)
