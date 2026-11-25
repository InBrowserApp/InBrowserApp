## Konverter en STL-fil til 3MF

Velg **Måleenhet for STL-koordinater**, og velg deretter **Åpne fil** eller dra en `.stl`-fil inn i konvertereren. Den støtter STL-filer i både ASCII- og binærformat. Velg **Prøv et eksempel** for å konvertere en monteringsbrakett og **Last ned 3MF** for å lagre modellen. Hvis du endrer måleenheten, konverteres den gjeldende filen på nytt.

## Velg riktig størrelse for slicerprogrammet

STL lagrer koordinater uten måleenhet. Velg enheten som ble brukt i kildefilen. En del som er 2 STL-koordinatenheter bred, er for eksempel 2 tommer bred hvis du velger tommer, eller 2 millimeter bred hvis du velger millimeter. 3MF lagrer måleenheten, slik at et kompatibelt slicerprogram kan lese modellen med riktig størrelse.

## Sjekk 3MF-modellen eller konverter tilbake

3MF-filen inneholder de opprinnelige trekantene. Hvis nettet danner et lukket volum med konsekvent orienterte flater, lagrer konvertereren det som en solidmodell. Åpne eller inkonsekvente nett lagres som flater. Materialer og utskriftsinnstillinger velger du i slicerprogrammet. Sjekk målene i [3MF-viseren](../3mf-viewer/), eller se originalen i [STL-viseren](../stl-viewer/). Bruk [Sjekk volum og topologi i 3D-nett](../mesh-inspector/) hvis nettet har åpninger eller andre topologiproblemer. Bruk [3MF til STL-konvertereren](../3mf-to-stl-converter/) for å konvertere motsatt vei. [Om 3MF-formatet](https://3mf.io/resources/faq/)
