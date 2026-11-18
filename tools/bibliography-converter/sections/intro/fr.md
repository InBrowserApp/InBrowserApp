## Quand utiliser BibTeX, RIS ou CSL JSON ?

Choisissez un format que votre application de destination peut importer.

- **BibTeX (`.bib`)** est un format courant pour les projets LaTeX dans Overleaf ou dans un éditeur local.
- **RIS (`.ris`)** permet de transférer des références depuis une base de données ou un autre gestionnaire bibliographique vers Zotero ou EndNote.
- **CSL JSON (`.json`)** contient des données bibliographiques structurées pour les moteurs de citation et d’autres outils compatibles avec les données de Citation Style Language.

## Comment convertir et vérifier mes références ?

Collez vos références ou sélectionnez **Ouvrir un fichier**. Laissez **Format d’entrée** sur **Détection automatique** ou choisissez vous-même le format si la détection échoue. Choisissez le **Format de sortie**, sélectionnez **Convertir et vérifier**, puis copiez le résultat ou téléchargez le fichier. La conversion s’effectue dans votre navigateur.

Par exemple, ouvrez un fichier RIS exporté depuis Zotero, choisissez BibTeX et téléchargez un fichier `.bib` pour votre projet dans Overleaf. Si vous disposez uniquement d’une bibliographie mise en forme et copiée depuis Word, exportez d’abord les références depuis le gestionnaire bibliographique qui a servi à la créer. Pour importer le fichier converti dans Zotero, suivez le [guide d’importation de Zotero](https://www.zotero.org/support/kb/importing_standardized_formats).

## Qu’est-ce qu’un doublon possible ?

Le rapport regroupe les entrées qui ont le même DOI, y compris lorsque celui-ci se présente sous la forme d’un lien `doi.org`. En l’absence de DOI, il peut aussi rapprocher des entrées selon leur titre, leur année de publication, ainsi que le nom de famille et l’initiale du prénom du premier auteur. Les numéros des entrées correspondent à leur ordre dans les données d’entrée. Sélectionnez **Charger un exemple** pour voir comment le rapport affiche deux entrées qui décrivent le même article. Vérifiez chaque groupe avant de fusionner les références dans votre gestionnaire bibliographique. Le téléchargement contient toutes les entrées.

## Quels champs sont conservés ?

Les champs courants, comme le titre, les auteurs, l’année de publication et le DOI, sont généralement conservés lors d’un changement de format. Les champs personnalisés peuvent être omis. La génération d’un fichier BibTeX peut attribuer d’autres clés de citation pour éviter les conflits. Gardez le fichier d’origine si vous avez besoin de ces informations. Pour détecter les doublons tout en conservant les champs d’origine, choisissez le même format d’entrée et de sortie.
