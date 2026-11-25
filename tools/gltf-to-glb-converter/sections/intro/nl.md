## Een glTF-model naar één GLB-bestand converteren

Kies **Bestanden openen** om het `.gltf`-model samen met de bijbehorende `.bin`-buffers en texturen te selecteren. Gebruik **Map openen** als de texturen in submappen staan, zodat de converter de paden in het model kan volgen. Je kunt ook glTF-bestanden met ingesloten gegevens openen. Kies **Voorbeeld proberen** om een geanimeerde piramide te bundelen en klik daarna op **GLB downloaden**. Je browser verwerkt de bestanden op je apparaat.

## Een ontbrekende buffer of textuur toevoegen

Een `.gltf`-bestand in JSON-formaat kan verwijzen naar bestanden zoals `model.bin` of `textures/albedo.png`. De converter geeft een lijst met ontbrekende paden. Kies **Bestanden toevoegen** om ontbrekende bestanden aan te vullen terwijl het model geopend blijft. Behoud de oorspronkelijke bestandsnamen. Hebben bestanden in verschillende mappen dezelfde naam, selecteer dan de map met het model en de bijbehorende bestanden. Zo kan de converter de paden onderscheiden.

## Het GLB-bestand delen en bekijken

Het GLB-bestand sluit de geometrie, ondersteunde texturen en andere standaardgegevens in waarnaar het model verwijst. Netten, materialen en animatieclips blijven behouden. De oorspronkelijke textuurcodering en netcompressie blijven intact, dus de toepassing waarin je het resultaat opent moet die formaten ondersteunen. PNG- en JPEG-texturen werken in de meeste glTF-toepassingen. Open alleen het gedownloade bestand in de [GLB- en glTF-viewer](../gltf-viewer/) om de afmetingen, materialen en animatie te bekijken. [glTF 2.0-bestandsformaat](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)
