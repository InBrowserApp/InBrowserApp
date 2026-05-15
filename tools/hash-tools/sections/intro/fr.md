La collection d'outils de hachage regroupe les utilitaires de hachage migrés afin que vous puissiez choisir le bon algorithme avant d'ouvrir un outil précis. Elle couvre les empreintes de fichiers du quotidien, les contrôles de compatibilité avec d'anciens systèmes, l'authentification de messages à clé, les chaînes Subresource Integrity, le hachage de mots de passe, la vérification de mots de passe et les sommes de contrôle rapides non cryptographiques.

## Quand utiliser ces outils

Utilisez les outils d'empreinte cryptographique lorsque vous avez besoin d'une empreinte reproductible pour du texte ou un fichier, par exemple pour comparer une archive téléchargée avec une somme de contrôle SHA-256 publiée. Utilisez HMAC lorsque le résultat doit prouver qu'une personne disposant d'un secret partagé a créé ou approuvé le message. Utilisez Argon2, bcrypt, PBKDF2 ou scrypt pour les flux de hachage de mots de passe et de dérivation de clés, où un coût configurable compte plus que la vitesse brute.

## Choisir en toute sécurité

Tous les hachages ne conviennent pas à la sécurité. MD4, MD5 et SHA-1 restent utiles pour les systèmes anciens et les contrôles de compatibilité, mais ils ne doivent pas être utilisés dans de nouvelles conceptions d'intégrité sensibles à la sécurité. CRC, Adler-32, MurmurHash, CityHash et xxHash sont des sommes de contrôle rapides ou des hachages de répartition, pas des signatures résistantes à la falsification. En cas de doute, privilégiez SHA-256 pour les sommes de contrôle publiques, HMAC-SHA-256 pour la vérification avec clé, et Argon2id ou bcrypt pour le stockage des mots de passe.

## Confidentialité et flux de travail

Les outils individuels de cette collection s'exécutent dans le navigateur. Le texte et les fichiers sont traités localement par l'outil sélectionné, sauf si cet outil documente explicitement un comportement de recherche publique, dont les outils de hachage n'ont pas besoin. Pour les données sensibles, effacez les valeurs générées après utilisation et évitez de coller des secrets dans des sessions de navigateur partagées ou enregistrées.
