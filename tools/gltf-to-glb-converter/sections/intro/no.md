## Konverter en glTF-modell til én GLB-fil

Velg **Åpne filer** for å velge `.gltf`-modellen sammen med `.bin`-bufferne og teksturene som hører til. Hvis teksturene ligger i undermapper, bruker du **Åpne mappe** slik at konvertereren kan følge filbanene i modellen. Du kan også åpne glTF-filer med innebygde data. Velg **Prøv et eksempel** for å pakke en animert pyramide, og velg deretter **Last ned GLB**. Filene behandles i nettleseren din.

## Legg til en bufferfil eller tekstur som mangler

En `.gltf`-fil i JSON-format kan vise til ressurser som `model.bin` eller `textures/albedo.png`. Konvertereren viser filbanene til ressursene som mangler. Velg **Legg til filer** for å legge til filene mens modellen er åpen. Behold de opprinnelige filnavnene. Hvis filer i ulike mapper har samme navn, velger du mappen som inneholder modellen og filene den viser til, slik at konvertereren kan bruke filbanene.

## Del og sjekk GLB-filen

GLB-filen bygger inn geometri, teksturer den støtter og andre standarddata som modellen viser til. Nett, materialer og animasjonsklipp følger med. Pakking beholder den opprinnelige teksturkodingen og komprimeringen av nettet. Programmet som åpner filen, må derfor støtte de samme formatene. PNG- og JPEG-teksturer fungerer med flest glTF-programmer. Åpne den nedlastede filen alene i [GLB- og glTF-viseren](../gltf-viewer/) for å sjekke størrelse, materialer og animasjon. [Filformatet glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
