## Qu’est-ce que xxHash (XXH3 64) ?

XXH3 est l’algorithme moderne de xxHash, conçu pour offrir une très grande vitesse
et une excellente répartition. XXH3 64 produit une empreinte de 64 bits (8 octets),
généralement représentée par une chaîne hexadécimale de 16 caractères. Il s’agit
d’un hachage non cryptographique qui accepte une graine facultative pour rendre
les calculs reproductibles.

**Principales caractéristiques :**

- **Extrêmement rapide** : optimisé pour traiter de grandes quantités de données
- **Déterministe** : une même entrée et une même graine produisent toujours la même empreinte
- **Non cryptographique** : ne convient pas aux usages de sécurité
- **Bonne répartition** : adapté aux tables de hachage et à l’indexation
- **Avec graine** : une graine facultative permet de diversifier les empreintes produites

**Utilisations courantes :**

- Tables de hachage et structures de données
- Vérifications d’intégrité de fichiers sans objectif de sécurité
- Déduplication et découpage des données
- Clés de cache et indexation de bases de données
- Chaînes de traitement des données à haut débit
