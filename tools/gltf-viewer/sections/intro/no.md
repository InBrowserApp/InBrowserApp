## Åpne en GLB- eller glTF-modell på nett

Velg **Åpne filer**, eller dra modellen inn i viseren. En `.glb`-fil pakker en glTF-scene i en binær beholder og inneholder ofte både geometri og teksturer i én fil. En `.gltf`-fil beskriver scenen i JSON og kan vise til tilhørende filer. Hvis eksporten inneholder filer som `model.bin` og `albedo.png`, velger du dem sammen med `model.gltf`. Viseren leser filene på enheten din.

## Se på materialer og spill av animasjoner

Dra for å rotere, og rull eller knip for å zoome. Velg **Vis hele modellen** for å få hele scenen inn i bildet igjen. Slå på **Trådmodell** for å se trekantene under materialene. Hvis filen inneholder animasjonsklipp, velger du et klipp og trykker **Spill av animasjon**. Velg **Prøv et eksempel** for å åpne en animert modell.

## Åpne en modell med manglende filer

Hvis modellen viser til en ekstern buffer eller bildefil, velger du modellen og de tilhørende filene samtidig. Behold de opprinnelige filnavnene. Hvis modellen bruker en utvidelse for teksturkomprimering som viseren ikke støtter, eksporterer du den på nytt med PNG- eller JPEG-teksturer. Se [glTF 2.0-spesifikasjonen](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) for detaljer om begge filformatene.

## Se andre 3D-filformater

Bruk [OBJ-viseren](../obj-viewer/) til Wavefront-nett med MTL-materialer, eller åpne et trekantnett i [STL-viseren](../stl-viewer/) for å sjekke det før 3D-utskrift.

- [3MF-viser](../3mf-viewer/)

Bruk [glTF til GLB-konvertereren](../gltf-to-glb-converter/) til å bygge inn bufferne og teksturene som en glTF-modell viser til, i én GLB-fil.
