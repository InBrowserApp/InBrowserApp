## Qu'est-ce que le Base64 ?

Le Base64 est utile lorsqu'un canal textuel doit transporter des données binaires, comme des corps d'e-mails, des blocs JSON ou de petites data URL. C'est une couche d'encodage, pas une couche de sécurité.

## Quand l'utiliser

- Débogage rapide lorsqu'une API renvoie ou attend des chaînes Base64.
- Conversion du texte du navigateur dans un format de transport sûr pour les journaux ou les charges utiles.
- Vérification qu'un bloc Base64 collé se décode en le contenu attendu.

## À garder à l'esprit

- Le Base64 augmente la taille d'environ un tiers.
- Il ne chiffre ni ne masque la valeur d'origine.
- Un remplissage invalide ou un copier-coller cassé se manifeste généralement par une erreur de décodage.
