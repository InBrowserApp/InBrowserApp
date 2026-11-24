## Afficher et modifier un fichier binaire en ligne

Ouvrez un fichier local ou déposez-le dans l’éditeur hexadécimal. Vous pouvez aussi choisir **Essayer un exemple** pour explorer la disposition des octets. L’éditeur permet d’inspecter l’en-tête d’un fichier, de vérifier une signature comme `89 50 4E 47` pour un PNG, d’examiner des octets non imprimables ou de remplacer une valeur à un emplacement précis.

## Lire les décalages, les octets hexadécimaux et l’ASCII

Le décalage à gauche indique la position du premier octet de la ligne, en comptant à partir de zéro. Au centre, chaque octet est représenté par deux chiffres hexadécimaux, de `00` à `FF`. La colonne ASCII affiche les caractères imprimables correspondants et utilise un point pour les autres valeurs. Par exemple, les octets `48 65 6C 6C 6F` s’affichent sous la forme `Hello`.

Saisissez un décalage hexadécimal comme `1A` ou `0x1A` pour accéder directement à l’octet situé à la position 26. Utilisez les commandes de pagination pour parcourir les octets voisins. L’éditeur lit une page à la fois, ce qui permet d’examiner une petite partie d’un fichier volumineux.

## Remplacer des octets et enregistrer une copie

Sélectionnez un octet dans la colonne hexadécimale et saisissez deux chiffres. L’éditeur actualise le caractère ASCII correspondant et passe à l’octet suivant. Utilisez les flèches pour vous déplacer entre les octets et les commandes **Annuler** ou **Rétablir** pour revenir sur vos modifications. Le remplacement conserve la taille du fichier et la position des autres octets.

Choisissez **Télécharger une copie** pour enregistrer le résultat. Le fichier d’origine reste intact et toutes les opérations de lecture et de modification se déroulent dans votre navigateur.
