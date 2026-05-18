Le WebP animé peut conserver le mouvement d’un GIF tout en produisant souvent des fichiers plus petits pour les sites web, les aperçus produit, la documentation et les ressources adaptées aux discussions. Ce convertisseur s’exécute localement et, lorsque vous gardez les réglages par défaut d’échelle, de vitesse et de boucle, transmet le GIF original à un encodeur `gif2webp` sans perte en taille minimale avant d’exporter des fichiers `.webp`.

## Quand l’utiliser

Utilisez cet outil lorsque vous avez des GIF animés qui doivent passer à un format web plus moderne, en particulier pour les pages où la taille des fichiers et la vitesse de chargement comptent. Le WebP animé est pris en charge par les principaux navigateurs actuels et peut préserver la transparence, le minutage et le comportement de boucle.

## Options de conversion

L’échelle modifie chaque image avant l’encodage, ce qui est utile lorsqu’un GIF est plus grand que l’emplacement où il sera affiché. La vitesse modifie le rythme de lecture sans supprimer d’images. Le comportement de boucle peut suivre le GIF source, forcer une lecture infinie ou utiliser un nombre personnalisé pour les ressources qui doivent s’arrêter après un nombre précis de lectures. Garder l’échelle à 100%, la vitesse à 1x et le comportement de boucle sur Follow GIF utilise le parcours par défaut sans perte en taille minimale.

## Confidentialité et limites

La conversion s’exécute dans votre navigateur. Le WebP sans perte compresse généralement mieux les animations de style GIF, mais il ne peut pas garantir que chaque sortie sera plus petite ; les GIF minuscules ou déjà optimisés peuvent grossir, car le conteneur WebP a tout de même un surcoût. Modifier l’échelle, la vitesse ou le comportement de boucle nécessite de décoder les images et peut utiliser beaucoup de mémoire pour les GIF très volumineux. Si le GIF source ne contient pas de métadonnées de boucle, l’export par défaut est lu une seule fois, sauf si vous choisissez une boucle infinie ou personnalisée.
