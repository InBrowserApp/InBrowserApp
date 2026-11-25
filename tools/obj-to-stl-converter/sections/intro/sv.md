## Konvertera en Wavefront OBJ-fil till STL

Välj **Öppna fil** eller dra en `.obj`-fil till konverteraren. Välj **Prova ett exempel** för att först konvertera ett litet monteringsbeslag. Konverteraren delar upp polygonerna i trianglar. Välj sedan **Ladda ner STL** för att spara en binär `.stl`-fil. Konverteringen sker på din enhet.

## Det som ändras vid export till STL

STL lagrar en yta uppbyggd av trianglar. Material, texturbilder, UV-koordinater samt fristående linjer och punkter utelämnas. De ursprungliga koordinaterna och axlarna behålls. Välj avsedd måttenhet i slicerprogrammet före utskrift. Ett mått på 40 koordinatenheter i OBJ-filen blir till exempel 40 koordinatenheter i STL-filen.

Det går att konvertera en fil även om nätet har hål eller andra geometriska problem. Kontrollera resultatet i ditt slicerprogram före utskrift.

## Visa resultatet eller konvertera tillbaka

Öppna den nedladdade filen i [STL-visaren](../stl-viewer/) eller granska originalet i [OBJ-visaren](../obj-viewer/) tillsammans med eventuella material som du lägger till. Använd [STL till OBJ-konverteraren](../stl-to-obj-converter/) för att konvertera i motsatt riktning.
