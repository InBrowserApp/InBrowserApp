## Ce que fait cet outil

Le séparateur de PDF vous permet d’ouvrir un PDF dans votre navigateur, de
choisir des pages par plage ou par numéro de page, puis de générer un document
plus léger. Vous pouvez extraire les pages sélectionnées dans un seul PDF,
découper chaque plage saisie dans un PDF séparé ou placer chaque page
sélectionnée dans son propre fichier et télécharger les résultats sous forme
d’archive ZIP.

## Bons cas d’utilisation

- Extraire quelques pages d’un long contrat, rapport, manuel ou scan avant de
  les partager avec quelqu’un d’autre.
- Séparer des chapitres, factures, formulaires ou sections de pièces jointes en
  fichiers PDF individuels.
- Retirer les pages dont vous n’avez pas besoin avant d’envoyer un document à
  un imprimeur, un service d’assistance ou un circuit d’approbation.
- Créer des découpes répétables avec une syntaxe de plage comme `1-3,5,8-10`
  au lieu de cliquer manuellement sur chaque page.

## Fonctionnement des plages de pages

Utilisez des numéros de page séparés par des virgules et des plages inclusives.
`1-3,5,8-10` sélectionne les pages 1, 2, 3, 5, 8, 9 et 10. Une page ne peut
apparaître qu’une seule fois dans l’expression, et les plages décroissantes
comme `7-4` sont refusées afin que l’ordre de sortie reste clair et prévisible.

Pour un PDF de sortie unique, les pages sélectionnées sont copiées dans un
nouveau document, dans l’ordre indiqué par l’expression de plage. Pour plusieurs
PDF de sortie, « un fichier par plage » garde chaque segment saisi ensemble,
tandis que « un fichier par page » crée un PDF distinct pour chaque page
sélectionnée.

## Notes de confidentialité

Le PDF est traité localement dans votre navigateur et n’est pas téléversé par
cet outil. Les liens de téléchargement générés sont des URL d’objet temporaires
qui n’existent que dans l’onglet actuel. Vérifiez les fichiers obtenus avant de
les partager, car les pages copiées peuvent encore contenir des métadonnées
intégrées, des annotations, des valeurs de formulaire ou du contenu masqué du
document d’origine.

## Limites

Les PDF chiffrés, protégés par mot de passe ou endommagés peuvent ne pas
s’ouvrir dans la bibliothèque PDF côté navigateur. Ce séparateur copie des pages
dans de nouveaux PDF, mais ce n’est pas un outil de caviardage visuel et il ne
garantit pas la suppression de toutes les métadonnées du document. Pour le
caviardage juridique, la réparation de l’accessibilité ou l’optimisation
avancée, utilisez un éditeur PDF dédié après le découpage.
