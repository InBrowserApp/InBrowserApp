## Wat is een tekst- of bestandshash?

Een hashfunctie zet tekst of bestandsbytes om in een digest met vaste lengte. Dezelfde invoer en hetzelfde algoritme leveren altijd dezelfde digest op, waardoor hashes handig zijn wanneer je een herhaalbare vingerafdruk nodig hebt zonder persoonlijke gegevens te uploaden.

## Wanneer gebruik je deze tool?

Gebruik deze tool om download-checksums te controleren, te vergelijken of twee bestanden identiek zijn, snel een vingerafdruk van een tekstfragment vast te leggen of systemen te debuggen die SHA-digests publiceren. Bij het importeren van een bestand worden de bestandsbytes direct gehasht, terwijl de tekstmodus de UTF-8-tekst hasht die in de editor staat.

## Een algoritme kiezen

SHA-256 is een solide standaard voor nieuwe integriteitscontroles. SHA-384 en SHA-512 bieden langere SHA-2-digests wanneer een ander systeem die indelingen verwacht. SHA-1 is opgenomen voor vergelijking met oudere systemen, maar mag niet worden gebruikt voor nieuwe beveiligingsgevoelige ontwerpen.

## Privacy en beperkingen

Hashen gebeurt lokaal in je browser via Web Crypto, en bestanden worden niet verzonden. Een hash is geen versleuteling: hij kan op zichzelf geen geheim beschermen, en wachtwoordopslag vereist een speciale wachtwoordhashfunctie met een salt en work factor.
