## Wat is SHA-512/224 (FIPS 180-4)?

SHA-512/224 (FIPS 180-4) is een cryptografische SHA-2-hashfunctie die een digest
van 224 bits (28 bytes) oplevert, meestal weergegeven als een hexadecimale reeks
van 56 tekens. De functie is gebaseerd op SHA-512 met andere beginwaarden en een
ingekorte uitvoer, waardoor de digest korter is terwijl de interne structuur van
SHA-512 behouden blijft.

**Belangrijkste kenmerken:**

- **Deterministisch**: Dezelfde invoer levert altijd dezelfde hash op
- **Snelle berekening**: Snel te berekenen voor elke gegeven invoer
- **Lawine-effect**: Kleine wijzigingen in de invoer leveren sterk verschillende uitvoer op
- **Onomkeerbaar**: Het is rekenkundig onhaalbaar om uit de hash de oorspronkelijke invoer terug te halen
- **Botsingsbestendig**: Het is erg moeilijk om twee verschillende invoeren te vinden die dezelfde hash opleveren

**Veelvoorkomende toepassingen:**

- Digitale handtekeningen en certificaten
- Integriteitscontroles en controlesommen
- HMAC-constructies
- Bestandsverificatie en gegevenspijplijnen
- Protocollen die hashes van 224 bits vereisen
