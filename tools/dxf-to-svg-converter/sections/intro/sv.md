## Konvertera en DXF-ritning till SVG

Välj **Öppna DXF-fil** eller släpp en ASCII-ritning med ändelsen `.dxf`. Välj **Prova ett exempel** för att läsa in ett monteringsbeslag med profil, borrhål, centrumlinjer och beteckningar. Verktyget läser ritningen i webbläsaren och visar en vektorförhandsvisning. Välj **Ladda ner SVG** för att spara den valda geometrin från modellutrymmet som en fristående SVG-fil.

## Välj vilka lager som ska exporteras

Markera de lager du vill ha under **Lager**. Förhandsvisningen uppdateras när du lägger till eller utesluter ett lager. Exportera till exempel ytterkonturen och hålen till en illustration, eller inkludera centrumlinjerna och beteckningarna för att få en kommenterad vy. SVG-filen sparar de valda lagren som separata vektorgrupper.

## Behåll ritningens skala

När DXF-filen anger en längdenhet som millimeter eller tum sparar SVG-filen de fysiska måtten i millimeter. Geometrin behåller sin ursprungliga skala i filen. För DXF-ritningar utan angiven måttenhet använder SVG-filens viewBox ritningens koordinater. Förhandsvisningen anpassas till det tillgängliga utrymmet på skärmen. [Variabler i DXF-filhuvudet](https://help.autodesk.com/cloudhelp/2018/ENU/AutoCAD-DXF/files/GUID-A85E8E67-27CD-4C59-BE61-4DC9FADBE74A.htm)

## Exportera geometri från modellutrymmet

Konverteraren exporterar linjer, polylinjer, bågar, cirklar, block och text som stöds. Kurvor ritas med vektorsegment. Text som stöds omvandlas till vektorkonturer med tillgängliga teckensnitt. Spräng blockmatriser med rader och kolumner till enskilda blockreferenser i CAD-programmet innan du sparar DXF-filen. Flytta geometri från layoutblad till modellutrymmet innan du exporterar DXF-filen. I [DXF-visaren](../dxf-viewer/) kan du panorera, zooma och visa eller dölja lager.
