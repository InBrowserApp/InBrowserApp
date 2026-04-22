## Qu’est-ce que l’Intégrité des Sous-ressources (SRI) ?

L’Intégrité des Sous-ressources (SRI) est une fonctionnalité de sécurité qui permet aux navigateurs de vérifier que les fichiers qu’ils récupèrent (par exemple, depuis un CDN) n’ont pas été modifiés de manière inattendue. Elle fonctionne en comparant le hachage cryptographique d’une ressource avec un hachage fourni dans le HTML.

**Comment ça fonctionne :**

1. Générer un hachage cryptographique de votre fichier de ressource
2. Inclure le hachage dans l’attribut integrity des balises script ou link
3. Le navigateur récupère la ressource et calcule son hachage
4. Le navigateur compare le hachage calculé avec le hachage fourni
5. Si les hachages correspondent, la ressource se charge ; sinon, le chargement est bloqué

**Avantages :**

- **Sécurité** : Protège contre les modifications malveillantes des ressources tierces
- **Protection CDN** : Assure que les fichiers servis par CDN n’ont pas été altérés
- **Sécurité de la chaîne d’approvisionnement** : Valide l’intégrité des dépendances externes
- **Support navigateur** : Largement supporté par les navigateurs modernes

**Algorithmes supportés :**

- SHA-256 (minimum recommandé)
- SHA-384 (recommandé)
- SHA-512 (sécurité maximale)
