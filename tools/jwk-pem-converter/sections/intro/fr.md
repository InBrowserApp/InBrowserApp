## Qu'est-ce que la conversion JWK ↔ PEM ?

JWK (JSON Web Key) est un format JSON pour les clés cryptographiques utilisé dans les systèmes JOSE/JWT. Il peut représenter des clés RSA, EC ou OKP et peut apparaître dans un JWK Set (JWKS).

PEM est une clé ASN.1/DER encodée en Base64 avec des en-têtes tels que BEGIN PUBLIC KEY ou BEGIN PRIVATE KEY, courante dans TLS, OpenSSL et de nombreux SDK.

Cet outil convertit les clés dans les deux sens, en préservant le matériau de clé lors du choix d'une sortie publique (SPKI) ou privée (PKCS8). Il prend en charge RSA, EC (P-256/384/521) et OKP (Ed25519/X25519/Ed448/X448), et tout fonctionne localement dans votre navigateur.

Choisissez JWK → PEM lorsqu'une bibliothèque, une passerelle ou une CLI attend des fichiers de clés au format OpenSSL. Choisissez PEM → JWK lorsque vous devez intégrer une clé dans un JWKS, la transmettre via une configuration JSON ou l'utiliser dans un environnement navigateur ou serverless. La conversion d'une clé privée conserve le secret, donc ne partagez que la sortie publique lorsque cela suffit.

- Utilisez une clé JWK/JWKS avec des systèmes qui n'acceptent que le PEM.
- Exportez des clés PEM pour des bibliothèques JWT, des passerelles API ou la distribution de clés.
- Partagez des clés publiques en toute sécurité sans exposer les données de clé privée.
