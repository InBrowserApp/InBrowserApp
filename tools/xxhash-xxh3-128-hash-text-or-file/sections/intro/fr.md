## Qu’est-ce que xxHash (XXH3 128) ?

XXH3 est l’algorithme xxHash moderne, conçu pour offrir une très grande vitesse et une excellente distribution. XXH3 128 produit une valeur de hachage de 128 bits (16 octets), généralement affichée sous la forme d’une chaîne hexadécimale de 32 caractères. Il s’agit d’un hachage non cryptographique qui prend aussi en charge une graine optionnelle pour des résultats reproductibles.

**Caractéristiques principales :**

- **Extrêmement rapide** : Optimisé pour de hautes performances sur de grandes entrées
- **Déterministe** : La même entrée et la même graine produisent toujours le même hachage
- **Non cryptographique** : Ne convient pas aux usages de sécurité
- **Bonne distribution** : Utile pour les tables de hachage et l’indexation
- **Avec graine** : Une graine optionnelle aide à différencier les sorties

**Usages courants :**

- Tables de hachage et structures de données
- Vérification d’intégrité de fichiers (hors sécurité)
- Déduplication et découpage en blocs
- Clés de cache et indexation de base de données
- Pipelines de données à haut débit
