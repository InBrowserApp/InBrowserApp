Créez des phrases seed BIP39 dans le navigateur, inspectez des mnémoniques importées avant de leur faire confiance et convertissez entre entropie brute et mots de portefeuille sans envoyer de données sensibles à un autre service. Cet outil est utile lorsque vous avez besoin d’un espace unique pour la génération, la validation de checksum et les opérations de récupération de bas niveau.

## Générer en connaissance de cause

Choisissez une liste de mots prise en charge et un nombre de mots, puis régénérez jusqu’à obtenir la phrase seed que vous voulez conserver. L’entropie correspondante est affichée à côté afin que vous puissiez contrôler la force exacte et garder les deux représentations ensemble lors de la documentation d’un scénario de récupération.

## Valider avant d’importer

Utilisez le mode de validation lorsqu’une personne vous remet une phrase mnémonique et que vous voulez vérifier rapidement la somme de contrôle et le nombre de mots avant de l’importer dans un autre portefeuille. Un résultat valide révèle aussi l’entropie récupérée, ce qui aide à comparer plusieurs sources de récupération ou à déboguer des étapes de dérivation.

## Convertir l’entropie avec prudence

Le mode de conversion fonctionne dans les deux sens : de l’entropie brute vers les mots et des mots mnémoniques vers l’entropie. C’est pratique pour les jeux de test, les démonstrations de portefeuilles déterministes et les revues d’incident où vous devez confirmer qu’une phrase correspond toujours aux octets attendus pour une liste BIP39 donnée.
