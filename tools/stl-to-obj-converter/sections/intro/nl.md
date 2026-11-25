## Een STL-bestand naar Wavefront OBJ converteren

Kies **Bestand openen** of sleep een `.stl`-bestand naar de converter. De converter leest ASCII- en binaire STL-bestanden en maakt in je browser een `.obj`-download klaar. Kies **Voorbeeld proberen** om eerst een kleine montagebeugel te converteren. Kies daarna **OBJ downloaden** om het bestand op te slaan.

## Bekijken wat het OBJ-bestand bevat

De converter schrijft de oorspronkelijke oppervlaktedriehoeken naar een Wavefront OBJ-bestand. Hoekpunten op exact dezelfde positie krijgen dezelfde OBJ-index. Daardoor kun je het net makkelijker bewerken. De coördinaatassen en de schaal van het net blijven behouden. STL slaat standaard geen maateenheid op. Een rand van 40 eenheden in het bronbestand blijft in het OBJ-bestand 40 coördinaateenheden lang. Kies daarom bij het importeren in een andere toepassing de bedoelde eenheid.

De download bevat de geometrie van het net. Standaard-STL slaat geen materiaalbibliotheken of texturen op, dus die zitten ook niet in het OBJ-bestand.

## Het resultaat bekijken of terug converteren

Open het gedownloade bestand in de [OBJ-viewer](../obj-viewer/) om het resultaat te bekijken. Open het bronbestand in de [STL-viewer](../stl-viewer/) of gebruik de [OBJ naar STL-converter](../obj-to-stl-converter/) om in de andere richting te converteren.
