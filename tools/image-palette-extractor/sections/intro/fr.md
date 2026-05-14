## Ce que fait cet outil

Image Palette Extractor trouve les couleurs dominantes d'une image directement
dans votre navigateur. Il échantillonne l'image, regroupe les pixels
visuellement similaires et renvoie une palette pratique avec les valeurs HEX,
RGB, HSL et les pourcentages de chaque couleur.

## Bons cas d'utilisation

- Extraire les couleurs de marque ou de produit d'une capture d'écran, d'un
  logo, d'une photo ou d'une maquette.
- Créer rapidement une palette CSS pour une page de destination, une miniature
  ou une transmission aux designers.
- Comparer la part d'une image portée par une couleur dominante par rapport aux
  accents secondaires.
- Travailler avec des images privées sans envoyer le fichier à un serveur.

## Options d'exportation

Le résultat peut être copié comme une simple liste HEX, des propriétés
personnalisées CSS ou du JSON. Le format CSS est utile lorsque vous voulez des
variables comme `--palette-1`, tandis que JSON conserve ensemble les formats de
couleur et le ratio de dominance pour les scripts ou l'automatisation de design.

## Points à surveiller

- L'extraction de palette est approximative. Elle vise à produire des groupes
  visuels utiles, pas un inventaire complet de chaque couleur de pixel.
- Les pixels transparents sont ignorés par défaut afin que les icônes et les
  détourages ne faussent pas la palette ; désactivez ce réglage lorsque la
  transparence elle-même fait partie du visuel.
- Le réglage de qualité précise échantillonne plus de pixels et peut être plus
  lent sur les très grandes images.
