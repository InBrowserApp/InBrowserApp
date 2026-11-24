## Konvertera en BPMN 2.0-fil till PDF

1. Dra en `.bpmn`- eller `.xml`-fil till konverteraren eller välj **Öppna BPMN-fil**. Välj **Prova ett exempel** om du vill se resultatet med en godkännandeprocess först.
2. Kontrollera förhandsvisningen och välj **Diagrammets originalstorlek**, **A4** eller **US Letter** under **Sidstorlek för PDF**.
3. Välj **Ladda ned PDF**. PDF-filen behåller källfilens namn och innehåller hela processen, även om du har zoomat in på en del av förhandsvisningen.

## Välj PDF-format för delning eller utskrift

Diagrammets originalstorlek passar när du delar ett stort processdiagram för visning på skärm. Välj A4 eller US Letter för att anpassa det till ett ark med marginaler. Konverteraren väljer stående eller liggande orientering efter diagrammets form. Granska de minsta etiketterna innan du skriver ut ett tätt processdiagram på ett enda ark.

PDF-filen sparar former och förbindelser som vektorer, så att de förblir skarpa när du zoomar. Välj **Ladda ned SVG** om du vill bädda in diagrammet på en webbsida eller redigera det i en vektorredigerare. Spara BPMN-filen om du behöver ändra processen i modelleringsverktyget.

Etiketterna sparas som vektorkonturer. Använd källfilen om du vill kopiera eller redigera etiketternas text.

## Öppna BPMN-XML med diagramlayout

Konverteraren använder BPMN Diagram Interchange-data för att placera aktiviteter, banor, händelser och förbindelser. Om XML-filen bara beskriver processen öppnar du filen i modelleringsverktyget och exporterar den igen med diagramlayouten. XML i andra format, till exempel en ursprunglig draw.io-fil, behöver först exporteras som BPMN 2.0 med layoutdata.

Filen läses och konverteras lokalt i webbläsaren. Använd [BPMN-visaren](../bpmn-viewer/) för att granska processen och navigera i diagrammet.
