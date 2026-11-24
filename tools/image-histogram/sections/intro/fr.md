## Comment afficher l’histogramme d’une image

Choisissez ou déposez une photo, une capture d’écran ou une illustration pour voir son histogramme à côté de l’image. Vous pouvez aussi essayer la photo d’exemple. Commencez par **Luminosité** pour voir la répartition générale des tons, puis passez à **RVB** pour comparer les canaux rouge, vert et bleu sur la même échelle. Sélectionnez un canal pour l’examiner en détail.

## Comment lire les ombres, les tons moyens et les hautes lumières

L’axe horizontal va de 0 (le plus sombre) à 255 (le plus clair). Les ombres sont à gauche, les tons moyens au centre et les hautes lumières à droite. Plus une barre est haute, plus il y a de pixels au niveau correspondant. Survolez le graphique, touchez le niveau qui vous intéresse ou déplacez le curseur de niveau avec les touches fléchées pour lire le nombre exact de pixels.

Un pic à l’une des extrémités peut signaler un écrêtage des ombres ou des hautes lumières, avec une possible perte de détails. Un pic à 255 sur le canal rouge, par exemple, peut révéler un écrêtage sur ce canal même s’il reste de la marge à droite sur l’histogramme de luminosité. Un fond blanc pur peut aussi produire un pic à l’extrémité droite. Consultez l’aperçu de l’image pour interpréter ce pic. Les indicateurs **Ombres** et **Hautes lumières** donnent la proportion de pixels analysés qui se trouvent exactement aux niveaux 0 et 255, respectivement.

## Quand utiliser une échelle logarithmique

Choisissez l’échelle **Linéaire** pour que la hauteur de chaque barre soit proportionnelle au nombre de pixels. Essayez l’échelle **Logarithmique** quand une grande zone de couleur uniforme rend le reste de l’histogramme difficile à lire. L’échelle change la hauteur des barres. Le nombre de pixels par niveau reste identique.

## Ce que mesure la visionneuse

La visionneuse compte les pixels de l’image 8 bits rendue par le navigateur, à ses dimensions d’origine. La luminosité est calculée en combinant les valeurs des canaux rouge, vert et bleu, avec une pondération plus forte pour le vert. Les pixels entièrement transparents sont ignorés et chaque pixel partiellement transparent est compté une fois. Ses valeurs RVB peuvent être arrondies lors du rendu. Pour une image animée, l’analyse porte sur une seule image fixe. Vos images sont traitées sur votre appareil.
