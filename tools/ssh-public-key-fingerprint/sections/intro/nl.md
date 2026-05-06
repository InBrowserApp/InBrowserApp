## Wat is een SSH-public-key-fingerprint?

Een SSH-public-key-fingerprint is een korte digest van de public-key-blob. Deze geeft je een compacte waarde om te vergelijken voordat je een key vertrouwt in `authorized_keys`, een serverinventaris of een deploymentworkflow.

OpenSSH toont vaak SHA-256-fingerprints zoals `SHA256:...`. Oudere documentatie en sommige audits gebruiken nog steeds MD5-fingerprints met dubbele punten. Deze tool toont beide, zodat je moderne SSH-uitvoer en oudere registraties kunt vergelijken zonder de key ergens naartoe te sturen.

Plak een enkele public key, meerdere `authorized_keys`-regels of een SSH2-public-key-blok. De parser slaat opmerkingen en authorized_keys-opties over, leest de echte SSH-key-blob en berekent de fingerprints lokaal in je browser.

- Controleer of een gekopieerde public key overeenkomt met de fingerprint die door een teamgenoot is gedeeld.
- Vergelijk `authorized_keys`-items met een servertoegangslijst.
- Bekijk keytype, keygrootte, curve en opmerking voordat je een fingerprint kopieert.
