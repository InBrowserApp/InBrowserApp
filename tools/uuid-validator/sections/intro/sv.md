## Vad är en UUID-validator?

En UUID-validator kontrollerar om en identifierare är skriven i den standardiserade UUID-formen med 36 tecken, till exempel `6ba7b810-9dad-11d1-80b4-00c04fd430c8`. Den är användbar när du behöver verifiera ID:n som kopierats från loggar, API:er, databaser, testdata eller användarinmatning innan du förlitar dig på dem i kod.

### Indata som stöds

Det här verktyget validerar kanonisk UUID-text med fem hexadecimala grupper i layouten `8-4-4-4-12`. Versaler accepteras och normaliseras till gemener. nil UUID (`00000000-0000-0000-0000-000000000000`) och max UUID (`ffffffff-ffff-ffff-ffff-ffffffffffff`) behandlas som giltiga specialvärden.

### Valideringsdetaljer

För standard-UUID:er kontrollerar valideraren versionsnibbeln och variantbitarna. Version 1 till 8 känns igen, vilket omfattar äldre RFC 4122-UUID:er och nyare RFC 9562-layouter som UUID v6, v7 och v8. Resultatpanelen delar också upp UUID:t i dess fem segment så att du kan granska exakt vilka byte som valideras.

### Integritet

Valideringen körs helt i din webbläsare. UUID:t du klistrar in laddas inte upp, så verktyget är säkert att använda med interna identifierare, databasnycklar och exempel från produktionsloggar som ska stanna lokalt.
