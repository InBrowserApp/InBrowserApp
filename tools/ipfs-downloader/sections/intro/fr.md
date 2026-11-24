## Télécharger un fichier IPFS à partir d’un CID ou d’un lien

Collez un CID, un URI `ipfs://` ou l’URL d’une passerelle IPFS, puis sélectionnez **Ouvrir le contenu**. Si l’adresse pointe vers un fichier, choisissez **Télécharger le fichier** pour l’enregistrer. Un lien dont le CID est suivi d’un chemin peut ouvrir un fichier ou un sous-dossier précis.

## Télécharger un dossier IPFS complet en ZIP

Ouvrez un dossier pour parcourir son contenu, puis choisissez **Télécharger le ZIP** pour enregistrer le dossier avec ses sous-dossiers. Le ZIP conserve leurs chemins. Si certains chemins ne peuvent pas être récupérés, l’outil les affiche. Vous pouvez réessayer de télécharger le ZIP ou choisir **Télécharger les fichiers disponibles** pour enregistrer la partie récupérée.

## Comment le navigateur récupère le contenu IPFS

Le navigateur demande les blocs nécessaires à des passerelles IPFS publiques et les vérifie à l’aide de leurs CID avant de les utiliser. Un CID identifie un contenu. La récupération dépend aussi de la capacité des passerelles à joindre les pairs qui fournissent ces blocs. Si le dossier est trop volumineux pour que votre appareil puisse le compresser, ouvrez un sous-dossier ou téléchargez les fichiers séparément. [Documentation IPFS sur la récupération de contenu](https://docs.ipfs.tech/quickstart/retrieve/)
