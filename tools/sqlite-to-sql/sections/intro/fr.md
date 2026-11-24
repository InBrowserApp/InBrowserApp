## Comment exporter une base SQLite dans un fichier SQL

Ouvrez ou déposez un fichier de base SQLite 3 au format `.db`, `.sqlite` ou `.sqlite3`. L’outil génère automatiquement un script SQL. Activez **Schéma uniquement** pour exporter la structure sans les données des tables, puis cliquez sur **Télécharger le fichier .sql** pour enregistrer le script complet. Essayez la base d’exemple pour voir à quoi ressemble le résultat.

## Que contient un export SQL de SQLite ?

Un export SQL se présente sous la forme d’un script texte qui permet de recréer la base. Il contient des instructions `CREATE` pour les tables, les index, les vues et les déclencheurs. L’export complet inclut aussi les instructions `INSERT` qui rétablissent les lignes des tables. Ce script permet d’examiner les modifications du schéma dans Git, de conserver une sauvegarde lisible ou de transférer la base vers un autre environnement SQLite.

Le fichier d’origine reste sur votre appareil. Si la base utilise un journal en écriture anticipée (WAL), exportez une copie autonome. Utilisez l’application d’origine ou la commande de sauvegarde de SQLite pour que la copie contienne les modifications validées dans le journal.

## Comment restaurer la base à partir du fichier SQL

Exécutez la commande suivante pour importer le script dans une nouvelle base SQLite.

```sh
sqlite3 restored.sqlite < database.sql
```

Remplacez `database.sql` par le nom du fichier téléchargé. Le script utilise la syntaxe de SQLite. Si la base utilise des tables virtuelles ou des extensions, restaurez-la dans une installation SQLite qui dispose des modules nécessaires.

Pour parcourir les tables ou exporter les résultats de requêtes au format CSV ou JSON, ouvrez la [Visionneuse SQLite](../sqlite-viewer/). Pour créer une base à partir de feuilles de calcul, utilisez le [Convertisseur CSV et Excel en SQLite](../csv-excel-to-sqlite/).
