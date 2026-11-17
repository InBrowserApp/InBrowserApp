## Examiner des fichiers SQLite localement

Ouvrez une base SQLite 3 pour parcourir ses tables et ses vues, examiner les définitions de colonnes, les index, les clés étrangères et les instructions CREATE, ou exécuter une requête SQL en lecture seule. Essayez la base d’exemple pour explorer l’espace de travail sans choisir de fichier. Les fichiers et les requêtes restent dans votre navigateur et ne sont pas enregistrés automatiquement.

## Interroger et exporter les résultats

Sélectionnez une table pour afficher ses lignes. Modifiez le SQL et utilisez **Exécuter la requête** ou **Ctrl/⌘ + Entrée** pour exécuter une seule instruction SELECT, WITH ou EXPLAIN. La limite de résultats borne le nombre de lignes chargées ; la pagination affiche 50 lignes à la fois. Une requête peut également s’arrêter lorsque les résultats atteignent 5 Mio ou après 10 secondes. L’annulation garde l’interface réactive et recharge l’instantané de la base lors de la requête suivante.

Les exports CSV et JSON contiennent le résultat chargé, y compris les lignes des autres pages. Le JSON conserve les noms de colonnes et les lignes dans des tableaux distincts, préservant ainsi les noms en double et les valeurs NULL. Les entiers SQLite deviennent des chaînes décimales exactes et les BLOB deviennent des objets avec une valeur hexadécimale `$blob`. Le CSV utilise des champs vides pour NULL, encadre les caractères spéciaux de guillemets et préfixe les textes ressemblant à des formules par une apostrophe pour une utilisation plus sûre dans un tableur.

## Bases prises en charge et limites

Ouvrez un fichier `.db`, `.sqlite` ou `.sqlite3` non chiffré de 50 Mio maximum. Le fichier d’origine n’est jamais modifié. Cet outil charge un instantané en mémoire : la mémoire utilisée peut donc dépasser la taille du fichier. Les fichiers annexes WAL et journal ne sont pas importés ; créez une copie propre après un checkpoint dans votre application de base de données avant de l’ouvrir ici. Les bases chiffrées, les extensions SQLite personnalisées et la modification de bases ne sont pas prises en charge.
