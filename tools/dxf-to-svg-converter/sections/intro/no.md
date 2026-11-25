## Konverter en DXF-tegning til SVG

Velg **Åpne DXF-fil**, eller slipp en ASCII-tegning med filendelsen `.dxf`. Velg **Prøv et eksempel** for å laste inn en monteringsbrakett med profil, borehull, senterlinjer og etiketter. Verktøyet leser tegningen i nettleseren og viser en forhåndsvisning av vektorgrafikken. Velg **Last ned SVG** for å lagre den valgte geometrien fra modellområdet som en frittstående SVG-fil.

## Velg hvilke lag som skal eksporteres

Velg lagene du vil ha under **Lag**. Forhåndsvisningen oppdateres når du tar med eller utelater et lag. Eksporter for eksempel ytterkonturen og hullene til en illustrasjon, eller ta med senterlinjene og etikettene for en visning med merknader. SVG-filen lagrer de valgte lagene som separate vektorgrupper.

## Behold tegningens målestokk

Hvis DXF-filen angir en lengdeenhet som millimeter eller tommer, lagrer SVG-filen de fysiske målene i millimeter. Geometrien beholder den opprinnelige målestokken i filen. For DXF-tegninger uten angitt måleenhet bruker viewBox i SVG-filen tegningens koordinater. Forhåndsvisningen tilpasses plassen på skjermen. [Variabler i DXF-filhodet](https://help.autodesk.com/cloudhelp/2018/ENU/AutoCAD-DXF/files/GUID-A85E8E67-27CD-4C59-BE61-4DC9FADBE74A.htm)

## Eksporter geometri fra modellområdet

Konvertereren eksporterer linjer, polylinjer, buer, sirkler, blokker og tekst som støttes. Kurver tegnes med vektorsegmenter. Tekst som støttes, blir til vektorkonturer ved hjelp av tilgjengelige skrifttyper. Flytt geometri fra oppsettark til modellområdet før du eksporterer DXF-filen. I [DXF-viseren](../dxf-viewer/) kan du panorere, zoome og slå lag av eller på.
