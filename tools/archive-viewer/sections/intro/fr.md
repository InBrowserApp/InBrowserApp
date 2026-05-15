Une visionneuse d'archives vous permet d'inspecter un fichier compressé avant de l'extraire. Cet outil ouvre les fichiers ZIP, TAR, GZ, TGZ et TAR.GZ directement dans le navigateur afin que vous puissiez vérifier ce qu'ils contiennent, parcourir les dossiers, afficher un aperçu des fichiers lisibles et télécharger uniquement l'entrée dont vous avez besoin.

## Quand l'utiliser

Utilisez-la lorsque vous recevez un paquet compressé et souhaitez y jeter un coup d'œil rapide sans décompresser toute l'archive. Elle est utile pour vérifier des paquets de publication, des modèles téléchargés, des paquets de journaux, des instantanés de code source ou une pièce jointe `.gz` constituée d'un seul fichier.

## Confidentialité et traitement des fichiers

Le contenu des archives est lu localement dans votre session du navigateur. Le fichier n'est pas envoyé à InBrowser.App. Les grandes entrées de texte sont limitées dans l'aperçu afin de garder la page réactive ; téléchargez l'entrée lorsque vous devez inspecter le fichier complet.

## Formats d'archive pris en charge

La visionneuse prend en charge les archives ZIP standard, les fichiers TAR non compressés, les fichiers uniques compressés avec GZIP et les archives TAR encapsulées dans GZIP (`.tgz` ou `.tar.gz`). Les archives protégées par mot de passe ou chiffrées ne sont pas prises en charge dans cette première phase de réécriture.

## Comportement de la prévisualisation

Les fichiers de type texte tels que JSON, Markdown, les journaux, le code source, CSV, XML, YAML et TOML peuvent être prévisualisés avec une coloration syntaxique lorsqu'un langage correspondant est disponible. Les fichiers image courants peuvent être affichés en aperçu, et les documents PDF s'ouvrent dans le lecteur PDF intégré du navigateur lorsqu'il est disponible. Les autres fichiers binaires restent téléchargeables, mais l'outil n'essaiera pas de les afficher.
