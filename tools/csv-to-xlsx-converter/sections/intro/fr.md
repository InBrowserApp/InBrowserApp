## Convertir du texte délimité en Excel

Ouvrez ou déposez un fichier CSV ou TSV local, examinez les cellules et téléchargez un classeur XLSX contenant une seule feuille de calcul nommée Sheet1. Choisissez le séparateur et l’encodage du texte si la détection automatique ne correspond pas au fichier. Les fichiers TSV utilisent des tabulations par défaut. La fenêtre d’aperçu ne limite pas les données exportées.

## Conserver les identifiants et le texte d’origine

Les formats CSV et TSV n’enregistrent pas les types de cellules d’une feuille de calcul. Ce convertisseur conserve chaque champ sous forme de texte, y compris les zéros initiaux, les identifiants longs, les valeurs ressemblant à des nombres décimaux, les dates et le texte commençant par un signe égal. Il n’interprète pas les nombres ou les dates comme tels et n’exécute pas de formules. Les séparateurs entre guillemets, les guillemets échappés, Unicode, les sauts de ligne à l’intérieur des champs, les champs vides et les enregistrements vides sont conservés. Les lignes plus courtes laissent des cellules vides. Un saut de ligne final termine le dernier enregistrement au lieu d’ajouter une ligne supplémentaire.

Le réglage de la première ligne permet de choisir entre des données ordinaires et un en-tête avec des filtres Excel. Les deux options conservent la ligne telle quelle, y compris les en-têtes en double ou vides. L’encodage automatique prend en charge l’UTF-8 et l’UTF-16 muni d’une marque d’ordre des octets. Les autres encodages peuvent être sélectionnés manuellement. Une directive sep= en début de fichier n’est omise que si la détection automatique du séparateur est sélectionnée ou si son séparateur correspond à celui choisi.

Les champs entre guillemets mal formés, un encodage de texte non valide et les données dépassant les limites d’Excel en matière de lignes, de colonnes ou de longueur de texte par cellule produisent une erreur plutôt qu’un classeur tronqué. Après le téléchargement, vérifiez les valeurs importantes dans un tableur.

## Traitement local

La conversion s’effectue dans ce navigateur sans envoyer le fichier à un serveur. Modifier les paramètres d’importation, remplacer ou fermer le fichier supprime le résultat précédent. L’annulation arrête le processus en arrière-plan. Aucune limite fixe n’est imposée à la taille des fichiers ; la mémoire disponible dans le navigateur détermine quels fichiers peuvent être traités.

Pour consulter des fichiers de feuilles de calcul, ouvrez la [Visionneuse de feuilles de calcul](../xlsx-viewer/).
