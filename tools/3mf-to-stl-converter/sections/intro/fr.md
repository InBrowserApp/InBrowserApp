## Convertir un fichier 3MF en STL

Cliquez sur **Ouvrir un fichier** ou déposez un `.3mf` dans le convertisseur. L’outil lit le modèle sur votre appareil et produit un STL binaire. Cliquez sur **Essayer un exemple** pour utiliser un modèle avec deux supports de fixation colorés, puis sur **Télécharger le STL** pour enregistrer le résultat.

## Conserver les dimensions et le placement des pièces

Le convertisseur exporte les coordonnées du maillage en millimètres. Les pièces conservent leur position relative sur le plateau d’impression, y compris les exemplaires répétés. Si une pièce mesure un pouce dans le 3MF, elle mesure 25,4 unités de coordonnées dans le STL. Sélectionnez les millimètres si le logiciel vous demande une unité à l’importation du STL.

## Vérifier le contenu du fichier STL

Le convertisseur lit les maillages triangulaires stockés dans le 3MF. Si le modèle dépend d’un treillis de poutres ou d’une autre extension géométrique, exportez d’abord un maillage triangulaire depuis le logiciel d’origine. Le STL contient les triangles de la surface. Conservez le 3MF d’origine pour retrouver les couleurs, les matériaux ou les paramètres de tranchage. Ouvrez le résultat dans la [Visionneuse STL](../stl-viewer/) ou examinez le fichier source dans la [Visionneuse 3MF](../3mf-viewer/). Utilisez le [Convertisseur STL en 3MF](../stl-to-3mf-converter/) si l’étape suivante exige un fichier 3MF. [À propos du format 3MF](https://3mf.io/resources/faq/)
