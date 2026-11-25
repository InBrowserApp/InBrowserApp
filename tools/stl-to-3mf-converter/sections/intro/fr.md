## Convertir un fichier STL en 3MF

Sélectionnez l’**Unité des coordonnées STL**, puis cliquez sur **Ouvrir un fichier** ou déposez un `.stl` dans le convertisseur. Les fichiers STL ASCII et binaires sont pris en charge. Cliquez sur **Essayer un exemple** pour convertir un support de fixation, puis sur **Télécharger le 3MF** pour enregistrer le modèle. Si vous changez d’unité, le fichier actuel est converti de nouveau.

## Choisir les bonnes dimensions pour le logiciel de tranchage

Le format STL stocke les coordonnées sans préciser leur unité. Choisissez celle utilisée dans le fichier source. Par exemple, une pièce qui mesure 2 unités de coordonnées STL fait 2 pouces de large si vous choisissez les pouces, ou 2 millimètres si vous choisissez les millimètres. Le fichier 3MF enregistre cette échelle pour que les logiciels de tranchage compatibles ouvrent le modèle aux dimensions prévues.

## Vérifier le modèle 3MF ou effectuer la conversion inverse

Le 3MF conserve les triangles d’origine. Le convertisseur enregistre un solide si chaque composante du maillage est fermée et que ses faces sont orientées de façon cohérente vers l’extérieur. Un maillage ouvert, incohérent ou comportant des composantes orientées vers l’intérieur, comme les parois d’une cavité fermée, est enregistré comme surface en conservant les triangles d’origine. Choisissez les matériaux et les paramètres d’impression dans votre logiciel de tranchage. Ouvrez le résultat dans la [Visionneuse 3MF](../3mf-viewer/) pour vérifier les dimensions, ou examinez le fichier d’origine dans la [Visionneuse STL](../stl-viewer/). Utilisez le [Vérificateur de volume et de topologie de maillage](../mesh-inspector/) si le maillage source présente des ouvertures ou d’autres défauts de topologie. Pour la conversion inverse, utilisez le [Convertisseur 3MF en STL](../3mf-to-stl-converter/). [À propos du format 3MF](https://3mf.io/resources/faq/)
