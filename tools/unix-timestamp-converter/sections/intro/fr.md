## Convertir un timestamp Unix en date

Collez un timestamp pour afficher la date et l’heure dans le fuseau horaire de votre appareil, les valeurs en UTC et au format ISO 8601, ainsi que le temps écoulé ou restant. Par exemple, `1704067200` secondes et `1704067200000` millisecondes donnent tous deux `2024-01-01T00:00:00.000Z` au format ISO 8601.

## Convertir une date en timestamp Unix

Modifiez **Date et Heure** pour convertir une date et une heure locales en timestamp Unix dans l’unité sélectionnée. Cliquez sur **Maintenant** pour obtenir le timestamp actuel. Pour les journaux et les API, utilisez la valeur ISO 8601 qui se termine par `Z` pour indiquer sans ambiguïté que l’heure est en UTC.

## Choisir les secondes, les millisecondes ou les nanosecondes

Un timestamp Unix mesure le temps écoulé depuis le 1er janvier 1970 à 00 h 00 UTC. En mode **Auto**, les valeurs jusqu’à 10 chiffres sont lues en secondes, celles de 11 à 13 chiffres en millisecondes et les valeurs plus longues en nanosecondes. Choisissez l’unité manuellement si vous connaissez le format d’origine, notamment pour les dates anciennes représentées en millisecondes ou si la date affichée semble incorrecte. La date s’affiche avec une précision d’une milliseconde.
