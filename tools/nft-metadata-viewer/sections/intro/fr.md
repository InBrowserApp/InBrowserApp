## Consulter les métadonnées NFT à partir de l’adresse du contrat et de l’ID du jeton

Collez dans **Adresse du contrat** une adresse du réseau principal Ethereum et saisissez l’**ID du jeton**, puis sélectionnez **Afficher les métadonnées**. L’ID du jeton peut être un nombre décimal comme `1` ou un nombre hexadécimal comme `0x1`. Sélectionnez **Essayer un exemple** pour voir une recherche complète. La visionneuse effectue une requête RPC Ethereum en lecture seule depuis votre navigateur. Vous pouvez ainsi consulter un jeton public sans connecter de portefeuille.

## Trouver l’URI du jeton, l’image, les traits et le JSON

La visionneuse lit `tokenURI` pour ERC-721 ou `uri` pour ERC-1155. L’**URI du jeton** est la chaîne renvoyée par le contrat. La visionneuse lit les métadonnées vers lesquelles il pointe et affiche l’image, le nom et les traits si ces champs sont disponibles. Utilisez **JSON brut** pour examiner ou copier la réponse sans modification. Les URI IPFS, HTTP et Arweave sont pris en charge, de même que les URI de données avec du JSON intégré.

## Comment fonctionne le remplacement de l’ID du jeton ERC-1155 ?

Un contrat ERC-1155 peut renvoyer un modèle commun à plusieurs jetons. La visionneuse remplace `{id}` par l’ID du jeton sous forme de 64 chiffres hexadécimaux en minuscules, complétés par des zéros à gauche et sans préfixe `0x`. Si le modèle est modifié par ce remplacement, **URI résolu** affiche l’adresse consultée pour le jeton. Le même remplacement est appliqué aux champs d’aperçu, comme le lien de l’image.

## Que faire si l’URI du jeton s’affiche sans image ?

Un contrat peut renvoyer un URI même lorsque son hébergeur web ou sa passerelle IPFS est temporairement indisponible. Si la visionneuse ne peut pas charger les métadonnées, vous pouvez toujours copier l’URI. Si le JSON est disponible, examinez son champ `image` et essayez d’ouvrir la source directement. Les hôtes HTTP peuvent aussi restreindre les requêtes entre origines, ce qui limite ce que le navigateur peut lire.

Pour connaître les champs couramment utilisés dans les applications NFT, consultez la [norme ERC-721](https://eips.ethereum.org/EIPS/eip-721), la [spécification des métadonnées ERC-1155](https://eips.ethereum.org/EIPS/eip-1155#metadata) et le [guide des métadonnées d’OpenSea](https://docs.opensea.io/docs/metadata-standards).
