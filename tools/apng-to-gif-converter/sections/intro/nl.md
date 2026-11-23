## Geanimeerde PNG omzetten naar GIF

APNG slaat meerdere frames in één PNG-bestand op. Zet het om naar GIF voor
chatapps, forums of documentatie die GIF vereisen voor animaties. Geanimeerde
bestanden kunnen eindigen op `.apng` of `.png`. De converter leest de animatie
in het bestand en verwerkt die op je apparaat.

### Zo zet je APNG om naar GIF

1. Kies **Bestand kiezen** of sleep een geanimeerde PNG naar de tool.
2. Kies **GIF maken** om de frames met hun oorspronkelijke afmetingen om te zetten.
3. Kies **Afspelen** om de GIF te controleren en sla hem op met **GIF downloaden**.

### Wat gebeurt er met de weergaveduur en het aantal afspeelbeurten?

Elk frame behoudt zijn eigen weergaveduur, afgerond op de stappen van 10 ms van
GIF en met een minimum van 20 ms. Een frame van 100 ms gevolgd door een frame
van 250 ms behoudt bijvoorbeeld beide waarden. De GIF neemt het aantal
afspeelbeurten van het bronbestand over. De animatie speelt dus één keer,
meerdere keren of eindeloos af. Bij een eindige animatie ondersteunt GIF in
totaal maximaal 65.536 afspeelbeurten.

### Hoe gaat GIF om met transparantie en kleur?

APNG ondersteunt gedeeltelijke transparantie en frames in volledige kleur. GIF
gebruikt een geïndexeerd palet van maximaal 256 kleuren per frame met één
paletpositie voor transparantie. Zachte randen en schaduwen kunnen harder
ogen, en in vloeiende kleurverlopen kunnen banden zichtbaar worden.
Controleer de GIF-voorvertoning voordat je het bestand deelt. Als de bestemming
geanimeerde PNG ondersteunt, behoudt het bronbestand zijn volledige kleur en
gedeeltelijke transparantie.

### Veelgestelde vragen

#### Kan ik een gewone PNG omzetten?

Deze tool vereist animatiegegevens in het PNG-bestand. Ook een bestand met de
extensie `.png` kan geanimeerd zijn. Als de animatie een aparte vervangende
afbeelding bevat voor PNG-viewers die alleen stilstaande beelden tonen, begint
de GIF met het eerste frame van de animatie.

#### Is de GIF kleiner dan de APNG?

De bestandsgrootte hangt af van de afmetingen, het aantal frames en de
beelddetails. Een GIF kan groter zijn, vooral wanneer de APNG alleen kleine
gebieden opslaat die tussen de frames veranderen. Je ziet de uitvoergrootte
bij de GIF-voorvertoning.

### Andere animatietools

Gebruik [GIF naar APNG](/nl/tools/gif-to-apng-converter/) om in de andere
richting te converteren, of
[Geanimeerde WebP naar GIF](/nl/tools/animated-webp-to-gif-converter/) voor een WebP-bronbestand.
