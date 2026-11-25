## Générer des ISBN-10 ou ISBN-13 aléatoires

Choisissez `ISBN-13` pour les formulaires actuels de catalogage et de vente de livres, ou `ISBN-10` pour les notices anciennes. Indiquez une quantité de `1` à `1000`, choisissez d’inclure ou non les tirets, puis sélectionnez **Générer**. Copiez le lot ou téléchargez un fichier TXT contenant un ISBN par ligne.

## Comprendre le format et le chiffre de contrôle

Le numéro international normalisé du livre (ISBN) identifie l’édition et le format d’un livre. Les valeurs `ISBN-13` générées utilisent le préfixe `978` et se terminent par un chiffre de contrôle numérique. Un `ISBN-10` peut se terminer par `X`, qui représente dix dans le calcul de la somme de contrôle. Voici deux exemples : `978-0-306-40615-7` et `0-8044-2957-X`. Les tirets facilitent la lecture des groupes sans modifier le chiffre de contrôle.

## Utiliser les résultats comme données de test

Utilisez ces identifiants d’exemple pour tester les formulaires de catalogage, les importations et la validation des ISBN. Pour tester une erreur de somme de contrôle, remplacez uniquement le dernier caractère par un autre chiffre, puis réessayez l’importation. Dans un tableur ou une base de données, stockez les ISBN sous forme de texte pour conserver un zéro initial ou un `X` final. Pour un livre publié, relevez son ISBN sur la couverture de l’édition ou dans la notice de l’éditeur.
