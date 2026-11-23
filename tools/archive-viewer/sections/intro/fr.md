Ouvrez une archive 7z, RAR, ZIP ou TAR pour parcourir ses dossiers avant toute extraction. Sélectionnez un fichier pour en afficher un aperçu ou le télécharger séparément.

## Quand l'utiliser

Utilisez-la lorsque vous recevez un paquet compressé et souhaitez y jeter un coup d'œil rapide sans décompresser toute l'archive. Elle est utile pour vérifier des paquets de publication, des modèles téléchargés, des paquets de journaux, des instantanés de code source ou une pièce jointe `.gz` constituée d'un seul fichier.

## Confidentialité et traitement des fichiers

Le contenu des archives est lu localement dans votre session du navigateur. Le fichier n'est pas envoyé à InBrowser.App. Les grandes entrées de texte sont limitées dans l'aperçu afin de garder la page réactive ; téléchargez l'entrée lorsque vous devez inspecter le fichier complet.

## Formats d'archive pris en charge

La visionneuse ouvre les formats ZIP, 7z, RAR4, RAR5, TAR, CPIO, AR (dont les paquets `.deb`), CAB, ISO 9660 et LHA. Elle ouvre aussi les fichiers seuls et les archives TAR compressés avec GZIP, Zstandard, XZ, BZIP2, LZ4, LZIP, LZMA ou l'utilitaire UNIX compress (`.Z`). Ouvrez par exemple un paquet de distribution `.tar.zst` pour parcourir ses dossiers, ou un journal `.zst` pour télécharger le fichier décompressé.

Utilisez un logiciel d'archivage installé sur votre ordinateur pour les fichiers chiffrés, les archives fractionnées, les archives solides RAR4 ou les entrées de plus de 512 Mio dans les formats récemment ajoutés. L'ouverture d'une archive solide volumineuse ou l'extraction de ses fichiers peut prendre plus de temps, car le décodeur peut avoir à traiter les entrées précédentes.

## Comportement de la prévisualisation

Les fichiers de type texte tels que JSON, Markdown, les journaux, le code source, CSV, XML, YAML et TOML peuvent être prévisualisés avec une coloration syntaxique lorsqu'un langage correspondant est disponible. Les fichiers image courants peuvent être affichés en aperçu, et les documents PDF s'ouvrent dans le lecteur PDF intégré du navigateur lorsqu'il est disponible. Les autres fichiers binaires restent téléchargeables, mais l'outil n'essaiera pas de les afficher.
