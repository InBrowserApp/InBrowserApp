## Qu'est-ce que Basic Auth ?

Basic Auth place `username:password` dans l'en-tête `Authorization` après un encodage Base64. C'est simple et largement pris en charge, mais Base64 n'est qu'un encodage, pas un chiffrement.

## Ce que cet outil génère

- Un en-tête `Authorization: Basic ...` à coller dans un client API.
- Un exemple `curl` prêt à lancer pour des tests rapides.
- Tout s'exécute localement dans le navigateur.

## À garder en tête

- Utilisez HTTPS dès que vous envoyez des identifiants Basic Auth.
- Toute personne qui voit l'en-tête peut décoder le nom d'utilisateur et le mot de passe d'origine.
- Basic Auth est pratique pour les outils internes, les environnements de staging et les vérifications API rapides.
