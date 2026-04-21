## Wat is een PRC Resident ID?

Het 18-cijferige PRC Resident ID bevat een adrescode, geboortedatum, volgnummer en controlecijfer. Deze validator controleert deze onderdelen offline en helpt om de structuur van het nummer te begrijpen.

### Hoe de validatie werkt

- Verwijdert spaties en koppeltekens en normaliseert het laatste teken naar een hoofdletter `X`
- Vereist precies 18 tekens: 17 cijfers plus een laatste cijfer of `X`
- Vergelijkt de eerste 6 cijfers met de dataset van administratieve indelingen uit 2023 en leest de geboortedatum van 8 cijfers
- Berekent het controlecijfer opnieuw uit de eerste 17 cijfers en vergelijkt dit met het laatste teken

### Wat het resultaat laat zien

- Regio-uitsplitsing: provincie, stad, district/graafschap en de ruwe regiocode
- Geboortedatum, huidige leeftijd, volgnummer en het uit het volgnummer afgeleide geslacht
- Het genormaliseerde ID samen met het verwachte en werkelijke controlecijfer voor foutopsporing

### Voorbeeld

`110101199001010015` kan zo worden gelezen:

- `110101` -> Dongcheng District, Beijing
- `19900101` -> geboortedatum `1990-01-01`
- `001` -> volgnummer
- `5` -> controlecijfer

### Belangrijke opmerking

Deze tool voert alleen offline structuur- en checksumvalidatie uit. Een nummer dat deze controles doorstaat, bewijst niet dat het bij een echte of momenteel actieve identiteitskaart hoort.

Regiobenamingen zijn gebaseerd op de dataset met administratieve indelingen van 2023.
