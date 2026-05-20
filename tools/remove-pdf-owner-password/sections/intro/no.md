Fjern eierpassordbegrensninger fra en PDF direkte i nettleseren. Verktøyet oppretter en ny PDF som ikke lenger har tillatelsesflagg for redigering, utskrift, kopiering eller uttrekk av sider.

## Når du bør bruke det

Bruk det når du allerede har en PDF som åpnes normalt, men dokumentet blokkerer vanlige handlinger som utskrift, kopiering av tekst, redigering av sider eller sammensetting av sider i et annet PDF-verktøy. Dette er vanlig med skjemaer, eksporterte rapporter, gamle fakturaer og dokumenter opprettet med restriktive PDF-tillatelsesinnstillinger.

## Slik fungerer det

Last opp én PDF, se gjennom den valgte filen, og kjør deretter fjerningstrinnet. Verktøyet kjører qpdf i en nettleserarbeider med PDF-operasjonen `--decrypt` og returnerer en ny PDF-fil for nedlasting. Originalfilen forblir uendret, slik at du kan sammenligne eller forkaste utdataene hvis det ikke er versjonen du trenger.

## Personvern og begrensninger

PDF-en blir værende i denne nettleserøkten; den lastes ikke opp til en server. Dette verktøyet fjerner tillatelsesbegrensninger fra eierpassord i PDF-er som allerede kan åpnes. Det gjenoppretter ikke et tapt bruker-/åpningspassord, og det kan ikke låse opp skadede filer eller krypteringsmoduser som ikke støttes av qpdf-byggingen for nettleseren.
