## Comment agrandir une image avec l’IA ?

1. Sélectionnez ou déposez une image JPG, PNG ou WebP. Utilisez la meilleure version dont vous disposez, même si elle est petite.
2. Choisissez **2×** ou **4×** et vérifiez les dimensions de sortie. Une image de 400 × 300 passe à 800 × 600 en 2× ou à 1600 × 1200 en 4×.
3. Cliquez sur **Agrandir l’image**, puis déplacez le curseur de comparaison pour examiner les contours et les textures. Téléchargez le résultat en PNG sans perte.

## Qu’est-ce que la super-résolution d’image par IA ?

La super-résolution augmente les dimensions en pixels d’une image de faible résolution. InBrowser.App utilise Real-ESRGAN, un modèle entraîné à estimer les contours et les textures plus fins à partir des pixels disponibles. Il peut rendre plus nettes les petites photos, les illustrations et les images Web compressées lorsqu’elles sont agrandies. Vérifiez les visages, les petits caractères et les motifs fins dans l’aperçu. Les détails ajoutés sont des estimations et peuvent différer de la scène d’origine.

## Quand choisir un agrandissement en 2× ou en 4× ?

Choisissez 2× pour un agrandissement modéré, par exemple pour intégrer une miniature à une mise en page plus grande. Choisissez 4× si l’image doit occuper beaucoup plus de place, par exemple pour afficher un petit scan en grand format. Doubler les dimensions multiplie le nombre de pixels par quatre. Les quadrupler le multiplie par seize. L’image d’origine peut mesurer jusqu’à 2 048 pixels par côté, dans la limite de 1 mégapixel au total.

## L’image est-elle agrandie sur mon appareil ?

Oui. Votre navigateur télécharge le modèle Real-ESRGAN lorsque vous lancez votre premier agrandissement. Il traite l’image sur votre appareil avec WebGPU si cette technologie est disponible, ou utilise le processeur via WebAssembly. Le premier agrandissement peut prendre plus de temps. La durée du traitement dépend des dimensions de l’image et de votre appareil. L’image reste sur votre appareil tout au long du processus.
