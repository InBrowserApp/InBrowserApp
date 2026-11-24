## Créer un fichier CAR à partir de fichiers ou d’un dossier

Choisissez des fichiers ou un dossier, puis sélectionnez **Créer le CAR**. Copiez le CID racine et enregistrez l’archive `.car`. Le navigateur lit la sélection sur votre appareil et la regroupe dans une archive CARv1 avec une racine UnixFS. Vous pouvez conserver l’archive comme sauvegarde ou l’importer dans un nœud IPFS ou un service de stockage.

## Comment l’archive conserve vos fichiers

Un fichier unique devient la racine. Plusieurs fichiers sont regroupés dans un même répertoire racine. Lorsqu’un dossier est sélectionné, les chemins de ses fichiers sont conservés. Le sélecteur de dossiers du navigateur fournit les fichiers et leurs chemins. Si votre navigateur prend en charge le glisser-déposer de dossiers, déposez le dossier pour inclure aussi les sous-dossiers vides.

## À quoi correspond le CID racine

Le CID racine identifie le fichier ou le répertoire mis en archive. Le générateur utilise les mêmes paramètres CIDv1 par défaut que le Calculateur de CID IPFS. Une même structure de fichiers et de dossiers produit donc le même identifiant de contenu. Pour ajouter l’archive à Kubo, exécutez `ipfs dag import archive.car` avec le nom du fichier téléchargé. [Référence des commandes Kubo](https://docs.ipfs.tech/reference/kubo/cli/#ipfs-dag-import)
