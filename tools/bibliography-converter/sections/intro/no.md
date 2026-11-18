## Når bør jeg bruke BibTeX, RIS eller CSL JSON?

Velg et format som programmet du skal bruke videre, kan importere.

- **BibTeX (`.bib`)** er et vanlig valg for LaTeX-prosjekter i Overleaf eller i et lokalt redigeringsprogram.
- **RIS (`.ris`)** passer når du vil overføre referanser fra en database eller et annet referanseverktøy til Zotero eller EndNote.
- **CSL JSON (`.json`)** inneholder strukturerte referansedata for siteringsprogrammer og andre verktøy som håndterer data for Citation Style Language.

## Hvordan konverterer og sjekker jeg referansene mine?

Lim inn referansene eller velg **Åpne fil**. La **Inndataformat** stå på **Gjenkjenn automatisk**, eller velg formatet selv hvis det ikke gjenkjennes. Velg **Utdataformat** og deretter **Konverter og sjekk**. Kopier resultatet eller last ned filen. Konverteringen skjer i nettleseren.

Du kan for eksempel åpne en RIS-eksport fra Zotero, velge BibTeX og laste ned en `.bib`-fil til Overleaf-prosjektet ditt. Hvis du bare har en formatert litteraturliste som er kopiert fra Word, må du først eksportere referanseoppføringene fra referanseverktøyet som opprettet listen. Se [Zoteros importveiledning](https://www.zotero.org/support/kb/importing_standardized_formats) for å importere den konverterte filen til Zotero.

## Hva betyr et mulig duplikat?

Rapporten grupperer oppføringer med samme DOI, også hvis DOI-en er skrevet som en `doi.org`-lenke. Hvis en DOI mangler, kan rapporten også finne oppføringer med samme tittel, utgivelsesår, etternavn og forbokstav i fornavnet til førsteforfatteren. Numrene viser rekkefølgen i inndataene. Velg **Last inn eksempel** for å se hvordan rapporten viser to oppføringer for samme artikkel. Sjekk hver gruppe før du slår sammen oppføringene i referanseverktøyet ditt. Den nedlastede filen inneholder alle oppføringene.

## Hvilke felt blir med?

Vanlige felt som tittel, forfattere, utgivelsesår og DOI blir som regel med ved konvertering. Egendefinerte felt kan bli utelatt, og en ny BibTeX-fil kan få andre siteringsnøkler for å unngå konflikter. Behold den opprinnelige eksporten hvis du trenger disse opplysningene. Velg samme inndata- og utdataformat for å se etter mulige duplikater og beholde de opprinnelige feltene.
