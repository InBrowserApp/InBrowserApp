## Qu'est-ce que PBKDF2 ?

PBKDF2 (Password-Based Key Derivation Function 2) dérive une clé cryptographique à partir d’un mot de passe en utilisant un sel et de nombreuses itérations. Il ralentit les attaques par force brute et produit des clés différentes lorsque le sel change.

**Points clés :**

- Utilise HMAC avec un hash choisi (SHA-1/SHA-256/etc.)
- Plus d’itérations augmentent le coût de calcul
- La longueur de sortie est configurable

**Bonnes pratiques :**

- Utilisez un sel unique et aléatoire
- Préférez plus d’itérations dans des limites de performance acceptables
- Pour les nouveaux systèmes, envisagez Argon2 ou scrypt
