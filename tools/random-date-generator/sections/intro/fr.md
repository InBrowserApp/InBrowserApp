## Générer des dates aléatoires dans une plage

Saisissez une **Date de début** et une **Date de fin**, choisissez un format de sortie, puis sélectionnez **Générer**. Les deux bornes sont incluses : une plage allant de `2024-02-28` à `2024-03-01` peut donc aussi produire le jour bissextile `2024-02-29`. Une même date peut apparaître plusieurs fois dans un lot. Copiez les résultats ou téléchargez un fichier texte `UTF-8` contenant une date par ligne.

## Choisir une date ISO ou localisée

Utilisez **ISO (YYYY-MM-DD)** pour des jeux de données de test, des importations dans un tableur ou des dates à trier chronologiquement sous forme de texte. Utilisez **Date localisée** pour afficher la date du calendrier grégorien dans la langue de la page. Par exemple, `2024-02-29` apparaît sous la forme `Feb 29, 2024` sur la page en anglais et `29.02.2024` sur la page en allemand.

## Conserver le même jour civil entre les fuseaux horaires

La plage utilise les limites des jours en UTC. Une date choisie à l’une ou l’autre des bornes reste sur le même jour civil quel que soit le lieu d’affichage du générateur. En définissant la même date de début et de fin, vous générez cette seule date, ce qui est utile pour tester les jours bissextiles ou le premier ou dernier jour d’un mois.
