Genereer lokaal in je browser een UUID v4 wanneer je een nieuwe identifier nodig hebt voor testrecords, databaserijen, API-voorbeelden, eventpayloads, fixtures of configuratiebestanden. De tool maakt telkens één canonieke UUID in kleine letters, zodat hij gericht blijft op de workflow met één waarde en niet overlapt met de aparte bulkgenerator.

## Wat UUID v4 betekent

Een UUID v4 is een 128-bits identifier waarbij de versie- en variantbits vaststaan en de overige 122 bits uit willekeurige data komen. Dat maakt hem nuttig wanneer je identifiers nodig hebt die geen aanmaaktijd, machine-informatie, reeksentellers of gebruikersgegevens prijsgeven.

## Wanneer je hem gebruikt

Gebruik UUID v4 voor clientgegenereerde ID's, mockobjecten, tijdelijke records, openbare voorbeelden en gedistribueerde systemen waar het lastig zou zijn om een centrale teller af te stemmen. Het is een goede standaardkeuze wanneer sorteervolgorde niet belangrijk is en je alleen een identifier met weinig kans op botsingen nodig hebt.

## Privacy en betrouwbaarheid

Generatie gebeurt in dit browsertabblad met Web Crypto, dus de UUID wordt niet naar InBrowser.App of een andere dienst verzonden. Kopieer de waarde zodra hij er goed uitziet en genereer opnieuw wanneer je een nieuwe identifier nodig hebt voor het volgende record of voorbeeld.
