## Een STL-bestand naar 3MF converteren

Kies de **Eenheid van de STL-coördinaten** en klik op **Bestand openen** of sleep een `.stl`-bestand naar de converter. Je kunt ASCII- en binaire STL-bestanden openen. Kies **Voorbeeld proberen** om een montagebeugel te converteren en **3MF downloaden** om het model op te slaan. Wanneer je de eenheid wijzigt, wordt het huidige bestand opnieuw geconverteerd.

## De juiste afmetingen voor een slicer kiezen

STL slaat coördinaten zonder maateenheid op. Kies de eenheid die voor het bronbestand is gebruikt. Een onderdeel dat 2 STL-coördinaateenheden breed is, is bijvoorbeeld 2 inch breed als je inch kiest of 2 millimeter breed als je millimeter kiest. Het 3MF-bestand slaat die eenheid expliciet op, zodat een compatibele slicer het model op de bedoelde grootte kan openen.

## Het 3MF-model controleren of terug converteren

Het 3MF-bestand bevat de oorspronkelijke driehoeken. Als het net een gesloten volume vormt met consistent georiënteerde vlakken, slaat de converter het op als een solide model. Open of inconsistente netten worden als oppervlakken opgeslagen. Materialen en printinstellingen bepaal je in de slicer. Controleer de afmetingen in de [3MF-viewer](../3mf-viewer/) of bekijk het origineel in de [STL-viewer](../stl-viewer/). Gebruik [Volume en topologie van 3D-netten controleren](../mesh-inspector/) om gaten of andere topologieproblemen in het oorspronkelijke net te onderzoeken. Gebruik voor de omgekeerde richting de [3MF naar STL-converter](../3mf-to-stl-converter/). [Over het 3MF-formaat](https://3mf.io/resources/faq/)
