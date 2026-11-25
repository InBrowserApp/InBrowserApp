## Générer des codes postaux pour les tests

Choisissez un pays ou une région, indiquez la quantité, puis sélectionnez **Générer**. Vous pouvez copier le lot ou télécharger un fichier texte UTF-8 contenant un code postal par ligne. Utilisez les résultats pour remplir des formulaires de test, créer des données d’exemple ou vérifier l’affichage des codes postaux locaux dans les formulaires de paiement et d’inscription.

## Comparer les formats de codes postaux

Les codes postaux peuvent contenir des lettres, des espaces, des traits d’union ou des zéros initiaux. Un code ZIP américain peut être `02108` ; le format ZIP+4 ajoute un trait d’union et quatre chiffres, comme dans `02108-1234`. Un code postal britannique peut être `SW1 2AB`, un code canadien `K1A 0B1`, un code japonais `100-0001` et un CEP brésilien `01001-000`. Le pays ou la région choisi détermine le format généré, indépendamment de la langue de la page.

Lorsque vous importez les résultats dans une feuille de calcul ou une base de données, stockez les codes postaux sous forme de texte. L’importation de `02108` comme nombre supprime le zéro initial et modifie la valeur.

## Puis-je utiliser les résultats pour envoyer du courrier ?

Faker.js crée des exemples de codes dans le format sélectionné. Un code peut être attribué ou non à une zone de distribution réelle. Pour envoyer du courrier, vérifiez le code de l’adresse réelle auprès du service postal concerné.
