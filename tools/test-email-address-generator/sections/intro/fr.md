## Générer un lot d’adresses e-mail de test

Choisissez un domaine, indiquez la quantité, puis sélectionnez **Générer**. Choisissez **Tout domaine d’exemple** pour mélanger les domaines dans un même lot. Chaque adresse apparaît une seule fois par lot. Copiez les résultats dans un formulaire ou une feuille de calcul, ou téléchargez un fichier texte UTF-8 contenant une adresse par ligne pour vos données de test.

## Quels domaines de messagerie puis-je utiliser ?

Faker.js génère des adresses sur `example.com`, `example.net` et `example.org`. Ces [domaines d’exemple réservés](https://www.iana.org/help/example-domains) sont utilisés dans la documentation et les données d’exemple. Dans `alex.morgan42@example.com`, la partie avant `@` est la partie locale et `example.com` est le domaine. Utilisez un seul domaine si votre test attend une valeur fixe, ou mélangez les domaines pour tester le filtrage et les importations.

## Que puis-je tester avec ces adresses ?

Utilisez ces exemples pour tester les champs de formulaires d’inscription, le format des adresses e-mail, les listes de comptes ou la déduplication dans une base de données. Le générateur produit des adresses sous forme de texte sans créer de boîtes de réception. Pour tester la livraison ou un lien de vérification, utilisez une boîte de réception que vous contrôlez ou votre environnement de test de messagerie.
