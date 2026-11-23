## Geanimeerde WebP omzetten naar GIF

Geanimeerde WebP slaat meerdere frames op in één `.webp`-bestand. Zet het om naar
GIF als een chatapp, documentatiesite of andere bestemming GIF vereist voor
animaties. Je kunt zowel verlieslatend als verliesvrij gecomprimeerde WebP-animaties
omzetten. De verwerking gebeurt op je apparaat.

### Zo zet je geanimeerde WebP om naar GIF

1. Kies **Bestand kiezen** of sleep een geanimeerde WebP naar de tool.
2. Kies **GIF maken** om de frames met hun oorspronkelijke afmetingen om te zetten.
3. Kies **Afspelen** om de GIF te controleren en sla hem op met **GIF downloaden**.

### Wat gebeurt er met de weergaveduur en het aantal afspeelbeurten?

Elk frame behoudt zijn eigen weergaveduur, afgerond op de stappen van 10 ms van
GIF en met een minimum van 20 ms. Een frame van 100 ms gevolgd door een frame
van 250 ms behoudt bijvoorbeeld beide waarden. Als de WebP een vast aantal
afspeelbeurten heeft, neemt de GIF dat aantal over. Een WebP die eindeloos
afspeelt, levert ook een eindeloos afspelende GIF op.

### Hoe gaat GIF om met transparantie en kleur?

GIF gebruikt een geïndexeerd palet van maximaal 256 kleuren per frame met één
paletpositie voor transparantie. WebP kan gedeeltelijke transparantie opslaan.
Daardoor kunnen doorschijnende schaduwen en gladgemaakte randen er in de GIF
anders uitzien. In kleurrijke frames kunnen ook banden in het kleurverloop
zichtbaar worden. Controleer de voorvertoning tegen de achtergrond die je
wilt gebruiken.

### Veelgestelde vragen

#### Kan ik een stilstaande WebP omzetten?

Deze tool vereist animatieframes. Zowel stilstaande als geanimeerde beelden
hebben de extensie `.webp`. Wil je van meerdere stilstaande afbeeldingen een
animatie maken? Gebruik dan de [GIF-maker](/nl/tools/gif-maker/).

#### Waarom is de GIF groter dan de WebP?

WebP comprimeert kleuren en gebieden die per frame veranderen efficiënt. Een
GIF kan bij gelijke afmetingen en weergaveduur toch groter zijn. Controleer
de uitvoergrootte bij de voorvertoning als er een uploadlimiet geldt.

### Andere animatietools

Gebruik [GIF naar geanimeerde WebP](/nl/tools/gif-to-animated-webp-converter/)
om in de andere richting te converteren, of
[APNG naar GIF](/nl/tools/apng-to-gif-converter/) voor een geanimeerde PNG als bronbestand.
