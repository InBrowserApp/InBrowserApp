# Qu’est-ce que le chiffrement AES ?

AES est un algorithme de chiffrement symétrique, ce qui signifie que le même secret est utilisé pour chiffrer et déchiffrer les données. Cet outil s’exécute entièrement dans votre navigateur et utilise la Web Crypto API ; le texte en clair, les mots de passe et les fichiers sélectionnés ne sont donc pas téléversés.

Le mode par défaut est AES-GCM, car il chiffre et authentifie la sortie. L’authentification est importante : si le texte chiffré, le sel ou l’IV change plus tard, le déchiffrement devrait échouer au lieu de renvoyer des données modifiées. AES-CBC et AES-CTR sont disponibles pour la compatibilité, mais ils n’authentifient pas le texte chiffré par eux-mêmes.

## Quand utiliser cet outil

Utilisez-le lorsque vous devez protéger une note, un jeton, un extrait de configuration ou un petit fichier avant de le stocker ou de le partager par un autre canal. La sortie est une enveloppe JSON contenant le mode, les paramètres de dérivation de clé, le sel, l’IV et le texte chiffré, afin que ces paramètres restent ensemble pour l’étape de déchiffrement correspondante.

Pour le chiffrement basé sur un mot de passe, le mot de passe est traité avec PBKDF2 et un sel aléatoire. Augmentez le nombre d’itérations lorsque vous pouvez tolérer un chiffrement et un déchiffrement plus lents. Pour le chiffrement par clé brute, collez une clé hexadécimale ayant exactement la longueur sélectionnée : 32 caractères hexadécimaux pour 128 bits, 48 pour 192 bits ou 64 pour 256 bits.

## Notes pratiques

Conservez le mot de passe ou la clé brute séparément du JSON chiffré. Toute personne disposant à la fois du JSON et du matériau de clé peut déchiffrer les données. Si vous chiffrez un fichier, téléchargez le résultat JSON et conservez séparément le nom du fichier d’origine si ce contexte est important.

Ne réutilisez pas un IV manuel avec la même clé. Cet outil génère un IV et un sel frais à chaque exécution, ce qui est le comportement par défaut le plus sûr. Préférez AES-GCM sauf si un autre système exige spécifiquement AES-CBC ou AES-CTR.
