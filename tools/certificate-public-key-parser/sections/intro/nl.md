## What is an X.509 certificate parser?

Een X.509-certificaat is een ondertekend document dat een openbare sleutel koppelt aan een identiteit, zoals een domein, service, organisatie of persoon. TLS-certificaten, certificaatketenbestanden en veel S/MIME- of ondertekeningsworkflows gebruiken dit formaat.

Deze parser leest certificaat- en openbare-sleutelmateriaal rechtstreeks in je browser. Hij kan PEM-blokken, binaire DER-bestanden en base64 DER-tekst inspecteren en vervolgens het onderwerp, de uitgever, het serienummer, de geldigheidsperiode, het handtekeningalgoritme, het openbare-sleutelalgoritme, fingerprints en veelgebruikte extensies tonen.

Gebruik hem wanneer je een certificaatfingerprint moet vergelijken, wilt controleren of een certificaat voor de verwachte host is, Subject Alternative Names wilt inspecteren, sleutelgebruik wilt bevestigen of openbare-sleutelgegevens wilt ophalen tijdens het debuggen van TLS- en deploymentproblemen.

De tool valideert geen vertrouwensketens en neemt geen contact op met certificaatautoriteiten. Hij toont wat is gecodeerd in het certificaat of de openbare sleutel die je aanlevert, dus gebruik een speciale TLS-scanner wanneer je intrekking, keten-, hostnaam- of live-eindpuntvalidatie nodig hebt.

- Vergelijk SHA-256- of SHA-1 fingerprints voordat je certificaten installeert of roteert.
- Bekijk SAN, sleutelgebruik, uitgebreid sleutelgebruik en basisbeperkingen zonder certificaatmateriaal te uploaden.
- Inspecteer zelfstandige SPKI-openbare sleutels wanneer een service je alleen een openbare-sleutel-PEM- of DER-bestand geeft.
