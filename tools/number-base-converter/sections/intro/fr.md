Convertissez des entiers entre binaire, octal, décimal, hexadécimal, Base32, Base36, Base62, Base64 et des bases personnalisées de 2 à 64 directement dans le navigateur. Tout est calculé localement avec BigInt, ce qui permet d’inspecter de grandes valeurs sans les envoyer à un serveur.

## Quand l’utiliser

Utilisez cet outil lorsque le même entier apparaît dans des journaux, protocoles, identifiants ou spécifications avec des alphabets différents. Modifier un champ recalcule immédiatement tous les autres, ce qui est pratique pour le débogage, la documentation et la vérification manuelle.

## Différences entre bases

Jusqu’à la base 36, les lettres sont acceptées sans distinction de casse. Les bases supérieures traitent majuscules et minuscules comme des chiffres différents, et la ligne Base64 utilise l’alphabet numérique `A-Z a-z 0-9 + /`, pas l’encodage Base64 orienté octets.

## Points à surveiller

Seuls les entiers non négatifs sont pris en charge. Les zéros initiaux sont considérés comme une mise en forme, donc la sortie convertie est normalisée et peut perdre le remplissage saisi.
