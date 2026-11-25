## Konvertera en glTF-modell till en enda GLB-fil

Välj **Öppna filer** för att välja `.gltf`-modellen tillsammans med dess `.bin`-buffertar och texturer. Om texturerna ligger i undermappar använder du **Öppna mapp**, så att konverteraren kan följa sökvägarna i modellen. Du kan också öppna glTF-filer med redan inbäddade data. Välj **Prova ett exempel** för att paketera en animerad pyramid och välj sedan **Ladda ner GLB**. Filerna bearbetas i webbläsaren.

## Lägg till en buffertfil eller textur som saknas

En `.gltf`-fil i JSON-format kan hänvisa till resurser som `model.bin` eller `textures/albedo.png`. Konverteraren listar sökvägarna till de resurser som saknas. Välj **Lägg till filer** för att komplettera med filerna medan modellen är öppen. Behåll de ursprungliga filnamnen. Om filer i olika mappar har samma namn väljer du mappen som innehåller modellen och de filer den hänvisar till, så att konverteraren kan använda deras sökvägar.

## Dela och granska GLB-filen

GLB-filen bäddar in geometri, texturer som stöds och andra standarddata som modellen hänvisar till. Nät, material och animationsklipp följer med. Paketeringen behåller texturernas kodning och nätens komprimering, så programmet som öppnar filen behöver stöd för de formaten. PNG- och JPEG-texturer fungerar med flest glTF-program. Öppna den nedladdade filen utan tillhörande filer i [GLB- och glTF-visaren](../gltf-viewer/) för att granska storlek, material och animation. [Filformatet glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
