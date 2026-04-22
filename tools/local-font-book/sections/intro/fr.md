## Qu'est-ce que Local Font Access ?

Local Font Access est une API du navigateur qui liste les polices installées sur votre appareil.

Cet outil vous permet de rechercher dans les résultats, de comparer des variantes proches et de copier un extrait CSS pour la police choisie.

Elle fonctionne uniquement en contexte sécurisé et sur des navigateurs compatibles, avec l'autorisation de l'utilisateur (local-fonts).

L'API renvoie des FontData avec family, fullName, postscriptName et style.

### Points clés

- Utilisez-le pour confirmer les noms exacts à employer dans une pile CSS `font-family` sur l'appareil actuel.
- Les appels doivent être déclenchés par un geste utilisateur.
- Une Permissions Policy peut bloquer l'accès sur certains sites.
- Cet outil reste local et ne téléverse pas de polices.
