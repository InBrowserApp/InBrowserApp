## Konverter en Wavefront OBJ-fil til STL

Velg **Åpne fil**, eller dra en `.obj`-fil inn i konvertereren. Velg **Prøv et eksempel** for å konvertere en liten monteringsbrakett først. Verktøyet deler polygonflatene inn i trekanter. Velg deretter **Last ned STL** for å lagre en binær `.stl`-fil. Konverteringen skjer på enheten din.

## Hva som endres ved eksport til STL

STL lagrer en overflate som består av trekanter. Materialer, teksturbilder, UV-koordinater og frittstående linjer og punkter blir utelatt. Konvertereren beholder aksene og målestokken. Binær STL lagrer koordinater som 32-bits flyttall. Ved svært store koordinatverdier kan de minste detaljene forsvinne ved avrunding. Velg den tiltenkte måleenheten i slicerprogrammet før utskrift. En avstand på 40 koordinatenheter i OBJ-filen tilsvarer for eksempel 40 koordinatenheter i STL-filen.

En fil kan konverteres selv om nettet har hull eller andre geometriske problemer. Sjekk resultatet i slicerprogrammet før du skriver ut.

## Se resultatet eller konverter tilbake

Åpne den nedlastede filen i [STL-viseren](../stl-viewer/), eller sjekk originalen og eventuelle materialer du legger til, i [OBJ-viseren](../obj-viewer/). Bruk [STL til OBJ-konvertereren](../stl-to-obj-converter/) for å konvertere motsatt vei.
