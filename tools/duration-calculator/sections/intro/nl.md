## Wat is een duur?

Een duur is een hoeveelheid tijd die je bij een basistijd
optelt of ervan aftrekt. Deze rekenmachine begint met een lokale
datum en tijd in de gekozen tijdzone en past dezelfde duur in
beide richtingen toe.

## ISO 8601-voorbeelden

- `PT45M` betekent 45 minuten.
- `P2DT6H` betekent 2 dagen en 6 uur.
- `P1DT2H3M4.005S` betekent 1 dag, 2 uur, 3 minuten en
  4,005 seconden.

## Hoe deze rekenmachine werkt

- Voer een basistijd in het formaat `YYYY-MM-DD HH:mm:ss.SSS` in
  en kies de tijdzone die je wilt beoordelen.
- Voer de duur in als ISO 8601-tekst of via de velden voor
  dagen, uren, minuten, seconden en milliseconden. De tool
  houdt beide invoeren synchroon en normaliseert overloop
  automatisch.
- Voer alleen positieve duren in. Gebruik de ingebouwde
  resultaatkaarten voor optellen en aftrekken om beide
  richtingen te vergelijken.
- De resultaatkaarten tonen de aangepaste lokale tijd, de UTC
  ISO 8601-tijdstempel en Unix-tijdstempels in seconden en
  milliseconden. Rond zomertijdwisselingen kan de offset
  veranderen.
