## Convertir les anciens classeurs Excel dans votre navigateur

Ouvrez ou déposez un fichier XLS local. Choisissez une feuille de calcul, examinez les données de ses cellules et téléchargez un classeur XLSX. Vous pouvez parcourir l’aperçu ou saisir l’adresse de la cellule en haut à gauche pour atteindre une autre zone. La fenêtre d’aperçu ne limite pas l’exportation : toutes les feuilles de calcul et leurs cellules importées sont incluses.

Les noms et l’ordre des feuilles de calcul, les feuilles vides, les états de masquage des feuilles, les textes, les nombres, les booléens, les erreurs de la feuille de calcul, les formats numériques pris en charge, les cellules fusionnées, les hauteurs de ligne, les largeurs de colonne ainsi que les lignes et colonnes masquées sont conservés lorsque l’analyseur du fichier source les prend en charge. Les identifiants textuels conservent leurs zéros initiaux. Les dates conservent les numéros de série Excel et le système de dates du classeur.

## Formules et compatibilité

Les expressions de formule prises en charge et leurs résultats enregistrés sont conservés. Le navigateur ne recalcule pas les formules et n’actualise pas les données externes. Une formule sans résultat enregistré est signalée dans l’aperçu ; son expression reste dans le fichier de sortie pour qu’un tableur puisse la calculer. Les expressions de formule non prises en charge ou les références externes peuvent ne pas être correctement conservées lors de la conversion.

Il s’agit d’une conversion des données, et non d’une reproduction fidèle de toutes les fonctionnalités du classeur. Les graphiques, images, macros, fonctionnalités de tableaux croisés dynamiques et styles avancés ne sont pas conservés. L’aperçu ne reproduit pas la disposition des cellules fusionnées ni la mise en forme. Vérifiez le classeur téléchargé dans votre tableur, en particulier lorsque les formules ou la disposition sont importantes. Les feuilles de macros, les feuilles de graphique, les fichiers chiffrés, les fichiers endommagés et les fichiers simplement renommés en .xls ne sont pas pris en charge.

## Traitement local

Votre classeur est traité dans ce navigateur sans que son contenu soit envoyé à un serveur. Les macros ne sont pas exécutées et les ressources liées ne sont pas récupérées. Remplacer ou fermer le classeur supprime le résultat ; annuler arrête la conversion. Aucune limite fixe n’est imposée à la taille des fichiers ni au nombre de feuilles de calcul, mais les classeurs volumineux dépendent toujours de la mémoire disponible dans le navigateur.

Pour consulter d’autres formats de feuilles de calcul, ouvrez la [Visionneuse de feuilles de calcul](../xlsx-viewer/).
