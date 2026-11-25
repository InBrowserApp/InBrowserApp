## Konverter en STL-fil til Wavefront OBJ

Velg **Åpne fil**, eller dra en `.stl`-fil inn i konvertereren. Den leser STL-filer i både ASCII- og binærformat og klargjør en `.obj`-fil for nedlasting i nettleseren. Velg **Prøv et eksempel** for å konvertere en liten monteringsbrakett først. Velg deretter **Last ned OBJ** for å lagre filen.

## Sjekk hva OBJ-filen inneholder

Konvertereren skriver de opprinnelige trekantene fra overflaten til en Wavefront OBJ-fil. Koordinataksene og størrelsen på nettet beholdes. STL har ingen standardinnstilling for måleenhet. En kant som er 40 enheter lang i kildefilen, er fortsatt 40 koordinatenheter lang i OBJ-filen. Velg den tiltenkte måleenheten når du importerer filen i et annet program.

Filen du laster ned, inneholder nettets geometri. Materialbiblioteker og teksturer følger ikke med, siden slike opplysninger ikke inngår i standardformatet for STL.

## Se resultatet eller konverter tilbake

Åpne den nedlastede filen i [OBJ-viseren](../obj-viewer/) for å se resultatet. Bruk [STL-viseren](../stl-viewer/) til å åpne kildefilen eller [OBJ til STL-konvertereren](../obj-to-stl-converter/) til å konvertere motsatt vei.
