## Qu'est-ce que HighwayHash ?

HighwayHash est une fonction de hachage à clé rapide conçue par Google pour les empreintes à haut débit et les contrôles d'intégrité. Elle utilise une clé de 256 bits et peut produire une sortie de 64 bits, 128 bits ou 256 bits à partir du même texte ou fichier.

## Quand l'utiliser

- Créer des sommes de contrôle déterministes à clé pour les clés de cache, les ID d'objet, le partitionnement ou les tables de recherche internes.
- Comparer des fichiers ou des charges utiles de texte avec la même clé quand la vitesse compte davantage qu'une large compatibilité cryptographique.
- Générer des empreintes de 128 bits ou 256 bits lorsqu'un hachage non destiné aux mots de passe, plus long, est utile pour les flux d'intégrité.

## Options de clé et de sortie

Saisissez la clé sous forme d'exactement 32 octets de données hexadécimales, par exemple `0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f`. Le préfixe `0x` est facultatif, et l'outil accepte les espaces, les deux-points, les traits d'union et les traits de soulignement pour faciliter la lecture des clés longues. Laisser la clé vide utilise la clé par défaut de la bibliothèque, ce qui est pratique pour des vérifications rapides mais ne doit pas être considéré comme secret.

## Notes de sécurité

HighwayHash ne remplace pas HMAC, les signatures numériques ni le hachage de mots de passe. Utilisez-le pour les empreintes rapides à clé et les flux de sommes de contrôle, pas pour prouver l'authenticité entre des systèmes qui exigent une vérification cryptographique standard.
