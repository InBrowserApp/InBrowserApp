## Hva er UUID v3?

UUID v3 er et navnebasert UUID-format. Det tar en namespace-UUID og et navn,
hasher dem med MD5 og formaterer resultatet som en standard UUID. Den viktige
egenskapen er determinisme: samme namespace og navn produserer alltid samme
UUID.

Dette verktøyet kjører helt i nettleseren din. Namespace, navn og generert UUID
blir værende på enheten din med mindre du kopierer resultatet et annet sted.

## Når bør du bruke det

- Bruk UUID v3 når du trenger en stabil identifikator for et kjent navn, for
  eksempel et DNS-navn, en URL, en objektsti eller et brukernavn.
- Velg namespace-et som passer til typen navn du identifiserer. DNS og URL er de
  vanligste forhåndsvalgene.
- Bruk samme namespace konsekvent. Hvis du endrer namespace, endres alle
  genererte UUID-er, selv når navnet er det samme.
- Foretrekk UUID v5 eller en annen moderne identifikator når du kan velge og
  trenger en navnebasert UUID med en sterkere hash. UUID v3 finnes for
  kompatibilitet med systemer som spesifikt forventer MD5-baserte UUID-er.

## Merknader om sikkerhet

UUID v3 er ikke en tilfeldig ID og er ikke hemmelig. Alle som kjenner namespace
og navn, kan generere samme UUID på nytt. Ikke bruk det for passord,
sesjonstokener, API-nøkler eller andre verdier som må være uforutsigbare.
