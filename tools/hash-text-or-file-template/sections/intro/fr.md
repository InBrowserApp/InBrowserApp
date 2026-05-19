## Qu'est-ce qu'un hachage de texte ou de fichier ?

Une fonction de hachage transforme du texte ou les octets d'un fichier en une empreinte de longueur fixe. La même entrée et le même algorithme produisent toujours la même empreinte, ce qui rend les hachages utiles lorsque vous avez besoin d'une empreinte reproductible sans téléverser de données privées.

## Quand utiliser cet outil

Utilisez cet outil pour vérifier les sommes de contrôle de téléchargements, comparer si deux fichiers sont identiques, enregistrer rapidement l'empreinte d'un extrait de texte ou déboguer des systèmes qui publient des empreintes SHA. L'importation d'un fichier hache directement les octets du fichier, tandis que le mode texte hache le texte UTF-8 affiché dans l'éditeur.

## Choisir un algorithme

SHA-256 est un choix par défaut solide pour les nouvelles vérifications d'intégrité. SHA-384 et SHA-512 fournissent des empreintes SHA-2 plus longues lorsqu'un autre système attend ces formats. SHA-1 est inclus pour les comparaisons avec des systèmes anciens, mais il ne doit pas être utilisé pour de nouvelles conceptions sensibles à la sécurité.

## Confidentialité et limites

Le hachage s'exécute localement dans votre navigateur avec Web Crypto, et les fichiers ne sont pas téléversés. Un hachage n'est pas du chiffrement : il ne peut pas protéger un secret à lui seul, et le stockage des mots de passe exige une fonction de hachage de mots de passe dédiée, avec un sel et un facteur de travail.
