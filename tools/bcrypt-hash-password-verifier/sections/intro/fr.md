## Ce qu’il fait

Vérifiez si un mot de passe en clair correspond à un hachage de mot de passe bcrypt. C’est utile lorsque vous déboguez du code de connexion, contrôlez des comptes utilisateur importés ou confirmez qu’une migration de mots de passe a conservé la compatibilité des hachages.

## Entrée acceptée

Collez un hachage bcrypt standard tel que `$2b$10$...` et saisissez le mot de passe candidat à tester. Le vérificateur accepte les préfixes `$2a$`, `$2b$` et `$2y$` avec des facteurs de coût de `04` à `31`.

## Interpréter le résultat

Un résultat correspondant signifie que bcrypt a accepté le mot de passe pour ce hachage, y compris le sel et le coût intégrés à la chaîne de hachage. Une non-correspondance signifie que le mot de passe n’a pas été vérifié ; cela ne prouve pas que le hachage lui-même est non sécurisé. Les erreurs de hachage non valide indiquent généralement que le préfixe, le coût, la longueur ou les caractères bcrypt base64 sont mal formés.

## Notes de confidentialité et de sécurité

- La vérification s’exécute localement dans votre navigateur.
- Les mots de passe et les hachages ne sont pas stockés dans le stockage local.
- bcrypt est conçu pour le stockage des mots de passe, pas pour les sommes de contrôle de fichiers à usage général.
- Utilisez cet outil pour le débogage et la validation, pas comme seul audit d’un système d’authentification en production.
