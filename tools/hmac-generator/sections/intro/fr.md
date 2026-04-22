## Qu'est-ce que HMAC ?

HMAC (Code d'Authentification de Message basé sur le Hachage) est un mécanisme cryptographique qui combine une clé secrète avec une fonction de hachage pour vérifier à la fois l'intégrité et l'authenticité d'un message.

**Comment ça fonctionne :**

1. La clé secrète est combinée avec le message
2. Une fonction de hachage (comme SHA-256) traite les données combinées
3. Le résultat est un code d'authentification de taille fixe

**Cas d'usage courants :**

- **Authentification API**: Signature des requêtes API pour vérifier l'expéditeur
- **Jetons JWT**: Utilisé dans les algorithmes HS256/HS384/HS512
- **Vérification de Message**: S'assurer que les données n'ont pas été altérées
- **Signatures Webhook**: Validation des charges utiles de webhook

**Notes de sécurité :**

- Utilisez toujours une clé secrète forte et aléatoire
- Gardez votre clé secrète confidentielle
- SHA-256 ou supérieur est recommandé pour les nouvelles applications
- SHA-1 est considéré comme faible et devrait être évité pour les usages critiques en sécurité
