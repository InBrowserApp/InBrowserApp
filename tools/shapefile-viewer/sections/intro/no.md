## Slik åpner du en Shapefile

Dra et ZIP-arkiv som inneholder en Esri Shapefile, inn i viseren. Du kan også velge .shp-filen og de tilhørende filene sammen. Hvis ZIP-arkivet inneholder flere Shapefiler, bytter du mellom dem under **Lag**. Velg **Prøv et eksempel** for å utforske et datasett med to lag, ett med punkter og ett med polygoner. Nettleseren leser filene lokalt på enheten din.

## Hvilke Shapefile-filer trenger du?

.shp-filen inneholder geometrien og er nok til å vise et lag med geografiske koordinater. Ta med .dbf-filen for å se objektegenskapene, .prj-filen for koordinatreferansesystemet og .cpg-filen for tegnkodingen av egenskapsteksten hvis filene finnes. Filer som hører til samme lag, bør ligge sammen og ha samme navn før filendelsen. Du kan la .shx-indeksen ligge i ZIP-arkivet eller ta den med i filutvalget.

## Utforsk kartet og objektegenskapene

Kartet, som fungerer uten nett, tilpasser utsnittet til det aktive laget. Bruk kartkontrollene til å zoome eller vise hele laget igjen. Velg en geometri på kartet eller i listen **Objekter** for å se egenskapene. Ved hjelp av en .prj-fil som støttes, kan viseren konvertere projiserte koordinater slik at de kan brukes på kartet. Uten en slik fil tolkes koordinater innenfor gyldig område for lengde- og breddegrad som WGS 84. Hvis et lag bruker en kartprojeksjon, åpner du det på nytt sammen med .prj-filen for å plassere laget riktig.
