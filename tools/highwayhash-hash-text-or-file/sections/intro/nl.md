## Wat is HighwayHash?

HighwayHash is een snelle hashfunctie met sleutel, ontworpen door Google voor fingerprinting met hoge doorvoer en integriteitscontroles. De functie gebruikt een 256-bits sleutel en kan 64-bits, 128-bits of 256-bits uitvoer maken uit dezelfde tekst- of bestandsinvoer.

## Wanneer gebruik je het

- Maak deterministische checksums met sleutel voor cache-sleutels, object-ID's, sharding of interne opzoektabellen.
- Vergelijk bestanden of tekstpayloads met dezelfde sleutel wanneer snelheid belangrijker is dan brede cryptografische compatibiliteit.
- Genereer 128-bits of 256-bits fingerprints wanneer een grotere niet-wachtwoordhash nuttig is voor integriteitsworkflows.

## Sleutel- en uitvoeropties

Voer de sleutel in als exact 32 bytes aan hexadecimale data, zoals `0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f`. De `0x`-prefix is optioneel en de tool accepteert spaties, dubbelepunten, koppeltekens en onderstrepingstekens om lange sleutels makkelijker leesbaar te maken. Als je de sleutel leeg laat, gebruikt de tool de standaardsleutel van de bibliotheek. Dat is handig voor snelle controles, maar moet niet als geheim worden behandeld.

## Beveiligingsnotities

HighwayHash is geen vervanging voor HMAC, digitale handtekeningen of wachtwoordhashing. Gebruik het voor snelle fingerprints met sleutel en checksumworkflows, niet om authenticiteit te bewijzen tussen systemen die standaard cryptografische verificatie nodig hebben.
