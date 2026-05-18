## Wat is UUID v3?

UUID v3 is een op namen gebaseerd UUID-formaat. Het gebruikt een naamruimte-UUID
en een naam, hasht ze met MD5 en formatteert het resultaat als een
standaard-UUID. Het belangrijkste gedrag is determinisme: dezelfde naamruimte en
naam leveren altijd dezelfde UUID op.

Deze tool draait volledig in je browser. De naamruimte, naam en gegenereerde UUID
blijven op je apparaat, tenzij je het resultaat ergens anders naartoe kopieert.

## Wanneer gebruik je het

- Gebruik UUID v3 wanneer je een stabiele identificatiecode nodig hebt voor een
  bekende naam, zoals een DNS-naam, URL, objectpad of gebruikersnaam.
- Kies de naamruimte die past bij het soort naam dat je identificeert. DNS en URL
  zijn de meest gebruikte voorinstellingen.
- Hergebruik dezelfde naamruimte consequent. Als je de naamruimte wijzigt,
  verandert elke gegenereerde UUID, zelfs wanneer de naam hetzelfde blijft.
- Geef de voorkeur aan UUID v5 of een andere moderne identificatiecode wanneer
  je de keuze hebt en een op namen gebaseerde UUID met een sterkere hash nodig
  hebt. UUID v3 bestaat voor compatibiliteit met systemen die specifiek op MD5
  gebaseerde UUID's verwachten.

## Opmerkingen over veiligheid

UUID v3 is geen willekeurige ID en is niet geheim. Iedereen die de naamruimte en
naam kent, kan dezelfde UUID opnieuw genereren. Gebruik het niet voor
wachtwoorden, sessietokens, API-sleutels of andere waarden die onvoorspelbaar
moeten zijn.
