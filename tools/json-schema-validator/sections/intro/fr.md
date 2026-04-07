## Qu'est-ce que la validation JSON Schema ?

Utilisez cet outil lorsque vous souhaitez un retour rapide pendant la conception de charges utiles, le débogage d'exemples d'API ou la vérification qu'un changement de schéma ne casse pas les données d'exemple. Tout s'exécute localement dans le navigateur, le JSON brut ne quitte donc jamais la page.

## Où il s'intègre bien

- Examiner les exemples de charges utiles dans la documentation API.
- Valider des données fictives pendant le travail frontend.
- Vérifier les champs sensibles au format tels que `uuid`, `email` ou `date-time`.

## Ce qu'il ne remplace pas

- L'autorisation côté serveur et les règles métier.
- Les vérifications de contrat qui dépendent de références distantes ou de l'état de l'application.
- La validation CI complète sur l'ensemble de votre jeu de schémas.
