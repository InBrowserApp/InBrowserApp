## Comment fonctionne la détection du type de fichier

Cet outil lit au maximum les 64 premiers KiB d’un fichier local et vérifie sa
signature binaire avec [file-type](https://github.com/sindresorhus/file-type).
Le résultat comprend un type MIME détecté, les extensions attendues et un aperçu
des 256 premiers octets en hexadécimal et en ASCII. Rien n’est envoyé.

## Pourquoi une extension peut être incohérente

Renommer un fichier change son nom, pas son contenu. Un PNG nommé photo.jpg
conserve sa signature PNG. Les variantes courantes, comme .jpg et .jpeg, sont
acceptées. Le type MIME déclaré par le navigateur est affiché séparément, car
il dépend souvent du nom de fichier plutôt que de l’examen des octets.

## Limites de la détection

Les signatures sont des indices, pas des preuves qu’un fichier est valide ou
sûr. Les formats texte tels que TXT, CSV et SVG peuvent ne pas être reconnus.
Un échantillon court peut permettre d’identifier ZIP ou un autre conteneur sans
confirmer son sous-type, par exemple un document Office. L’aperçu hexadécimal
montre le contenu brut du fichier, pas une somme de contrôle cryptographique.
