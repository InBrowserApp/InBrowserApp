## Wat is Argon2-verificatie?

Argon2-verificatie controleert of een wachtwoord in platte tekst dezelfde gecodeerde Argon2-hash oplevert die eerder is opgeslagen. De gecodeerde hash bevat de Argon2-variant, kostenparameters, salt en digest, zodat een verifier hetzelfde werk kan herhalen zonder aparte instellingen nodig te hebben.

## Wanneer gebruik je deze tool?

- Bevestigen dat een gekopieerd wachtwoord en een opgeslagen Argon2-hash bij elkaar horen
- Inlog- of migratieproblemen debuggen wanneer wachtwoordrecords tussen systemen worden verplaatst
- De variant en kostenparameters in een gecodeerde Argon2-hash inspecteren
- Hashes testen die een optionele server-side secret gebruiken, vaak een pepper genoemd

## Veilig verifiëren

1. Plak het wachtwoord dat je wilt controleren.
2. Plak de volledige gecodeerde hash, zoals een tekenreeks die begint met `$argon2id$`.
3. Voer de secret alleen in als de oorspronkelijke hash ermee is gemaakt.
4. Voer de verificatie uit en lees het resultaat: match, mismatch of ongeldige hash.

## Beveiligingsnotities

Verificatie gebeurt lokaal in je browser, maar geplakte wachtwoorden en hashes kunnen nog steeds in het browsergeheugen blijven staan totdat je het formulier reset of het tabblad sluit. Vermijd productiegegevens op gedeelde apparaten. Voor nieuwe systemen voor wachtwoordopslag is Argon2id meestal de voorkeursvariant van Argon2, omdat die side-channel- en GPU-bestendigheid in balans brengt.
