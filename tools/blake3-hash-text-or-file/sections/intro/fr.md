## Qu'est-ce que BLAKE3 ?

BLAKE3 est une fonction de hachage cryptographique moderne dérivée de BLAKE2. Elle est conçue pour des performances très élevées et le parallélisme tout en maintenant une sécurité robuste. Elle produit un hash de 256 bits par défaut et prend en charge une longueur de sortie extensible (XOF).

**Caractéristiques clés :**

- **Longueur de sortie extensible** : Peut produire des hachages de n'importe quelle longueur
- **Haute performance** : Rapide et parallélisable sur les CPU modernes
- **Déterministe** : La même entrée produit toujours le même hachage
- **Effet d'avalanche** : De petits changements dans l'entrée produisent des sorties drastiquement différentes
- **Irréversible** : Il est informatiquement impossible d'inverser le hachage pour retrouver l'entrée originale
- **Résistant aux collisions** : Très difficile de trouver deux entrées différentes produisant le même hachage
- **Hachage avec clé** : Prend en charge une clé optionnelle de 32 octets pour la fonctionnalité MAC
- **Dérivation de clés** : Peut dériver des sous-clés à partir de matériel de clé et de contexte

**Utilisations courantes :**

- Vérification d'intégrité de fichiers
- Stockage adressé par contenu et déduplication
- Signatures numériques et certificats
- Stockage et authentification de mots de passe
- Protocoles et systèmes cryptographiques
