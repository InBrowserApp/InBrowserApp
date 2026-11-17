## Ce que fait cet outil

Décode l'en-tête HTTP Basic Authorization pour extraire le nom d'utilisateur et le mot de passe depuis Base64. Utile pour le débogage et les tests d'API.

## Entrées acceptées

Collez quelque chose comme : Basic dXNlcjpwYXNz
Cet outil accepte également une ligne complète `Authorization: Basic ...`.

## Notes

- Base64 ne fait qu’encoder les identifiants ; il ne les protège pas.
- Le décodeur sépare le texte au premier `:` et conserve le reste dans le mot de passe.
- Tout s’exécute localement dans votre navigateur.
