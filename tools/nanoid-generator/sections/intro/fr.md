## Qu’est-ce que NanoID ?

NanoID est un générateur compact d’identifiants uniques, compatible avec les URL, conçu pour les applications web modernes, les API et les outils internes. Le format par défaut utilise 21 caractères issus d’un alphabet de 64 caractères, ce qui fournit environ 126 bits d’aléa tout en restant assez court pour les URL, les noms de fichiers et les jeux de données de test.

Tout dans cet outil s’exécute localement dans votre navigateur. Votre alphabet personnalisé et les identifiants générés ne quittent jamais la page, ce qui le rend pratique pour le prototypage rapide, la génération de fixtures et les tâches opérationnelles ponctuelles.

**Points clés :**

- **Compatible URL** : utilise A-Z, a-z, 0-9, - et \_.
- **Personnalisable** : adaptez la longueur et l’alphabet à vos contraintes.
- **Aléa sécurisé** : utilise des valeurs aléatoires cryptographiques dans le navigateur.
- **Export en texte brut** : copiez ou téléchargez le lot actuel lorsque vous avez besoin de données d’amorçage, de contenu de démonstration ou de listes prêtes à importer.

**Conseils pratiques :**

- Conservez la longueur par défaut de 21 caractères si vous voulez un identifiant polyvalent robuste avec un risque de collision très faible.
- Des identifiants plus courts conviennent pour des jetons UI temporaires ou des données mock locales, mais le risque de collision augmente quand la longueur diminue ou que la taille du lot augmente.
- Un alphabet plus grand apporte davantage d’entropie par caractère, ce qui permet souvent de raccourcir les identifiants sans trop sacrifier leur unicité.
- Les alphabets personnalisés ne devraient contenir que des caractères uniques. Les doublons faussent la distribution, c’est pourquoi cet outil les bloque avant de générer le résultat.
