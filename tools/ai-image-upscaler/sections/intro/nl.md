## Hoe vergroot je een afbeelding met AI?

1. Kies een JPG-, PNG- of WebP-afbeelding of sleep er een naar het vak. Gebruik de beste versie die je hebt, ook als die klein is.
2. Kies **2×** of **4×** en controleer de nieuwe afmetingen. Een afbeelding van 400 × 300 pixels wordt 800 × 600 bij 2× of 1600 × 1200 bij 4×.
3. Klik op **Afbeelding vergroten** en versleep de schuifregelaar om randen en texturen te vergelijken. Download het resultaat als verliesvrij PNG-bestand.

## Wat is superresolutie met AI?

Superresolutie vergroot het aantal pixels in een afbeelding met een lage resolutie. InBrowser.App gebruikt Real-ESRGAN, een getraind model dat fijnere randen en texturen afleidt uit de beschikbare pixels. Zo kunnen kleine foto's, illustraties en gecomprimeerde webafbeeldingen er scherper uitzien als je ze opschaalt. Controleer gezichten, kleine tekst en fijne patronen in het voorbeeld. De berekende details kunnen afwijken van het oorspronkelijke beeld.

## Wanneer kies je voor 2× of 4×?

Kies 2× voor een bescheiden vergroting, bijvoorbeeld als je een miniatuur in een grotere lay-out wilt gebruiken. Kies 4× als de afbeelding veel groter moet worden, bijvoorbeeld als je een kleine scan groter wilt weergeven. Verdubbel je de breedte en de hoogte, dan krijg je vier keer zoveel pixels. Verviervoudig je beide, dan worden het er zestien keer zoveel. De oorspronkelijke afbeelding mag maximaal 2.048 pixels per zijde en in totaal maximaal 1 megapixel zijn.

## Wordt de afbeelding op mijn apparaat vergroot?

Ja. Je browser downloadt het Real-ESRGAN-model zodra je voor het eerst een afbeelding vergroot. De verwerking gebeurt op je apparaat, via WebGPU als dat beschikbaar is. De browser kan ook de processor gebruiken via WebAssembly. De eerste keer kan het langer duren. De verwerkingstijd hangt af van de afmetingen van de afbeelding en je apparaat. Je afbeelding blijft de hele tijd op je apparaat.
