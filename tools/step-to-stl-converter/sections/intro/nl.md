## Een STEP- of STP-bestand naar STL converteren

Kies **Bestand openen** of sleep een `.step`- of `.stp`-bestand naar de converter. Die verdeelt de CAD-oppervlakken op je apparaat in driehoeken en maakt een binair STL-bestand klaar om te downloaden. Kies **Voorbeeld proberen** om eerst een montagebeugel te converteren en kies daarna **STL downloaden** om het resultaat op te slaan.

## De juiste afmetingen voor 3D-printen behouden

STEP bevat fysieke afmetingen. De converter exporteert coördinaten in millimeters, ook voor de plaatsing van elk onderdeel in een samenstelling. STL slaat geen maateenheid op. Kies daarom millimeters wanneer je het resultaat in een slicer opent. Een rand van één inch in STEP is bijvoorbeeld 25,4 coördinaateenheden lang in het STL-bestand.

## Het geëxporteerde driehoeksnet controleren

Het STL-bestand bevat de in driehoeken verdeelde oppervlakken van de onderdelen op hun positie in de samenstelling. Gebruik STEP als je bewerkbare CAD-oppervlakken, onderdeelnamen en de structuur van de samenstelling nodig hebt. Bekijk de STL in de [STL-viewer](../stl-viewer/) of controleer het ingesloten volume en de topologie met [Volume en topologie van 3D-netten controleren](../mesh-inspector/).

## Het oorspronkelijke model bekijken of exporteren

Gebruik de [STEP-viewer](../step-viewer/) om afmetingen te controleren, het CAD-model te draaien en rechtstreeks via de werkbalk als STL te exporteren. Als je slicer STEP ondersteunt, kun je het origineel openen en de instellingen voor het driehoeksnet in de slicer kiezen. [Door PrusaSlicer ondersteunde bestandsformaten](https://help.prusa3d.com/article/supported-file-formats_1772)
