## Comment convertir un fichier CB7 en PDF

Choisissez une BD `.cb7` ou déposez-la sur le convertisseur. Vous pouvez aussi utiliser une archive `.7z` qui contient les images d’une BD. Chaque image devient une page du PDF. Vérifiez l’aperçu, puis cliquez sur **Télécharger le PDF**. Par exemple, `volume-01.cb7` devient `volume-01.pdf`.

## Ordre des pages, qualité des images et recherche dans les dialogues

Un fichier CB7 contient les pages d’une BD dans une archive 7z. Le convertisseur trie les pages selon le chemin complet de leurs fichiers, en tenant compte des noms de dossier et des nombres. Ainsi, `chapter2/page2.jpg` précède `chapter2/page10.jpg`. Les pages verticales et les doubles pages larges gardent leurs proportions et leurs dimensions d’origine en pixels. Le convertisseur accepte les images JPEG, PNG, GIF, WebP et BMP, ainsi que les images AVIF si votre navigateur sait les lire.

Le texte des bulles fait toujours partie de l’image. Pour rechercher un mot dans les dialogues, ouvrez le PDF obtenu dans [OCR PDF](../pdf-ocr/) et choisissez la langue de la BD.

## Ouvrir une archive volumineuse ou protégée

La conversion se fait sur votre appareil et l’outil affiche le numéro de la page en cours. Dans une grosse archive 7z à compression solide, plusieurs images partagent un même bloc de données compressées. Leur lecture peut donc prendre plus de temps. Cliquez sur **Annuler la conversion** pour arrêter le traitement et choisir un autre fichier. Si l’archive est protégée par un mot de passe ou fractionnée, décompressez-la d’abord, puis regroupez les images dans une seule archive lisible. Pour parcourir la BD d’origine, utilisez le [Lecteur de BD CB7](../cb7-reader/). Pour une BD au format ZIP, utilisez le [Convertisseur CBZ en PDF](../cbz-to-pdf-converter/).
