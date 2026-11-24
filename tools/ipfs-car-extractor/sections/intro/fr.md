## Ouvrir un fichier CAR d’IPFS ou de Filecoin dans le navigateur

Sélectionnez un fichier `.car` sur votre appareil. L’extracteur lit l’archive localement et affiche son CID racine. Si l’archive contient plusieurs racines, choisissez celle qui vous intéresse. Les archives CAR (Content Addressable aRchives) sont utilisées par IPFS et Filecoin. Les catalogues de ressources d’Apple partagent la même extension et utilisent un format différent.

## Extraire des fichiers ou convertir un dossier CAR en ZIP

Ouvrez un dossier pour voir son contenu. Sélectionnez un fichier, puis choisissez **Télécharger le fichier** pour enregistrer ses octets d’origine. Pour exporter un dossier avec ses sous-dossiers, choisissez **Télécharger le ZIP**. Le ZIP conserve la structure des dossiers UnixFS.

## Que signifie un bloc manquant ?

Une archive CAR stocke son contenu sous forme de blocs identifiés par des CID. Une racine peut référencer des blocs situés en dehors d’une archive partielle. S’il manque un bloc requis par une entrée, récupérez une exportation complète auprès de la source ou téléchargez une entrée dont tous les blocs sont disponibles. Les fichiers CAR peuvent également contenir des données dans d’autres formats IPLD. Cet outil extrait les fichiers et les dossiers UnixFS. [Format CAR d’IPLD](https://ipld.io/specs/transport/car/)
