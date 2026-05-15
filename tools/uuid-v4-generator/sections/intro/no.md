Generer en UUID v4 lokalt i nettleseren når du trenger en ny identifikator for testposter, databaserader, API-eksempler, hendelsesdata, fixtures eller konfigurasjonsfiler. Verktøyet lager én kanonisk UUID med små bokstaver om gangen, slik at det er fokusert på arbeidsflyten for én verdi uten å overlappe den separate bulkgeneratoren.

## Hva UUID v4 Betyr

En UUID v4 er en 128-biters identifikator der versjons- og variantbitene er faste, mens de resterende 122 bitene kommer fra tilfeldige data. Det gjør den nyttig når du trenger identifikatorer som ikke avslører opprettelsestid, maskininformasjon, sekvenstellere eller brukerdetaljer.

## Når Du Bør Bruke Den

Bruk UUID v4 for klientgenererte ID-er, mock-objekter, midlertidige poster, offentlige eksempler og distribuerte systemer der koordinering av en sentral teller ville vært tungvint. Den er et godt standardvalg når sorteringsrekkefølge ikke er viktig, og du bare trenger en identifikator med lav kollisjonsrisiko.

## Personvern Og Pålitelighet

Genereringen kjører i denne nettleserfanen med Web Crypto, så UUID-en sendes ikke til InBrowser.App eller en annen tjeneste. Kopier verdien når den ser riktig ut, og generer på nytt når du trenger en ny identifikator for neste post eller eksempel.
