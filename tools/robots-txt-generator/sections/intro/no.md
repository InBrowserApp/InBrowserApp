## Hva er en robots.txt-generator?

En robots.txt-generator hjelper deg med å lage den enkle tekstfilen som forteller crawlere hvilke deler av nettstedet de kan gjennomsøke. Den kombinerer user-agent-grupper, allow/disallow-regler, sitemap-lenker og valgfrie direktiver i en robots.txt-fil som er klar til å publiseres i rotmappen på nettstedet.

## Hva kan du konfigurere?

Med dette verktøyet kan du lage separate regelgrupper for ulike crawlere, bruke vanlige forhåndsinnstillinger, legge til én eller flere sitemap-URL-er og eventuelt angi Host eller Crawl-delay når målcrawlerne støtter det. Dette er nyttig når du vil ha brede regler for alle boter og strengere regler for stier som /admin/ eller andre områder med lav verdi.

## Hvordan bør du publisere filen?

Gå gjennom den genererte utdataen, lagre den som robots.txt og last den opp til toppnivået på domenet ditt, for eksempel https://example.com/robots.txt. Etter publisering bør du teste filen med Search Console eller crawlerverktøy og bekrefte at stiene og sitemap-URL-ene samsvarer med strukturen på det levende nettstedet.

## Hva er begrensningene?

robots.txt er en crawl-instruksjon, ikke et tilgangskontrollsystem. Den kan veilede veloppdragne crawlere, men den beskytter ikke privat innhold og blokkerer ikke direkte forespørsler. Sensitive sider bør derfor fortsatt beskyttes med autentisering eller autorisasjon på serversiden.
