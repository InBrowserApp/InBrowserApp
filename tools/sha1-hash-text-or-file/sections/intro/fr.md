## Qu'est-ce que SHA-1 ?

SHA-1 (Algorithme de Hachage Sécurisé 1) est une fonction de hachage cryptographique qui produit une valeur de hachage de 160 bits (20 octets), généralement rendue sous forme d'un nombre hexadécimal de 40 caractères. Il a été conçu par la NSA et publié par le NIST en 1995 dans le cadre du Standard de Signature Numérique.

**Caractéristiques clés :**

- **Déterministe** : La même entrée produit toujours le même hachage
- **Calcul rapide** : Rapide à calculer pour toute entrée donnée
- **Effet d'avalanche** : De petits changements dans l'entrée produisent des sorties drastiquement différentes
- **Irréversible** : Il est informatiquement impossible d'inverser le hachage pour trouver l'entrée originale
- **Vulnérable aux collisions** : Les vulnérabilités connues rendent possible la recherche de collisions

**État de sécurité :**
⚠️ **SHA-1 est cryptographiquement cassé et ne devrait pas être utilisé pour des applications critiques de sécurité**. Les attaques théoriques ont été démontrées en 2005, et les attaques pratiques de collision ont été réalisées en 2017.

**Utilisations courantes (historiques) :**

- Signatures numériques et certificats (obsolète)
- Système de contrôle de version Git (pour compatibilité)
- Systèmes hérités nécessitant SHA-1
- Vérification d'intégrité de fichiers (non critique pour la sécurité)
- Algorithmes de preuve de travail (certaines cryptomonnaies plus anciennes)

**Alternatives recommandées :**

- SHA-256 ou SHA-3 pour les nouvelles applications
- SHA-512 pour les exigences de haute sécurité
