## Qu’est-ce que Base32 ?

Base32 est utile lorsqu’un canal textuel ou insensible à la casse doit transporter des données binaires, par exemple des secrets OTP, des jetons compatibles DNS ou des valeurs de configuration exportées. C’est une couche d’encodage, pas une couche de sécurité.

## Quand l’utiliser

- Décoder des secrets ou des jetons Base32 pour retrouver leurs octets d’origine.
- Inspecter des valeurs copiées depuis une configuration TOTP, des exports d’intégration ou des fichiers de configuration.
- Vérifier qu’un contenu Base32 collé contient des caractères valides et un padding correct avant utilisation.

## Ce qu’il faut garder à l’esprit

- Base32 augmente davantage la taille que Base64.
- Il ne chiffre ni ne masque la valeur d’origine.
- Certains systèmes omettent le padding `=`, mais les caractères invalides provoquent toujours des erreurs de décodage.
