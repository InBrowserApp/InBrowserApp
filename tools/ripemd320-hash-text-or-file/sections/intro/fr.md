## Qu'est-ce que RIPEMD-320 ?

RIPEMD-320 (RACE Integrity Primitives Evaluation Message Digest) est une fonction de hachage cryptographique qui produit une valeur de hachage de 320 bits (40 octets), généralement représentée sous forme d'un nombre hexadécimal de 80 caractères. Elle fait partie de la famille RIPEMD, développée en Europe comme alternative à MD4/MD5.

Utilisez cet outil lorsque vous devez calculer une empreinte RIPEMD-320 pour du texte collé, des données de configuration copiées ou un fichier local. Le calcul s'exécute dans votre navigateur, le contenu du fichier n'a donc pas besoin d'être téléversé vers un serveur.

**Caractéristiques clés :**

- **Déterministe** : La même entrée produit toujours le même hachage
- **Calcul rapide** : Rapide à calculer pour toute entrée donnée
- **Effet d'avalanche** : De petits changements dans l'entrée produisent des sorties drastiquement différentes
- **Taille de sortie fixe** : Produit toujours un hachage de 320 bits, quelle que soit la taille de l'entrée
- **À sens unique** : Il est impossible en pratique de retrouver l'entrée d'origine à partir du hachage

**Utilisations courantes :**

- Vérification de l'intégrité des données
- Empreintes et déduplication
- Compatibilité avec des systèmes hérités

**Note de sécurité :**

RIPEMD-320 est surtout utile lorsqu'un protocole, une archive, une liste de sommes de contrôle ou un système hérité le spécifie déjà. Pour les nouvelles conceptions sensibles à la sécurité, privilégiez une fonction de hachage actuellement standardisée comme SHA-256, SHA-512, SHA-3 ou BLAKE3, sauf si la compatibilité RIPEMD est requise.
