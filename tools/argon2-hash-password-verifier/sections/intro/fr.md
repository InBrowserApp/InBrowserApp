## Qu’est-ce que la vérification Argon2 ?

La vérification Argon2 contrôle si un mot de passe en clair produit le même hash Argon2 encodé que celui stocké précédemment. Le hash encodé contient la variante Argon2, les paramètres de coût, le salt et le digest, ce qui permet à un vérificateur de refaire le même travail sans réglages séparés.

## Quand utiliser cet outil

- Confirmer qu’un mot de passe copié et un hash Argon2 stocké correspondent
- Déboguer des problèmes de connexion ou de migration lors du déplacement d’enregistrements de mots de passe entre systèmes
- Inspecter la variante et les paramètres de coût dans un hash Argon2 encodé
- Tester des hashes qui utilisent un secret optionnel côté serveur, souvent appelé pepper

## Comment vérifier en sécurité

1. Collez le mot de passe que vous souhaitez vérifier.
2. Collez le hash encodé complet, par exemple une chaîne commençant par `$argon2id$`.
3. Saisissez le secret uniquement si le hash d’origine a été créé avec un secret.
4. Lancez la vérification et consultez le résultat : correspondance, non-correspondance ou hash invalide.

## Notes de sécurité

La vérification s’effectue localement dans votre navigateur, mais les mots de passe et hashes collés peuvent rester en mémoire jusqu’à ce que vous réinitialisiez le formulaire ou fermiez l’onglet. Évitez d’utiliser des identifiants de production sur des appareils partagés. Pour les nouveaux systèmes de stockage de mots de passe, Argon2id est généralement la variante Argon2 à privilégier, car elle équilibre la résistance aux canaux auxiliaires et aux GPU.
