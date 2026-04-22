## Qu'est-ce que RIPEMD-256 ?

RIPEMD-256 (RACE Integrity Primitives Evaluation Message Digest) est une fonction de hachage cryptographique qui produit une valeur de hachage de 256 bits (32 octets), généralement rendue sous forme d'un nombre hexadécimal de 64 caractères. Il fait partie de la famille RIPEMD développée en Europe comme alternative à MD4/MD5.

**Caractéristiques clés :**

- **Déterministe** : La même entrée produit toujours le même hachage
- **Calcul rapide** : Rapide à calculer pour toute entrée donnée
- **Effet d'avalanche** : De petits changements dans l'entrée produisent des sorties drastiquement différentes
- **Taille de sortie fixe** : Produit toujours un hachage de 256 bits quelle que soit la taille d'entrée
- **À sens unique** : Il est informatiquement impossible de récupérer l'entrée originale à partir du hachage

**Utilisations courantes :**

- Vérification de l'intégrité des données
- Empreintes et déduplication
- Compatibilité avec des systèmes hérités
