## Comment convertir un SVG en PDF

1. Déposez un fichier `.svg` dans le convertisseur ou cliquez sur **Choisir un SVG**. Sélectionnez **Essayer un exemple** pour voir comment fonctionne l’exportation.
2. Vérifiez l’aperçu du SVG. Gardez **Dimensions d’origine du SVG** pour créer une page aux dimensions de votre logo, icône ou illustration. Choisissez **A4** ou **Lettre US** si vous avez besoin d’un format de papier standard.
3. Sélectionnez **Télécharger le PDF** pour enregistrer un PDF d’une page qui reprend le nom de votre SVG. La conversion s’effectue dans votre navigateur et le fichier SVG reste sur votre appareil.

## Quels éléments restent vectoriels dans le PDF ?

Les tracés, les formes, les remplissages et les contours sont dessinés directement dans le PDF. Les logos, les schémas et les dessins au trait restent ainsi nets à l’impression et au zoom. Les images matricielles intégrées et prises en charge, comme les photos PNG, conservent leur résolution d’origine. Agrandissez le PDF pour vérifier les traits fins et les courbes avant de le partager.

## Comment les dimensions de la page PDF sont-elles déterminées ?

L’option **Dimensions d’origine du SVG** reprend les dimensions du document SVG ou les déduit de son attribut `viewBox`. La conversion suit le rapport standard de 96 pixels SVG par pouce. Par exemple, un SVG de 960 × 480 px donne une page PDF de 10 × 5 pouces. Les formats **A4** et **Lettre US** centrent le dessin avec des marges, conservent ses proportions et adaptent l’orientation de la page à l’illustration.

## Pourquoi le PDF diffère-t-il de l’aperçu du SVG ?

L’aperçu utilise le moteur de rendu SVG de votre navigateur. Le moteur PDF prend en charge les éléments vectoriels courants, mais certaines polices personnalisées, certains filtres, masques et effets peuvent s’afficher différemment ou être omis. Les ressources externes sont ignorées. Pour un rendu fiable des textes et des couleurs, vectorisez le texte dans votre logiciel de dessin, intégrez vos images PNG ou JPEG, simplifiez les effets complexes et vérifiez le PDF téléchargé avant de l’imprimer.
