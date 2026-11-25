## Konverter en STEP- eller STP-fil til STL

Velg **Åpne fil**, eller dra en `.step`- eller `.stp`-fil inn i konvertereren. Den deler CAD-flatene inn i trekanter på enheten din og klargjør en binær STL-fil for nedlasting. Velg **Prøv et eksempel** for å konvertere en monteringsbrakett først. Velg deretter **Last ned STL** for å lagre resultatet.

## Behold riktig størrelse for 3D-utskrift

STEP inneholder fysiske mål. Konvertereren eksporterer koordinatene i millimeter, inkludert posisjonen til hver del i en sammenstilling. STL lagrer ingen måleenhet. Velg millimeter når du åpner resultatet i slicerprogrammet. En kant som måler én tomme i STEP-filen, er for eksempel 25,4 koordinatenheter lang i STL-filen.

## Sjekk det eksporterte trekantnettet

STL-filen inneholder de triangulerte overflatene til delene i posisjonene de har i sammenstillingen. Bruk STEP hvis du trenger redigerbare CAD-flater, komponentnavn eller strukturen til sammenstillingen. Sjekk STL-filen i [STL-viseren](../stl-viewer/), eller kontroller innelukket volum og topologi med [Sjekk volum og topologi i 3D-nett](../mesh-inspector/).

## Se på eller eksporter den opprinnelige modellen

Bruk [STEP-viseren](../step-viewer/) til å sjekke dimensjoner, rotere CAD-modellen og eksportere til STL direkte fra verktøylinjen. Hvis slicerprogrammet kan importere STEP, kan du åpne originalen og velge innstillingene for trekantnettet der. [Filformater som støttes av PrusaSlicer](https://help.prusa3d.com/article/supported-file-formats_1772)
