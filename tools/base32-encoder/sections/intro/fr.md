## Qu’est-ce que Base32 ?

Base32 est utile lorsqu’un canal textuel ou insensible à la casse doit transporter des données binaires, par exemple des secrets OTP, des jetons compatibles DNS ou des valeurs de configuration exportées. C’est une couche d’encodage, pas une couche de sécurité.

## Quand l’utiliser

- Encoder des octets, du texte ou des fichiers avant de les envoyer via des canaux texte uniquement.
- Préparer des secrets OTP, des paramètres exportés ou des blobs binaires pour des systèmes qui attendent une entrée Base32.
- Convertir des octets de fichier bruts en une chaîne facile à copier pour le transport, les logs ou la saisie manuelle.

## Ce qu’il faut garder à l’esprit

- Base32 augmente davantage la taille que Base64.
- Il ne chiffre ni ne masque la valeur d’origine.
- Certains systèmes exigent le padding `=`, d'autres acceptent une sortie sans padding, donc alignez-vous sur le système destinataire.
