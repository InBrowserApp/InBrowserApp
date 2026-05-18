## Ce que convertit cet outil

Ce convertisseur traite un UUID comme la valeur 128 bits qu’il est réellement et
garde les représentations courantes synchronisées. Collez un UUID, une valeur
Base64, une chaîne hexadécimale, un entier décimal, une valeur octale ou une
valeur binaire, et les autres formats se mettent à jour localement dans votre
navigateur.

## Comment lire les formats

Le champ UUID affiche la forme canonique avec tirets. L’hexadécimal correspond
aux mêmes 16 octets sous forme de 32 chiffres hexadécimaux minuscules. Base64
est le Base64 standard avec remplissage des 16 octets bruts, pas le Base64 des
caractères textuels de l’UUID. Le décimal, l’octal et le binaire affichent
l’UUID comme un entier non signé 128 bits ; la sortie binaire est complétée à
gauche jusqu’à 128 bits afin que les zéros initiaux restent visibles.

## Points à surveiller

Les valeurs hors de la plage UUID 128 bits sont rejetées. L’entrée Base64 doit
se décoder en exactement 16 octets. Le convertisseur accepte les variantes
courantes collées, comme les UUID en majuscules, les préfixes `urn:uuid:`, les
accolades, les UUID compacts de 32 caractères hexadécimaux, les espaces autour
des longues valeurs numériques et le Base64 compatible URL. Rien n’est téléversé
pendant la conversion ou la génération de l’UUID d’exemple.
