## Qu'est-ce qu'un Max UUID ?

Un Max UUID est l'UUID standardisé dont les 128 bits sont tous définis sur un. Sa forme textuelle canonique est `ffffffff-ffff-ffff-ffff-ffffffffffff`, et il est souvent utilisé pour représenter la valeur UUID la plus élevée possible.

## Quand l'utiliser

Utilisez un Max UUID lorsqu'une API, une requête de base de données, une fixture ou une vérification de plage nécessite une borne supérieure ou une valeur sentinelle en forme d'UUID. Il est utile dans les tests, les scripts de migration, les curseurs de pagination et les protocoles qui définissent une valeur UUID maximale explicite.

## Points d'attention

Ne traitez pas le Max UUID comme un identifiant unique généré. C'est la même valeur à chaque fois ; le stocker à un endroit où un véritable ID d'objet est attendu peut masquer une logique de sentinelle, casser les hypothèses d'unicité ou faire trier des enregistrements en fin de liste de façon inattendue.
