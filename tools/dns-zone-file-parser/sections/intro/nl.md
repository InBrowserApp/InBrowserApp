## Een DNS-zonebestand lezen

Open een DNS-export in BIND-formaat of plak de tekst. Laad het voorbeeld voor een SOA-record, IPv4- en IPv6-adresrecords, mailrecords en een TXT-tekenreeks. Per rij toont de parser de recordnaam, klasse, het type, de levensduur (TTL) in seconden en de recordgegevens. Filter op naam, op een type zoals MX of op een deel van een waarde. Kopieer de zichtbare records vervolgens als JSON voor een inventarisatie of migratie.

## Hoe de parser omgaat met het zonedomein, de TTL en recordgegevens

Met $ORIGIN ingesteld op example.com. wordt de relatieve recordnaam ‘www’ aangevuld tot www.example.com. De naam @ verwijst naar het huidige zonedomein. Een ingesprongen record neemt de naam van het vorige record over. Staat er geen $ORIGIN in het bestand? Vul het zonedomein dan in bij Begindomein. Een standaardwaarde van 1h voor $TTL komt overeen met 3.600 seconden. Heeft een record een eigen TTL, dan geldt die waarde. Aanhalingstekens, escapes en relatieve doelnamen blijven in de recordgegevens behouden. Zo blijft ‘hello; world’ één TXT-waarde, en blijft ‘mail’ in een MX-record gewoon ‘mail’.

## Wat je in de resultaten ziet

De parser verwerkt opmerkingen, tekst tussen aanhalingstekens en records over meerdere regels. Meldingen wijzen je op de regel waar een probleem zit. Leesbare records blijven zichtbaar. Als de zone $INCLUDE of $GENERATE gebruikt, werk je die instructies eerst uit. Plak vervolgens de volledige records. De tool verwerkt de invoer lokaal, vraagt geen DNS-servers om gegevens en controleert niet of een specifieke provider de zone kan laden.
