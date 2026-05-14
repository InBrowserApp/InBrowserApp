## Wat is SipHash-128-2-4?

SipHash-128-2-4 is een snelle hashfunctie met sleutel, ontworpen voor korte berichten en bescherming van hashtabellen. De functie gebruikt een geheime 128-bits sleutel en produceert 128-bits uitvoer, meestal weergegeven als een hexadecimale waarde van 32 tekens.

## Wanneer gebruik je het

- Bescherm hashtabellen aan serverzijde tegen hash-flooding-aanvallen wanneer de sleutel privé blijft.
- Maak deterministische checksums met sleutel voor cache-sleutels, sharding of interne opzoektabellen.
- Vergelijk tekstfragmenten of bestanden met dezelfde sleutel wanneer cryptografische authenticatie niet vereist is.

## Sleutelformaat

Voer de sleutel in als exact 16 bytes aan hexadecimale data, zoals `0x000102030405060708090a0b0c0d0e0f`. De `0x`-prefix is optioneel en de tool accepteert spaties, dubbele punten, koppeltekens en underscores om lange sleutels makkelijker leesbaar te maken.

## Beveiligingsnotities

SipHash-128-2-4 is geen vervanging voor HMAC, digitale handtekeningen of wachtwoordhashing. Gebruik het voor workflows met hashtabellen en checksums met sleutel, niet om authenticiteit te bewijzen tussen systemen die cryptografische beveiligingsgaranties nodig hebben.
