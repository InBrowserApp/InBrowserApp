## Konvertera en STEP- eller STP-fil till STL

Välj **Öppna fil** eller dra en `.step`- eller `.stp`-fil till konverteraren. Den delar in CAD-ytorna i trianglar på din enhet och förbereder en binär STL-fil för nedladdning. Välj **Prova ett exempel** för att konvertera ett monteringsbeslag. Välj sedan **Ladda ner STL** för att spara resultatet.

## Behåll rätt storlek vid 3D-utskrift

STEP innehåller fysiska mått. Konverteraren exporterar koordinaterna i millimeter, även positionen för varje del i en sammanställning. STL lagrar ingen måttenhet. Välj millimeter när du öppnar resultatet i ditt slicerprogram. En kant som mäter en tum i STEP-filen är till exempel 25,4 koordinatenheter lång i STL-filen.

## Kontrollera det exporterade nätet

STL-filen innehåller delarnas triangulerade ytor i de positioner de har i sammanställningen. Använd STEP om du behöver redigerbara CAD-ytor, komponentnamn eller sammanställningens struktur. Granska STL-filen i [STL-visaren](../stl-viewer/) eller mät den inneslutna volymen och kontrollera topologin med [Kontrollera nätets volym och topologi](../mesh-inspector/).

## Granska eller exportera originalmodellen

Använd [STEP-visaren](../step-viewer/) för att granska måtten, rotera CAD-modellen och exportera till STL direkt från verktygsfältet. Om ditt slicerprogram kan importera STEP kan du öppna originalet och välja nätinställningarna där. [Filformat som stöds av PrusaSlicer](https://help.prusa3d.com/article/supported-file-formats_1772)
