## När ska jag använda BibTeX, RIS eller CSL JSON?

Välj ett format som programmet du ska använda kan importera.

- **BibTeX (`.bib`)** är ett vanligt val för LaTeX-projekt i Overleaf eller i en lokal redigerare.
- **RIS (`.ris`)** är praktiskt när du vill överföra referenser från en databas eller en annan referenshanterare till Zotero eller EndNote.
- **CSL JSON (`.json`)** innehåller strukturerade referensdata för citeringsprogram och andra verktyg som hanterar data för Citation Style Language.

## Hur konverterar och kontrollerar jag mina referenser?

Klistra in referenserna eller välj **Öppna fil**. Låt **Indataformat** stå på **Identifiera automatiskt** eller välj format själv om det inte känns igen. Välj **Utdataformat** och sedan **Konvertera och kontrollera**. Kopiera därefter resultatet eller ladda ned filen. Konverteringen sker i webbläsaren.

Du kan exempelvis öppna en RIS-export från Zotero, välja BibTeX och ladda ned en `.bib`-fil till ditt Overleaf-projekt. Om du bara har en formaterad referenslista som du kopierat från Word, exportera först referensposterna från den referenshanterare som skapade listan. Följ [Zoteros importguide](https://www.zotero.org/support/kb/importing_standardized_formats) för att importera den konverterade filen till Zotero.

## Vad betyder en möjlig dubblett?

Rapporten grupperar poster med samma DOI, även om den är skriven som en `doi.org`-länk. Om en DOI saknas kan rapporten också hitta poster med samma titel och utgivningsår och med samma efternamn och förnamnsinitial hos försteförfattaren. Postnumren följer ordningen i indata. Välj **Ladda exempel** för att se hur två poster för samma artikel visas i rapporten. Granska varje grupp innan du slår ihop poster i din referenshanterare. Den nedladdade filen innehåller alla poster.

## Vilka fält följer med?

Vanliga fält som titel, författare, utgivningsår och DOI följer oftast med vid konverteringen. Anpassade fält kan utelämnas, och en ny BibTeX-fil kan få andra citeringsnycklar för att undvika konflikter. Behåll den ursprungliga exporten om du behöver de uppgifterna. För att leta efter möjliga dubbletter och behålla de ursprungliga fälten väljer du samma format för indata och utdata.
