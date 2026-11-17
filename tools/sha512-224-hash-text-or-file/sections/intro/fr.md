## Qu’est-ce que SHA-512/224 (FIPS 180-4) ?

SHA-512/224 (FIPS 180-4) est une fonction de hachage cryptographique de la famille
SHA-2 qui produit une empreinte de 224 bits (28 octets), généralement représentée
par une chaîne hexadécimale de 56 caractères. Elle repose sur SHA-512, avec des
valeurs initiales différentes et un résultat tronqué, afin de fournir une
empreinte plus courte tout en conservant la structure interne de SHA-512.

**Principales caractéristiques :**

- **Déterministe** : une même entrée produit toujours la même empreinte
- **Calcul rapide** : l’empreinte se calcule rapidement pour toute entrée donnée
- **Effet d’avalanche** : une légère modification de l’entrée produit un résultat radicalement différent
- **Irréversible** : retrouver l’entrée d’origine à partir de l’empreinte est irréalisable en pratique par le calcul
- **Résistance aux collisions** : il est très difficile de trouver deux entrées différentes produisant la même empreinte

**Utilisations courantes :**

- Signatures numériques et certificats
- Vérifications d’intégrité et sommes de contrôle
- Constructions HMAC
- Vérification de fichiers et chaînes de traitement des données
- Protocoles nécessitant des empreintes de 224 bits
