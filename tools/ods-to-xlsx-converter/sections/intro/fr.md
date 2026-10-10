## Convertir des feuilles de calcul OpenDocument en Excel

Ouvrez ou déposez un fichier ODS local, examinez ses cellules et téléchargez un classeur XLSX. Les noms et l’ordre des feuilles de calcul, les feuilles masquées, les textes, nombres, booléens, dates, résultats enregistrés des formules et cellules fusionnées sont inclus. Les feuilles vides et les espaces entre les cellules sont conservés. La fenêtre d’aperçu ne limite pas les données exportées.

## Valeurs enregistrées et compatibilité

Les formules sont remplacées par leurs valeurs enregistrées, et non par des formules Excel. L’absence de résultat enregistré est signalée et les cellules concernées restent vides. Le navigateur ne recalcule pas les formules et n’actualise pas les données externes. Les résultats en erreur deviennent des erreurs génériques de tableur. Le texte littéral reste du texte, y compris les identifiants avec des zéros initiaux, les caractères non latins et le texte commençant par un signe égal.

Les dates utilisent un format standard de date et d’heure ; les dates dont le fuseau horaire est précisé sont converties en UTC. Les durées restent exprimées en nombre de jours et les pourcentages utilisent un format de pourcentage simple. Les valeurs monétaires conservent leur nombre, sans le libellé de la devise ni la mise en forme d’origine. Les styles, dimensions des lignes et colonnes, graphiques, images, commentaires, liens, macros et paramètres du classeur ne sont pas reproduits.

Les fichiers chiffrés, les archives non valides, les données non prises en charge et les valeurs ou noms de feuille dépassant les limites d’Excel produisent une erreur explicite. Ce convertisseur n’accepte pas les fichiers Flat OpenDocument (.fods). Vérifiez les résultats importants dans votre tableur après le téléchargement.

## Traitement local

La conversion s’effectue dans ce navigateur sans envoyer le document à un serveur. Remplacer ou fermer le fichier supprime le résultat précédent préparé pour le téléchargement ; annuler arrête la tâche en arrière-plan. Aucune limite fixe n’est imposée à la taille des fichiers ni au nombre de feuilles de calcul. La mémoire disponible dans le navigateur détermine toutefois les classeurs qui peuvent être traités.

Pour consulter des fichiers ODS et d’autres formats de feuilles de calcul, ouvrez la [Visionneuse de feuilles de calcul](../xlsx-viewer/).
