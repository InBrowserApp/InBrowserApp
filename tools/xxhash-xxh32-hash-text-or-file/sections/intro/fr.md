## Qu'est-ce que xxHash (XXH32) ?

xxHash est un algorithme de hachage non cryptographique extrêmement rapide qui se concentre sur la vitesse et les performances tout en maintenant de bonnes propriétés de distribution. XXH32 est la variante 32 bits qui produit une valeur de hachage de 32 bits (4 octets), généralement affichée comme un nombre hexadécimal de 8 caractères.

**Caractéristiques clés :**

- **Extrêmement rapide** : Optimisé pour la vitesse, beaucoup plus rapide que les fonctions de hachage cryptographiques
- **Déterministe** : La même entrée produit toujours le même hachage
- **Bonne distribution** : Fournit une excellente distribution de hachage pour les tables de hachage
- **Non cryptographique** : Non adapté aux fins de sécurité, conçu pour les performances
- **Sortie petite** : Le hachage 32 bits fournit une représentation compacte
- **Optimisé pour la plateforme** : Utilise les instructions SIMD lorsqu'elles sont disponibles pour une vitesse maximale

**Utilisations courantes :**

- Tables de hachage et structures de données
- Vérifications d'intégrité de fichiers (non-sécurité)
- Déduplication de données
- Sommes de contrôle pour la transmission de données
- Applications critiques en performance
- Indexation de base de données
- Génération de clés de cache
