## Valider les métadonnées JSON de NFT avant le mint

Choisissez **Fichiers locaux** pour vérifier des fichiers JSON ou un dossier de collection sur votre appareil. Sélectionnez directement les fichiers numérotés comme `1` ou `42`. Le vérificateur signale, pour chaque élément, le JSON invalide et les problèmes de métadonnées fréquents, comme les noms vides, les images manquantes, les descriptions invalides et les attributs mal formés. Utilisez **À vérifier** pour repérer les entrées à corriger ou téléchargez le rapport complet au format JSON.

## Vérifier des URI de jetons par lots

Dans **URI de jetons**, collez une adresse de métadonnées par ligne. Pour une collection numérotée, utilisez **Modèle d’URI** avec un paramètre de remplacement comme `https://example.com/metadata/{id}.json`. Indiquez le premier et le dernier ID pour vérifier toute la plage, bornes incluses. Le format décimal utilise l’ID tel que vous l’avez saisi. **Hexadécimal ERC-1155** écrit chaque ID sur 64 caractères hexadécimaux en minuscules, avec des zéros en tête, conformément aux règles de substitution de `{id}` d’ERC-1155. Le vérificateur remplace aussi `{id}` dans les valeurs de métadonnées, comme les liens d’images.

## Vérifier les liens d’images et d’animations NFT

Activez **Vérifier la disponibilité des médias** pour contrôler les liens `image` et `animation_url`. Sélectionnez le dossier local entier pour inclure les médias référencés par des chemins relatifs. Un chemin qui commence par `/` est résolu à partir de la racine du dossier sélectionné. Le navigateur peut aussi vérifier des ressources HTTP, IPFS et Arweave. Une erreur de passerelle, un délai dépassé ou une restriction entre origines peut empêcher la confirmation d’un lien. Examinez ces liens dans la passerelle ou sur la place de marché que vous utilisez. La vérification des fichiers locaux s’effectue dans votre navigateur. Pour vérifier des URI, le navigateur contacte l’hôte ou la passerelle concernés.

Pour les définitions de champs et la substitution dans les URI de jetons, consultez le [guide des métadonnées d’OpenSea](https://docs.opensea.io/docs/metadata-standards) et la [spécification des métadonnées ERC-1155](https://eips.ethereum.org/EIPS/eip-1155#metadata).
