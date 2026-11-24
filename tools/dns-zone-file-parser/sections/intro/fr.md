## Comment lire un fichier de zone DNS

Ouvrez un export DNS au format BIND ou collez son contenu. Chargez l’exemple pour voir un enregistrement SOA, des enregistrements d’adresse IPv4 et IPv6, des enregistrements de messagerie et une chaîne TXT. Pour chaque ligne, l’analyseur indique le nom, la classe, le type, la durée de vie en secondes et les données. Filtrez par nom, par type comme MX ou par une partie de la valeur. Vous pouvez ensuite copier les enregistrements affichés en JSON pour un inventaire ou une migration.

## Comment l’analyseur traite l’origine, le TTL et les données

Avec un $ORIGIN de example.com., le nom relatif « www » devient www.example.com. Le nom @ désigne l’origine actuelle. Un enregistrement sur une ligne indentée reprend le nom précédent. Si le fichier ne contient pas de $ORIGIN, saisissez le domaine dans Origine initiale. Un $TTL par défaut de 1h devient 3 600 secondes. Un enregistrement qui définit son propre TTL conserve cette valeur. Les données gardent leurs guillemets, leurs caractères d’échappement et les cibles relatives telles qu’elles sont écrites. Ainsi, « hello; world » reste une seule valeur TXT et « mail » dans les données MX reste « mail ».

## Comment interpréter les résultats

L’analyseur lit les commentaires, le texte entre guillemets et les enregistrements sur plusieurs lignes. Il indique le numéro de ligne de chaque problème tout en affichant les enregistrements qu’il a pu lire. Si la zone utilise $INCLUDE ou $GENERATE, développez ces directives avant de coller les enregistrements complets. L’analyse se fait dans votre navigateur, sans requête aux serveurs DNS ni vérification de la compatibilité de la zone avec un fournisseur particulier.
