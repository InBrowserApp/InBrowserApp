## Wat is Base85?

Base85 is een binaire-naar-tekstcodering die 4 bytes omzet in 5 afdrukbare tekens. Het is compacter dan Base64, en met deze tool kun je ASCII85 of Z85 kiezen afhankelijk van het formaat dat de ontvanger verwacht.

## Wanneer gebruik je het?

- Voor het coderen van ruwe bytes, tekst of bestanden voor tekstkanalen terwijl de uitvoer relatief compact blijft.
- Gebruik ASCII85 wanneer je een flexibel Base85-formaat nodig hebt dat gedeeltelijke resterende bytes ondersteunt.
- Gebruik Z85 wanneer je ZeroMQ-compatibele Base85-tekst nodig hebt en de invoerlengte exact een veelvoud van 4 bytes is.

## Waar moet je op letten?

- Base85 is een coderingsformaat, geen versleuteling.
- ASCII85 en Z85 gebruiken verschillende alfabetten en zijn dus niet uitwisselbaar.
- Z85 weigert gegevens waarvan de byte-lengte niet deelbaar is door 4, terwijl ASCII85 gedeeltelijke eindblokken wel kan coderen.
