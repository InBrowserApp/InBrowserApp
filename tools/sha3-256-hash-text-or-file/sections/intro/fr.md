## Qu'est-ce que SHA3-256 (FIPS 202) ?

SHA3-256 (FIPS 202) (Algorithme de Hachage Sécurisé 256-bit) est une fonction de hachage cryptographique qui produit une valeur de hachage de 256 bits (32 octets), généralement rendue sous forme d'un nombre hexadécimal de 64 caractères. Il fait partie de la famille des fonctions de hachage SHA-3 standardisées par le NIST (FIPS 202).

**Caractéristiques clés :**

- **Déterministe** : La même entrée produit toujours le même hachage
- **Calcul rapide** : Rapide à calculer pour toute entrée donnée
- **Effet d'avalanche** : De petits changements dans l'entrée produisent des sorties drastiquement différentes
- **Irréversible** : Il est informatiquement impossible d'inverser le hachage pour trouver l'entrée originale
- **Résistant aux collisions** : Très difficile de trouver deux entrées différentes qui produisent le même hachage

**Utilisations courantes :**

- Signatures numériques et certificats
- Blockchain et cryptomonnaies (certains systèmes utilisent SHA3-256 (FIPS 202))
- Stockage de mots de passe (avec salage approprié)
- Vérification d'intégrité de fichiers
- Algorithmes de preuve de travail
