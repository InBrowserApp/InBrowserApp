## Öppna en GLB- eller glTF-modell online

Välj **Öppna filer** eller dra modellen till visaren. En `.glb`-fil lagrar en glTF-scen i en binär behållare och innehåller ofta både geometri och texturer i samma fil. En `.gltf`-fil beskriver scenen i JSON och kan hänvisa till tillhörande filer. Om exporten innehåller filer som `model.bin` och `albedo.png`, välj dem tillsammans med `model.gltf`. Visaren läser filerna på din enhet.

## Granska material och spela upp animationer

Dra för att rotera, rulla eller nyp för att zooma och välj **Visa hela modellen** för att se hela scenen igen. Slå på **Trådram** för att granska trianglarna under materialen. Om filen innehåller animationsklipp väljer du ett klipp och sedan **Spela upp animation**. Välj **Prova ett exempel** för att öppna ett animerat exempel.

## Öppna en modell vars tillhörande filer saknas

När modellen hänvisar till en extern buffert eller bild väljer du modellen och motsvarande filer samtidigt. Behåll de ursprungliga filnamnen. Om modellen använder ett tillägg för texturkomprimering som visaren inte stöder, exportera den på nytt med PNG- eller JPEG-texturer. I [glTF 2.0-specifikationen](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) finns mer information om båda filformaten.

## Visa närliggande 3D-filformat

Använd [OBJ-visaren](../obj-viewer/) för Wavefront-nät med MTL-material eller [STL-visaren](../stl-viewer/) för att granska ett triangelnät före 3D-utskrift.
