## Qu'est-ce qu'un outil de signature JWT ?

Un outil de signature JWT crée un JSON Web Token compact en sérialisant un en-tête et une charge utile, puis en les signant avec un secret ou une clé privée. Le résultat est le jeton en trois parties `header.payload.signature` utilisé par de nombreux systèmes d'API, OAuth et de sessions.

## Quand utiliser cet outil

- Créer des jetons de test locaux pour le développement d'API, les environnements de préproduction et les démos.
- Comparer la manière dont différents algorithmes modifient l'en-tête et la signature du jeton.
- Ajouter des claims comme `sub`, `iss`, `aud`, `exp`, `iat`, `scope` ou des champs d'application personnalisés sans écrire de script jetable.
- Générer des jetons avec des secrets partagés HMAC ou avec des clés privées RSA/ECDSA au format PKCS#8 PEM ou JWK.

## À vérifier avant d'utiliser un jeton signé

- Faites correspondre l'algorithme au type de clé : `HS*` utilise un secret partagé, `RS*` et `PS*` utilisent des clés privées RSA, et `ES*` utilise des clés privées EC.
- Ajoutez des claims d'expiration et d'audience lorsque le service récepteur les attend.
- Gardez les clés privées de production hors des navigateurs et machines partagés. Cet outil s'exécute localement, mais il ne peut pas protéger les clés d'un appareil déjà compromis.
- N'oubliez pas que la signature n'est pas du chiffrement. Toute personne qui reçoit le jeton peut décoder l'en-tête et la charge utile.
