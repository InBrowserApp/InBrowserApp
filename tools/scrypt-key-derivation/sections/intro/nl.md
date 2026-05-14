## Wat is scrypt?

scrypt is een geheugenhard wachtwoordgebaseerde sleutelafleidingsfunctie (KDF). Het zet een wachtwoord en salt om in deterministische sleutelbytes en gebruikt daarbij bewust CPU-tijd en geheugen, waardoor grootschalig raden van wachtwoorden duurder wordt dan eenvoudig hashen.

**Belangrijke punten:**

- Gebruikt `N` (kostenfactor), `r` (blokgrootte) en `p` (parallellisme)
- Hogere instellingen voor `N` en `r` verhogen de geheugen- en rekenkosten
- Produceert alleen dezelfde afgeleide sleutel wanneer wachtwoord, salt, parameters en uitvoerlengte overeenkomen

**Best practices:**

- Gebruik een unieke willekeurige salt voor elk wachtwoord of geheim
- Sla `N`, `r`, `p`, salt-formaat en uitvoerlengte op naast de afgeleide sleutel
- Stem parameters af op het langzaamste apparaat dat je moet ondersteunen voordat je ze in productie gebruikt
