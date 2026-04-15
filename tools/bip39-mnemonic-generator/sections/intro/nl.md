Maak BIP39-seedzinnen in de browser, inspecteer geïmporteerde mnemonics voordat je ze vertrouwt en converteer tussen ruwe entropie en walletwoorden zonder gevoelig materiaal naar een andere dienst te sturen. Deze tool is handig wanneer je één werkruimte nodig hebt voor generatie, checksumvalidatie en herstelwerk op laag niveau.

## Gericht genereren

Kies een ondersteunde woordenlijst en woordaantal en genereer opnieuw totdat je de seedzin hebt die je wilt bewaren. De bijbehorende entropie wordt naast de zin getoond zodat je de exacte sterkte kunt controleren en beide representaties samen kunt bewaren wanneer je een herstelproces documenteert.

## Valideren vóór import

Gebruik de validatiemodus wanneer iemand je een mnemonic-zin geeft en je snel de checksum en het aantal woorden wilt controleren voordat je die in een andere wallet importeert. Een geldig resultaat toont ook de herstelde entropie, wat helpt bij het vergelijken van twee herstelbronnen of het debuggen van afleidingsstappen.

## Entropie zorgvuldig converteren

De conversiemodus werkt in beide richtingen: van ruwe entropie naar woorden en van mnemonic-woorden terug naar entropie. Daardoor is hij praktisch voor testdata, deterministische walletdemo’s en incidentreviews waarbij je moet bevestigen dat een zin onder een specifieke BIP39-woordenlijst nog steeds naar de verwachte bytes wijst.
