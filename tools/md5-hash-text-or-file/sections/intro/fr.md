## Qu'est-ce que MD5 ?

MD5 (Message Digest Algorithm 5) est une fonction de hachage cryptographique largement utilisée qui produit une valeur de hachage de 128 bits (16 octets), généralement rendue sous forme d'un nombre hexadécimal de 32 caractères. Il a été conçu par Ron Rivest en 1991 comme successeur de MD4.

**Caractéristiques clés :**

- **Déterministe** : La même entrée produit toujours le même hachage
- **Calcul rapide** : Rapide à calculer pour toute entrée donnée
- **Effet d'avalanche** : De petits changements dans l'entrée produisent des sorties drastiquement différentes
- **Taille de sortie fixe** : Produit toujours un hachage de 128 bits quelle que soit la taille d'entrée
- **Vulnérable aux collisions** : Les vulnérabilités connues rendent possible la recherche de collisions

**État de sécurité :**
⚠️ **MD5 est cryptographiquement cassé et ne devrait pas être utilisé pour des applications critiques de sécurité**. Les attaques de collision ont été démontrées en 2004, et la génération pratique de collisions est devenue réalisable avec la puissance de calcul moderne.

**Utilisations courantes (actuelles et historiques) :**

- Vérification d'intégrité de fichiers (non critique pour la sécurité)
- Sommes de contrôle pour la détection de corruption de données
- Systèmes hérités nécessitant MD5
- Génération de clés de base de données (non cryptographique)
- Certains protocoles et systèmes plus anciens

**Alternatives recommandées :**

- SHA-256 ou SHA-3 pour les nouvelles applications
- SHA-512 pour les exigences de haute sécurité
- BLAKE2 pour les applications haute performance
