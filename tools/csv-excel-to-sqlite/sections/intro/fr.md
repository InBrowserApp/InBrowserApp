## Convertir des fichiers CSV et Excel en base SQLite

Ajoutez un ou plusieurs fichiers CSV ou Excel (.xlsx ou .xls). Chaque fichier CSV et chaque feuille Excel contenant des données donne lieu à une table distincte dans la même base. Vérifiez les colonnes dans l’aperçu et renommez les tables si besoin, puis sélectionnez **Créer la base SQLite**. La conversion s’effectue dans votre navigateur et les fichiers restent sur votre appareil.

## Comment les données sont importées dans les tables

Par défaut, la première ligne fournit les noms des colonnes. Pour une table sans en-tête, décochez **Utiliser la première ligne comme en-tête**. Cette ligne est alors importée comme donnée et des noms tels que `column_1` sont générés. Les noms de tables ou de colonnes en double reçoivent des suffixes numérotés. Vous pouvez ainsi ajouter un autre fichier du même nom tout en conservant les deux tables.

Le convertisseur détecte les colonnes numériques et conserve les zéros en tête des identifiants textuels comme `00123`. Les cellules vides sont importées avec la valeur SQL `NULL`. Les dates Excel sont stockées sous forme de texte au format ISO, avec ou sans heure. Pour les formules, l’outil utilise les résultats enregistrés dans le classeur. Si nécessaire, recalculez les formules dans Excel, puis enregistrez le classeur avant de l’importer.

## Interroger la base avec SQL

Sélectionnez **Ouvrir dans la Visionneuse SQLite** pour parcourir les tables et exécuter une requête. Vous pouvez aussi télécharger le fichier `.sqlite` pour l’utiliser avec SQLite en ligne de commande, Python ou une autre application compatible. Par exemple, convertissez `orders.csv` et un classeur Excel contenant une feuille nommée `customers`. La requête suivante compte les commandes par client.

```sql
SELECT customers.name, COUNT(*) AS order_count
FROM orders
JOIN customers ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name;
```

Pour adapter cet exemple, reprenez les noms de tables et de colonnes affichés dans votre aperçu.
