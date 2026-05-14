## Qu’est-ce que scrypt ?

scrypt est une fonction de dérivation de clé basée sur un mot de passe (KDF) résistante à la mémoire. Elle transforme un mot de passe et un sel en octets de clé déterministes tout en consommant volontairement du temps CPU et de la mémoire, ce qui rend les tentatives de deviner des mots de passe à grande échelle plus coûteuses qu’un simple hachage.

**Points clés :**

- Utilise `N` (facteur de coût), `r` (taille de bloc) et `p` (parallélisme)
- Des valeurs plus élevées pour `N` et `r` augmentent le coût en mémoire et en calcul
- Produit la même clé dérivée uniquement lorsque le mot de passe, le sel, les paramètres et la longueur de sortie correspondent

**Bonnes pratiques :**

- Utilisez un sel aléatoire unique pour chaque mot de passe ou secret
- Stockez `N`, `r`, `p`, le format du sel et la longueur de sortie à côté de la clé dérivée
- Ajustez les paramètres sur l’appareil le plus lent que vous devez prendre en charge avant de les utiliser en production
