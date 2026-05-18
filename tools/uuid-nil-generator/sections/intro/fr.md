## Qu'est-ce qu'un UUID nil ?

Un UUID nil est l'UUID standardise dont les 128 bits sont tous a zero. Sa forme textuelle canonique est `00000000-0000-0000-0000-000000000000`, et il sert souvent a indiquer qu'aucun UUID n'a encore ete attribue.

## Quand l'utiliser

Utilisez un UUID nil lorsqu'une API, une colonne de base de donnees, un jeu de donnees de test ou un fichier de configuration exige une valeur au format UUID, mais que l'identifiant reel est volontairement absent. Il est utile comme espace reserve dans les tests, les modeles d'import, les scripts de migration et les protocoles qui definissent une valeur d'UUID vide explicite.

## Points de vigilance

Ne traitez pas l'UUID nil comme un identifiant unique genere. C'est toujours la meme valeur ; l'enregistrer a l'endroit ou un ID d'objet reel est attendu peut masquer des donnees manquantes, rompre les hypotheses d'unicite ou donner l'impression que des enregistrements sont lies alors qu'ils ne le sont pas.
