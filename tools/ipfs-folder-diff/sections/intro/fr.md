## Comparer les CID de deux dossiers IPFS

Collez l’adresse du dossier d’origine dans **Ancien dossier** et celle du dossier mis à jour dans **Nouveau dossier**, puis sélectionnez **Comparer les dossiers**. Chaque champ accepte un CID, une adresse `ipfs://` ou un lien HTTP de passerelle. Ajoutez un chemin pour comparer deux sous-dossiers. Ouvrez un résultat pour voir ses CID, utilisez **Filtrer par chemin** pour affiner la liste ou sélectionnez **Télécharger le JSON** pour enregistrer la comparaison.

## Quand un chemin est-il considéré comme ajouté, supprimé ou modifié ?

Un chemin qui existe dans un seul dossier est marqué comme ajouté ou supprimé. Un sous-dossier ajouté ou supprimé dans son intégralité apparaît comme un seul chemin. Si un sous-dossier est présent dans les deux versions avec des CID différents, l’outil compare les chemins qu’il contient. La liste des chemins modifiés comprend les fichiers ou les liens symboliques dont le CID diffère, ainsi que les chemins dont le type d’entrée a changé. Des fichiers importés avec des paramètres de découpage ou d’encodage différents peuvent avoir des CID différents même si leur contenu visible est identique.

## Comparer des versions IPFS sans télécharger tous les fichiers

Le navigateur lit des blocs IPFS vérifiés via des passerelles publiques et ignore les branches dont les CID correspondent déjà. Vous pouvez ainsi comparer les versions d’un site web, d’un jeu de données publié ou d’une sauvegarde à l’aide des adresses immuables de leurs dossiers. Vous pouvez comparer les liens modifiés sans télécharger les fichiers entiers. Si une entrée est indisponible, le résultat indique les chemins que l’outil n’a pas pu comparer.

Pour en savoir plus, consultez la documentation sur [l’adressage par contenu et les versions des jeux de données](https://docs.ipfs.tech/how-to/content-addressing-data-sets/).
