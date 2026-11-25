## Online een STL-bestand repareren

Kies **Bestand openen** of sleep een ASCII- of binair `.stl`-bestand naar het gereedschap. De reparatie gebeurt op je apparaat. Kies **Voorbeeld proberen** om een klein net met dubbele vlakken, vlakken zonder oppervlakte en omgekeerde vlakken te bekijken. Vergelijk de resultaten en kies **STL downloaden** om een nieuw bestand met dezelfde grootte en coördinaten op te slaan. Het bestand wordt in ASCII-formaat opgeslagen als binair STL de oorspronkelijke coördinaten zou afronden.

## Wat de netreparatie wijzigt

Het gereedschap verwijdert exact dubbele driehoeken en driehoeken zonder oppervlakte. Het vergelijkt de oriëntatie van aangrenzende vlakken. Als beide richtingen een consistente oriëntatie geven, kiest het de richting waarvoor minder vlakken hoeven te worden omgekeerd. De hoekpunten blijven op hun oorspronkelijke plaats. Open randen, onduidelijke oriëntaties en non-manifold verbindingen kunnen handmatige reparatie vereisen. Gaten, bijna samenvallende hoekpunten en doorsnijdingen blijven behouden. [Veelvoorkomende netproblemen bij 3D-printen](https://help.prusa3d.com/article/corrupted-3d-models-for-printing_2205)

## De topologie vóór en na de reparatie vergelijken

Controleer het aantal driehoeken, dubbele vlakken en gedegenereerde vlakken. Het rapport toont ook resterende randen met inconsistent georiënteerde vlakken, open grenzen en non-manifold randen en hoekpunten. Open het gedownloade bestand in de [STL-viewer](../stl-viewer/) om het in 3D te bekijken. Gebruik [Volume en topologie van 3D-netten controleren](../mesh-inspector/) voor de oppervlakte of het ingesloten volume. In het STL-rapport verschijnt **STL repareren** als de controle dubbele of gedegenereerde vlakken of een inconsistente oriëntatie vindt.
