## Générer une série d’exemples de numéros de téléphone

Choisissez un pays ou une région et un format de numéro, saisissez la quantité, puis sélectionnez **Générer**. Copiez les résultats dans un formulaire ou téléchargez un fichier texte `UTF-8` contenant un numéro par ligne. Utilisez ces numéros pour vérifier les masques de saisie, créer des exemples de contacts ou tester la façon dont votre application stocke et affiche les numéros de téléphone.

## Choisir le format national ou international

Le format **National** utilise un format issu de la locale Faker.js du pays sélectionné. Par exemple, un numéro américain peut s’écrire `(202) 555-0100` et un numéro britannique `07700 900123`. Le format **International (E.164)** comprend un signe plus, l’indicatif téléphonique du pays et les chiffres restants sans espaces, par exemple `+12025550100` ou `+447700900123`.

## Conserver le signe plus et les zéros initiaux

Stockez les numéros de téléphone sous forme de texte dans les feuilles de calcul et les bases de données. Une feuille de calcul qui importe `07700 900123` ou `+447700900123` comme nombre peut supprimer le zéro initial ou le signe plus. Ces exemples servent à tester les formats. Pour vérifier les appels ou les SMS, utilisez un numéro de test que vous contrôlez.
