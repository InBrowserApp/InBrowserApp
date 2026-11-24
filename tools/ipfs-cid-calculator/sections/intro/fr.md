## Calculer le CID d’un fichier ou d’un dossier

Choisissez un fichier ou un dossier local, puis sélectionnez **Calculer le CID**. Copiez l’identifiant de contenu (CID) pour le conserver dans un manifeste ou le comparer à celui d’une importation IPFS précédente. Le calcul se fait dans votre navigateur et vos fichiers restent sur votre appareil.

## Pourquoi un même fichier peut-il avoir plusieurs CID IPFS ?

IPFS peut scinder un fichier en blocs et enregistrer leurs liens avec UnixFS. Le CID racine dépend du découpage, de l’encodage et de l’agencement de ces blocs. Pour reproduire un CID, utilisez la même taille de segment, le même réglage des blocs feuilles et la même structure de dossiers que lors de l’importation d’origine. Le CID d’un dossier tient aussi compte des noms de ses entrées. Le sélecteur de dossiers du navigateur omet les sous-dossiers vides.

## Reproduire le CID avec Kubo

Ouvrez les **Paramètres d’importation** pour modifier la version du CID, la taille des segments, le format des blocs feuilles ou l’encapsulation dans un dossier. La version par défaut est CIDv1. Utilisez CIDv0 pour reproduire une ancienne importation qui utilisait cette version. **Encapsuler dans un dossier** ajoute un répertoire parent qui permet d’accéder au fichier par son nom à partir du CID racine.

Copiez la commande `ipfs add --only-hash` affichée pour refaire le calcul dans Kubo sur le même fichier ou dossier. Si vous avez déjà un CID issu d’une importation précédente, collez-le dans le champ de comparaison. Un CIDv0 et un CIDv1 équivalents correspondent, car ils identifient le même bloc. [Documentation IPFS sur les identifiants de contenu](https://docs.ipfs.tech/concepts/content-addressing/)
