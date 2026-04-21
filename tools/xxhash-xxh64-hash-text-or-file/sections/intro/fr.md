## Qu'est-ce que xxHash (XXH64) ?

xxHash est un algorithme de hachage non cryptographique extrêmement rapide qui se concentre sur la vitesse et les performances tout en maintenant de bonnes propriétés de distribution. XXH64 est la variante 64 bits qui produit une valeur de hachage de 64 bits (8 octets), généralement affichée comme un nombre hexadécimal de 16 caractères.

**Caractéristiques clés :**

- **Extrêmement rapide** : Optimisé pour la vitesse, beaucoup plus rapide que les fonctions de hachage cryptographiques
- **Déterministe** : La même entrée produit toujours le même hachage
- **Bonne distribution** : Fournit une excellente distribution de hachage pour les tables de hachage
- **Non cryptographique** : Non adapté aux fins de sécurité, conçu pour les performances
- **Sortie plus grande** : Le hachage 64 bits fournit une meilleure résistance aux collisions que les variantes 32 bits
- **Optimisé pour la plateforme** : Utilise les instructions SIMD lorsqu'elles sont disponibles pour une vitesse maximale

**Utilisations courantes :**

- Tables de hachage et structures de données
- Vérifications d'intégrité de fichiers (non-sécurité)
- Déduplication de données
- Sommes de contrôle pour la transmission de données
- Applications critiques en performance
- Indexation de base de données
- Génération de clés de cache
