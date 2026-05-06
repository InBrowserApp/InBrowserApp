## Wat dit hulpmiddel doet

Dit hulpmiddel combineert CIDR-blokken tot de kleinste equivalente set en trekt vervolgens alle CIDR-blokken af die je in de uitsluitlijst zet. Het ondersteunt IPv4 en IPv6 in dezelfde run, en alle verwerking gebeurt lokaal in je browser.

## Hoe samenvoegen en uitsluiten werkt

De samenvoeglijst wordt eerst genormaliseerd: hostbits worden gewist, overlappende netwerken worden samengevoegd en aangrenzende netwerken worden samengevouwen wanneer ze kunnen worden weergegeven door een korter CIDR-blok. Daarna wordt de uitsluitlijst afgetrokken van de samengevoegde bereiken. De uiteindelijke uitvoer wordt weer uitgebreid naar de minimale CIDR-lijst die exact dekt wat overblijft.

## Wanneer dit nuttig is

Gebruik het bij het opschonen van firewallregels, het voorbereiden van vermeldingen voor cloudbeveiligingsgroepen, het controleren van VPN-allowlists, het samenvatten van routetabellen of het verwijderen van gereserveerde bereiken uit een grotere toewijzing. Het is vooral handig wanneer gekopieerde configuratie overlappende blokken bevat of wanneer uit een breed netwerk een paar kleinere bereiken moeten worden verwijderd.

## Invoernotities

Voer een CIDR per regel in, of scheid meerdere CIDR's met komma's. IPv4- en IPv6-blokken kunnen samen worden geplakt, maar uitsluitingen zijn alleen van toepassing op blokken uit dezelfde adresfamilie. Ongeldige vermeldingen worden gemeld met hun lijst en regelnummer, zodat je grote geplakte invoer kunt herstellen zonder te gokken.
