De collectie hash-tools brengt de gemigreerde hashinghulpmiddelen samen, zodat je het juiste algoritme kunt kiezen voordat je een specifieke tool opent. De collectie dekt dagelijkse bestandsdigests, compatibiliteitscontroles voor legacy-systemen, keyed berichtauthenticatie, Subresource Integrity-strings, wachtwoord-hashing, wachtwoordverificatie en snelle niet-cryptografische checksums.

## Wanneer je deze tools gebruikt

Gebruik de cryptografische digest-tools wanneer je een herhaalbare fingerprint nodig hebt voor tekst of een bestand, zoals het vergelijken van een gedownload archief met een gepubliceerde checksum met SHA-256. Gebruik HMAC wanneer het resultaat moet bewijzen dat iemand met een gedeeld geheim het bericht heeft gemaakt of goedgekeurd. Gebruik Argon2, bcrypt, PBKDF2 of scrypt voor workflows rond wachtwoorden en sleutelafleiding, waarbij configureerbare kosten belangrijker zijn dan pure snelheid.

## Veilig kiezen

Niet elke hash is geschikt voor beveiliging. MD4, MD5 en SHA-1 zijn nuttig voor legacy-systemen en compatibiliteitscontroles, maar ze moeten niet worden gebruikt voor nieuwe beveiligingsgevoelige integriteitsontwerpen. CRC, Adler-32, MurmurHash, CityHash en xxHash zijn snelle checksums of bucketinghashes, geen manipulatiebestendige handtekeningen. Als je het niet zeker weet, kies dan SHA-256 voor openbare checksums, HMAC-SHA-256 voor keyed verificatie en Argon2id of bcrypt voor wachtwoordopslag.

## Privacy en workflow

De afzonderlijke tools in deze collectie draaien in de browser. Tekst en bestanden worden lokaal verwerkt door de geselecteerde tool, tenzij die tool expliciet openbaar opzoekgedrag documenteert, wat de hash-tools niet nodig hebben. Wis gegenereerde waarden na gebruik bij gevoelig materiaal en plak geen geheimen in gedeelde of opgenomen browsersessies.
