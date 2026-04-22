## Qu'est-ce que SHA-512 ?

SHA-512 (Algorithme de Hachage Sécurisé 512-bit) est une fonction de hachage cryptographique qui produit une valeur de hachage de 512 bits (64 octets), généralement rendue sous forme d'un nombre hexadécimal de 128 caractères. Il fait partie de la famille des fonctions de hachage SHA-2 conçues par la NSA et publiées par le NIST.

**Caractéristiques clés :**

- **Déterministe** : La même entrée produit toujours le même hachage
- **Calcul rapide** : Rapide à calculer pour toute entrée donnée
- **Effet d'avalanche** : De petits changements dans l'entrée produisent des sorties drastiquement différentes
- **Irréversible** : Il est informatiquement impossible d'inverser le hachage pour trouver l'entrée originale
- **Résistant aux collisions** : Très difficile de trouver deux entrées différentes qui produisent le même hachage

**Utilisations courantes :**

- Signatures numériques et certificats
- Blockchain et cryptomonnaies (Bitcoin utilise SHA-256, mais SHA-512 est utilisé dans d'autres systèmes)
- Stockage de mots de passe (avec salage approprié)
- Vérification d'intégrité de fichiers
- Algorithmes de preuve de travail
