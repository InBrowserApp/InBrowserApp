## Öppna en IGS- eller IGES-fil online

Välj **Öppna filer** eller dra en CAD-modell med ändelsen `.igs` eller `.iges` till visaren. Båda filändelserna betecknar utbytesformatet IGES. Välj **Prova ett exempel** för att utforska en detalj med avsatser. Visaren läser filen på din enhet.

## Granska modellens ytor i 3D

Dra för att rotera, rulla eller nyp för att zooma och dra med höger musknapp eller med två fingrar för att panorera. Välj **Visa hela modellen** för att få med hela modellen i vyn, **Trådram** för att se trianglarna som visas eller **Öppna helskärmsvyn** för mer utrymme. Visaren omvandlar de IGES-ytor som stöds till triangelnät för visning och använder de färger som följer med vid importen. Om IGES-filen bara innehåller kurvor kan du exportera ytor från CAD-programmet. [OpenCascades importfunktion för IGES](https://github.com/kovacsv/occt-import-js)

## Mät avstånd och byt måttenhet

**Yttermått** anger modellens utsträckning längs X-, Y- och Z-axlarna. Under **Måttenhet** växlar du mellan millimeter, meter och tum. Välj **Mät** och markera två punkter på de visade ytorna för att mäta avståndet i en rak linje. På krökta ytor är mätningen ungefärlig eftersom den utgår från de trianglar som visas. Kontrollera kritiska mått i den ursprungliga CAD-modellen.

## Spara en PNG-bild eller öppna en relaterad CAD-fil

Ställ in vinkel och zoom och välj sedan **Spara PNG** för att fånga den aktuella vyn till en ritningsgranskning eller tillverkningsanteckning. Öppna STEP- eller STP-versioner av CAD-detaljer och sammanställningar i [STEP-visaren](../step-viewer/).
