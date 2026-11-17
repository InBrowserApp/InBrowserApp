## Explorer des bases SQLite dans votre navigateur

Ouvrez une base SQLite 3 pour parcourir les tables et les vues, examiner les colonnes, les index, les clés étrangères et les instructions CREATE, ou exécuter une requête SQL en lecture seule. Essayez la base d’exemple pour explorer l’espace de travail. Votre fichier est traité localement et n’est jamais modifié.

## Interroger et exporter les résultats

Sélectionnez une table ou une vue pour charger ses lignes, puis modifiez le SQL pour filtrer, trier ou joindre les données. Exécutez une seule instruction SELECT, WITH ou EXPLAIN avec **Exécuter la requête** ou **Ctrl/⌘ + Entrée**. Cliquez sur une cellule pour examiner et copier sa valeur complète.

Choisissez une limite de résultats de 100, 1 000 ou 10 000 lignes et parcourez le résultat à raison de 50 lignes par page. Les requêtes sont limitées à 10 secondes et les résultats à 5 Mio. Les exports CSV et JSON comprennent toutes les lignes chargées, sur toutes les pages.

Le JSON utilise des tableaux distincts pour les noms de colonnes et les lignes afin de préserver les noms en double et les valeurs NULL. Les entiers sont des chaînes décimales exactes et les BLOB contiennent une valeur hexadécimale `$blob`. Le CSV comprend une ligne d’en-tête, utilise des champs vides pour NULL et préfixe les textes ressemblant à des formules par une apostrophe.

## Fichiers SQLite pris en charge

Ouvrez un fichier `.db`, `.sqlite` ou `.sqlite3` non chiffré de 50 Mio maximum. Si la base utilise WAL, créez une copie après un checkpoint avant de l’ouvrir ; les fichiers annexes WAL et journal ne sont pas chargés. Les extensions SQLite personnalisées ne sont pas prises en charge. Les fichiers et les requêtes ne sont pas enregistrés automatiquement.
