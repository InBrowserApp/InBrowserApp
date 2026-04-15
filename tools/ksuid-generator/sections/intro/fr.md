Générez des KSUID localement dans votre navigateur sans envoyer le lot en cours à un autre service. Cet outil est utile lorsque vous avez besoin d'identifiants qui restent uniques dans des systèmes distribués tout en se triant approximativement par moment de création pour des journaux, des fils d'activité, des imports ou des enregistrements ordonnés.

## Pourquoi Utiliser KSUID

KSUID combine un horodatage sur 32 bits avec 128 bits d'aléa, puis encode le tout sous la forme d'une chaîne Base62 de 27 caractères. Chaque identifiant reste ainsi compact, compatible avec les URL et facile à stocker, tandis que l'horodatage intégré place généralement les valeurs les plus récentes après les plus anciennes.

## Choisir L'heure Actuelle Ou Une Heure Personnalisée

Utilisez l'heure actuelle lorsque vous voulez créer de nouveaux identifiants pour des données de production, des démos ou une génération par lot classique. Passez à un horodatage personnalisé pour des fixtures reproductibles, des enregistrements rétrochargés, des exemples de migration ou des tests censés provenir d'un moment précis.

## À Savoir Avant D'exporter

KSUID ne conserve qu'une précision à la seconde, donc toute valeur avec des millisecondes est arrondie à la baisse au début de cette seconde. Les identifiants créés dans la même seconde restent uniques, mais leur ordre final dépend aussi de la charge aléatoire. Il vaut donc mieux considérer KSUID comme triable par le temps plutôt que strictement séquentiel.
