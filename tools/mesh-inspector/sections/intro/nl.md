## Online een STL- of OBJ-net controleren

Kies **Bestand openen** of sleep een `.stl`- of `.obj`-model naar het hulpmiddel. De tool leest het net op je apparaat en toont de oppervlakte, het ingesloten volume en eventuele topologieproblemen. Kies **Voorbeeld proberen** om een gesloten montagebeugel te controleren voordat je je eigen bestand opent.

## Oppervlakte en volume aflezen

STL en OBJ leggen geen vaste fysieke eenheid voor de coördinaten vast. Kies bij **Eenheid van de coördinaten** de eenheid waarin je het model hebt geëxporteerd. De resultaten staan respectievelijk in vierkante en kubieke eenheden. De keuze geeft de opgeslagen coördinaten een eenheidslabel. De getallen zelf blijven gelijk. De voorbeeldbeugel heeft een volume van 16.016 mm³ als de coördinaten millimeters voorstellen.

Als het net de topologiecontroles doorstaat, berekent de tool het volume op basis van de oriëntatie van de vlakken. Oppervlakken die zichzelf snijden en verkeerd georiënteerde of overlappende schillen kunnen die schatting nog beïnvloeden. Vergelijk belangrijke resultaten met het oorspronkelijke volumemodel.

## De topologieresultaten begrijpen

- Een **grensrand** hoort bij één driehoek. Grensranden volgen de open randen van het net, bijvoorbeeld rond gaten.
- Een **non-manifold rand** wordt gedeeld door meer dan twee driehoeken. Bij een **non-manifold hoekpunt** komen groepen vlakken die onderling losstaan samen in hetzelfde hoekpunt.
- Bij **inconsistente oriëntatie** volgen twee driehoeken hun gedeelde rand in dezelfde richting. Correct georiënteerde aangrenzende vlakken volgen die rand in tegengestelde richtingen.
- **Gedegenereerde vlakken** hebben geen oppervlakte. **Dubbele vlakken** herhalen dezelfde driehoek.

De controle telt exact samenvallende posities als één hoekpunt. De schillen worden geteld op basis van de randen die hun driehoeken delen. Bij een topologiefout toont de tool nog steeds de oppervlakte en het aantal problemen. Aan die aantallen zie je wat je moet herstellen voordat je het volume gebruikt.

## Het model bekijken of converteren

Bekijk het model in 3D of als draadmodel met de [STL-viewer](../stl-viewer/) of de [OBJ-viewer](../obj-viewer/). Gebruik de [OBJ naar STL-converter](../obj-to-stl-converter/) als de volgende toepassing een STL-bestand verwacht.
