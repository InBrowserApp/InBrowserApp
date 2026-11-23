## Convertir un WebP animé en GIF

Un WebP animé regroupe plusieurs images dans un seul fichier `.webp`. Convertissez
l’animation en GIF pour une messagerie, un site de documentation ou toute autre
destination qui exige ce format. L’outil accepte les WebP animés avec ou sans
perte de qualité. La conversion se fait sur votre appareil.

### Comment convertir un WebP animé en GIF

1. Cliquez sur **Choisir un fichier** ou déposez un WebP animé dans l’outil.
2. Cliquez sur **Créer le GIF** pour convertir les images à leurs dimensions
   d’origine.
3. Cliquez sur **Lire** pour vérifier le GIF, puis sur **Télécharger le GIF**
   pour l’enregistrer.

### Que deviennent les durées d’affichage et les boucles ?

Chaque image conserve sa durée d’affichage, arrondie par pas de 10 ms, avec un
minimum de 20 ms à la lecture. Par exemple, des images de 100 ms et de 250 ms
conservent chacune leur durée. Le GIF conserve le nombre total de lectures
défini dans le WebP. Si le WebP tourne en boucle infinie, le GIF aussi.

### Comment le GIF gère-t-il la transparence et les couleurs ?

Le GIF utilise une palette indexée de 256 entrées au maximum par image, dont
une seule entrée transparente. Le WebP accepte la transparence partielle.
Les ombres translucides et les contours lissés peuvent donc apparaître
différemment dans le GIF. Des bandes de couleur peuvent aussi apparaître dans
les images riches en couleurs. Vérifiez l’aperçu sur le fond que vous comptez
utiliser.

### Questions fréquentes

#### Puis-je convertir un WebP fixe ?

Cet outil a besoin d’images d’animation. L’extension `.webp` s’applique
aux images fixes comme animées. Pour créer une animation à partir de
plusieurs images fixes, utilisez le [Créateur de GIF](/fr/tools/gif-maker/).

#### Pourquoi le GIF est-il plus lourd que le WebP ?

Le WebP compresse efficacement les couleurs et les zones qui changent d’une
image à l’autre. Le GIF peut peser plus lourd, même avec les mêmes dimensions
et durées d’affichage. Si la destination impose une taille maximale,
vérifiez la taille affichée à côté de l’aperçu.

### Outils d’animation associés

Utilisez le [convertisseur de GIF en WebP animé](/fr/tools/gif-to-animated-webp-converter/)
pour l’opération inverse ou le [convertisseur APNG en GIF](/fr/tools/apng-to-gif-converter/)
pour un PNG animé.
