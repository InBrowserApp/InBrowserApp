## Convertir un PNG animé en GIF

Le format APNG regroupe plusieurs images dans un fichier PNG. La conversion
en GIF permet de partager l’animation dans une messagerie, sur un forum ou
dans une documentation qui exige ce format. Les fichiers animés peuvent porter
l’extension `.apng` ou `.png`. Le convertisseur lit l’animation dans le
fichier et la traite sur votre appareil.

### Comment convertir un APNG en GIF

1. Cliquez sur **Choisir un fichier** ou déposez un PNG animé dans l’outil.
2. Cliquez sur **Créer le GIF** pour convertir les images à leurs dimensions
   d’origine.
3. Cliquez sur **Lire** pour vérifier le GIF, puis sur **Télécharger le GIF**
   pour l’enregistrer.

### Que deviennent les durées d’affichage et les boucles ?

Chaque image conserve sa durée d’affichage, arrondie par pas de 10 ms, avec un
minimum de 20 ms à la lecture. Par exemple, des images de 100 ms et de 250 ms
conservent chacune leur durée. Le GIF conserve aussi le nombre de lectures
du fichier source, qu’il soit lu une seule fois, plusieurs fois ou en boucle
infinie. Avec un nombre de lectures défini, le format GIF accepte jusqu’à
65 536 lectures au total.

### Comment le GIF gère-t-il la transparence et les couleurs ?

Le format APNG permet la transparence partielle et une gamme de couleurs plus
large. Le GIF utilise une palette indexée de 256 entrées au maximum par
image, dont une seule entrée transparente. Les contours doux et les ombres
peuvent alors ressortir davantage, et des bandes peuvent apparaître dans
les dégradés. Vérifiez l’aperçu du GIF avant le partage. Si la destination
accepte le PNG animé, le fichier source conserve ses couleurs et sa transparence
partielle.

### Questions fréquentes

#### Puis-je convertir un PNG ordinaire ?

L’outil a besoin de données d’animation PNG. Un fichier portant l’extension
`.png` peut être animé. Si l’animation contient une image de secours pour les
visionneuses PNG statiques, le GIF commence à la première image de l’animation.

#### Le GIF sera-t-il plus léger que l’APNG ?

La taille du fichier dépend des dimensions, du nombre d’images et du niveau de
détail. Le GIF peut être plus lourd, surtout si le fichier APNG d’origine
enregistre uniquement les petites zones qui changent d’une image à l’autre.
Consultez la taille du fichier à côté de l’aperçu du GIF.

### Outils d’animation associés

Utilisez le [convertisseur GIF en APNG](/fr/tools/gif-to-apng-converter/) pour
l’opération inverse ou le
[convertisseur WebP animé en GIF](/fr/tools/animated-webp-to-gif-converter/)
pour un fichier WebP.
