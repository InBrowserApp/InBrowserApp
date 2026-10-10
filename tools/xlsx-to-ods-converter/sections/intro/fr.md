## Convertir des classeurs Excel en OpenDocument

Ouvrez ou déposez un fichier XLSX local, examinez ses cellules et téléchargez un classeur ODS. Les noms et l’ordre des feuilles de calcul, les feuilles vides et masquées, les positions des cellules, les textes, nombres, booléens, dates et résultats enregistrés des formules sont inclus. La fenêtre d’aperçu ne limite pas les données exportées. Les feuilles très masquées deviennent des feuilles masquées ordinaires.

## Valeurs enregistrées et compatibilité

Les formules sont remplacées par leurs valeurs enregistrées. Les résultats manquants sont signalés et les cellules concernées restent vides ; le navigateur ne recalcule pas les formules et n’actualise pas les données externes. Les résultats en erreur du tableur deviennent du texte brut. Les identifiants avec des zéros initiaux, les caractères non latins et le texte littéral commençant par un signe égal restent du texte.

Les dates respectent le système de dates 1900 ou 1904 du classeur et utilisent un format standard de date et d’heure. Les valeurs contenant uniquement une heure et les durées utilisent un format de durée simple. Les pourcentages et les valeurs monétaires conservent leur nombre, sans la mise en forme d’origine ni le libellé de la devise. La date fictive du 29 février 1900 d’Excel et les formats de date personnalisés non pris en charge produisent une erreur plutôt qu’une date décalée.

Les styles, dimensions des lignes et colonnes, disposition des cellules fusionnées, graphiques, images, commentaires, liens, macros et paramètres du classeur ne sont pas reproduits. Les valeurs enregistrées dans les zones fusionnées restent à leur position de cellule d’origine. Ce convertisseur accepte les fichiers XLSX, mais pas XLS, XLSB ou XLSM. Les fichiers chiffrés, les archives non valides, les types de feuille non pris en charge et les données qui ne peuvent pas être représentées en ODS produisent une erreur explicite. Vérifiez les résultats importants dans votre tableur après le téléchargement.

## Traitement local

La conversion s’effectue dans ce navigateur sans envoyer le document à un serveur. Remplacer ou fermer le fichier supprime le résultat précédent préparé pour le téléchargement ; annuler arrête la tâche en arrière-plan. Aucune limite fixe n’est imposée à la taille des fichiers ni au nombre de feuilles de calcul. La mémoire disponible dans le navigateur détermine toutefois les classeurs qui peuvent être traités.

Pour consulter des fichiers Excel et d’autres formats de feuilles de calcul, ouvrez la [Visionneuse de feuilles de calcul](../xlsx-viewer/).
