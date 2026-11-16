## Slik fungerer filtypegjenkjenning

Dette verktøyet leser opptil de første 64 KiB av en lokal fil og kontrollerer den
binære signaturen med [file-type](https://github.com/sindresorhus/file-type).
Resultatet inneholder en registrert MIME-type, forventede filendelser og en
forhåndsvisning av de første 256 bytene i heksadesimalt format og ASCII.
Ingenting lastes opp.

## Hvorfor en filendelse kan avvike

Når en fil får nytt navn, endres navnet, ikke innholdet. En PNG med navnet
photo.jpg har fortsatt en PNG-signatur. Vanlige alternative filendelser som
.jpg og .jpeg godtas. MIME-typen som nettleseren rapporterer, vises separat
fordi den ofte følger filnavnet i stedet for å undersøke bytene.

## Begrensninger ved gjenkjenning

Signaturer gir indikasjoner, ikke bevis på at en fil er gyldig eller trygg.
Tekstformater som TXT, CSV og SVG gjenkjennes kanskje ikke. Et kort utvalg kan
identifisere ZIP eller en annen container uten å bekrefte undertypen, for
eksempel et Office-dokument. Den heksadesimale forhåndsvisningen viser rått
filinnhold, ikke en kryptografisk kontrollsum.
