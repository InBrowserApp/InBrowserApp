## Qu'est-ce que Keccak ?

Keccak est une famille de fonctions de hachage cryptographiques qui sert de base au standard SHA-3 (Secure Hash Algorithm 3). Développé par Guido Bertoni, Joan Daemen, Michaël Peeters et Gilles Van Assche, il a remporté la compétition de fonctions de hachage NIST en 2012.

**Caractéristiques clés :**

- **Construction éponge** : Utilise un design innovant de fonction éponge avec des phases d'absorption et d'essorage
- **Longueur de sortie variable** : Peut produire des sorties de hachage de n'importe quelle longueur désirée
- **Marge de sécurité élevée** : Conçu avec des réserves de sécurité substantielles
- **Différent de SHA-1/SHA-2** : Basé sur des principes mathématiques entièrement différents
- **Variante Keccak[c=2d]** : Cette implémentation utilise la spécification Keccak originale avec capacité c = 2d (où d est la longueur de sortie)

**Différences entre Keccak et SHA-3 (FIPS 202) :**
🔍 **Distinction importante** : Le Keccak original et le SHA-3 standardisé **ne sont pas identiques** :

- **Keccak original** : Utilise la capacité c = 2d et un remplissage différent (remplissage Keccak : 0x01)
- **FIPS 202 SHA-3** : Utilise la capacité c = 2d mais un remplissage différent (remplissage SHA-3 : 0x06)
- **Séparation de domaine** : La différence de remplissage garantit que Keccak et SHA-3 produisent des sorties différentes pour la même entrée
- **Cet outil implémente** : La **spécification Keccak originale** avec la paramétrisation Keccak[c=2d]

**État de sécurité :**
✅ **Keccak est considéré comme hautement sécurisé** sans attaques pratiques connues. Il fournit d'excellentes marges de sécurité et une résistance contre diverses techniques cryptanalytiques.

**Utilisations courantes :**

- Blockchain Ethereum (utilise Keccak-256 original)
- Recherche académique et protocoles cryptographiques
- Applications nécessitant des sorties de hachage de longueur variable
- Systèmes nécessitant des alternatives à la famille SHA-2
- Implémentations blockchain et cryptomonnaies

**Avantages par rapport aux hachages traditionnels :**

- Design fondamentalement différent réduit le risque d'attaques liées
- Longueur de sortie flexible (non limitée à des tailles fixes)
- Base de sécurité théorique solide
- Résistance aux attaques d'extension de longueur
- Excellente performance sur diverses plateformes

**Note technique :**

- **Keccak-256** : Produit une sortie de 256 bits (variante la plus commune)
- **Formule de capacité** : c = 2d assure le niveau de sécurité approprié
- **Usage Ethereum** : Ethereum utilise spécifiquement Keccak-256 original, pas SHA3-256
