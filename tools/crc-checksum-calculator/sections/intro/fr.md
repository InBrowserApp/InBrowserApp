# Calculateur de sommes de contrôle CRC

Les sommes de contrôle CRC (Cyclic Redundancy Check, contrôle de redondance
cyclique) sont des valeurs compactes utilisées pour détecter les modifications
accidentelles des données. Elles sont courantes dans les trames réseau, les
formats d’archive, les protocoles embarqués, les mises à jour de firmware et les
flux de travail d’intégrité des fichiers lorsqu’une valeur de détection d’erreur
rapide est plus utile qu’une signature cryptographique.

## Quand l’utiliser

Utilisez ce calculateur lorsque vous devez comparer des valeurs CRC provenant de
documentation, de protocoles matériels, de formats de fichiers ou d’un autre
système. Collez du texte pour des vérifications rapides, ou importez un fichier
lorsque la somme de contrôle doit être calculée à partir du flux d’octets exact.

## Variantes prises en charge

L’outil calcule les variantes courantes de l’ancien outil CRC d’InBrowser.App :
CRC-1, CRC-8, CRC-8 1-Wire, CRC-8 DVB-S2, CRC-16, CRC-16 CCITT,
CRC-16 Modbus, CRC-16 Kermit, CRC-16 XModem, CRC-24, CRC-32, CRC-32 MPEG-2,
CRCJAM, ainsi que plusieurs modèles CRC-64, notamment ECMA-182, GO-ISO, MS,
NVME, REDIS, WE et XZ.

## Points à surveiller

Les noms des variantes CRC comptent. La même entrée peut produire des valeurs
différentes selon le polynôme, la valeur initiale, les paramètres de réflexion
et le XOR final. Si vous cherchez à correspondre à un protocole ou à une
spécification fournisseur, choisissez le résultat dont le nom de variante
correspond à cette spécification au lieu de considérer chaque largeur CRC comme
interchangeable.

Le CRC est conçu pour détecter les erreurs accidentelles, pas pour le stockage
des mots de passe, les signatures ni la sécurité contre les altérations. Pour
une vérification sensible sur le plan de la sécurité, utilisez plutôt un flux de
travail fondé sur un hachage cryptographique ou une signature.
