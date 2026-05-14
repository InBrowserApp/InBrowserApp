## Qu'est-ce que SipHash-2-4 ?

SipHash-2-4 est une fonction de hachage à clé rapide conçue pour les messages courts et la protection des tables de hachage. Elle utilise une clé secrète de 128 bits et produit une sortie de 64 bits, généralement affichée sous forme de valeur hexadécimale de 16 caractères.

## Quand l'utiliser

- Protéger les tables de hachage côté serveur contre les attaques par saturation de hachage lorsque la clé reste privée.
- Créer des sommes de contrôle déterministes à clé pour les clés de cache, le partitionnement ou les tables de recherche internes.
- Comparer des extraits de texte ou des fichiers avec la même clé lorsque l'authentification cryptographique n'est pas requise.

## Format de clé

Saisissez la clé sous forme d'exactement 16 octets de données hexadécimales, par exemple `0x000102030405060708090a0b0c0d0e0f`. Le préfixe `0x` est facultatif, et l'outil accepte les espaces, les deux-points, les traits d'union et les traits de soulignement pour faciliter la lecture des clés longues.

## Notes de sécurité

SipHash-2-4 ne remplace pas HMAC, les signatures numériques ni le hachage de mots de passe. Utilisez-le pour les tables de hachage à clé et les flux de sommes de contrôle, pas pour prouver l'authenticité entre des systèmes qui exigent des garanties de sécurité cryptographique.
