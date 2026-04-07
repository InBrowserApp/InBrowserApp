## Hva er Base64?

Base64 er nyttig når en tekstbasert kanal må frakte binærvennlige nyttelaster, som e-postinnhold, JSON-blobber eller små data URL-er. Det er et kodingslag, ikke et sikkerhetslag.

## Når du bør bruke det

- Rask feilsøking når et API returnerer eller forventer Base64-strenger.
- Konvertering av nettlesertekst til et trygt transportformat for logger eller nyttelaster.
- Sjekke om en innlimt Base64-blob dekodes til innholdet du forventer.

## Hva du bør huske på

- Base64 øker størrelsen med omtrent en tredjedel.
- Det krypterer eller skjuler ikke den opprinnelige verdien.
- Ugyldig utfylling eller ødelagt kopier-og-lim viser seg vanligvis som en dekodingsfeil.
