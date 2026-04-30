## Qu'est-ce que la conversion JWK ↔ PEM ?

JWK (JSON Web Key) est du matériel de clé au format JSON utilisé par JOSE/JWT, les points de terminaison JWKS et les configurations serverless ou navigateur. Il est facile à lire pour les logiciels, mais moins accepté par les CLI et les infrastructures qui attendent des fichiers de clés.

PEM encapsule les données de clé DER avec des lignes BEGIN/END, le format généralement demandé par OpenSSL, les outils TLS, les passerelles API et de nombreux SDKs.

Ce convertisseur relie ces formats localement dans votre navigateur. Il gère les conteneurs de clés RSA, EC (P-256/384/521) et OKP, permet de choisir une sortie PEM publique SPKI ou privée PKCS8 depuis un JWK, et peut reconvertir les blocs PEM pris en charge en JSON JWK lisible ou compact.

Utilisez la sortie publique lorsque vous avez seulement besoin de vérification ou de distribution. Les conversions privées exposent le matériel de clé privée à l’écran et dans les téléchargements ; traitez donc le résultat comme un secret et fermez l’onglet ensuite.

- Déplacez des clés entre une configuration JWKS/JSON et des fichiers PEM de style OpenSSL.
- Extrayez une clé publique avant de la partager avec des vérificateurs JWT, des passerelles ou des clients.
- Convertissez localement sans envoyer le matériel de clé à un serveur.
