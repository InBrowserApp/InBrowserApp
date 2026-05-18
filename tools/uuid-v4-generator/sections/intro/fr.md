Générez un UUID v4 localement dans votre navigateur lorsque vous avez besoin d'un nouvel identifiant pour des enregistrements de test, des lignes de base de données, des exemples d'API, des charges utiles d'événements, des fixtures ou des fichiers de configuration. L'outil crée un seul UUID canonique en minuscules à la fois afin de rester centré sur le flux à valeur unique, sans chevaucher le générateur en masse séparé.

## Ce que signifie UUID v4

Un UUID v4 est un identifiant de 128 bits dont les bits de version et de variante sont fixes, tandis que les 122 bits restants proviennent de données aléatoires. Cela le rend utile lorsque vous avez besoin d'identifiants qui ne révèlent pas l'heure de création, les informations de machine, les compteurs de séquence ou les détails utilisateur.

## Quand l'utiliser

Utilisez UUID v4 pour les identifiants générés côté client, les objets fictifs, les enregistrements temporaires, les exemples publics et les systèmes distribués où coordonner un compteur central serait peu pratique. C'est un bon choix par défaut lorsque l'ordre de tri n'a pas d'importance et que vous avez seulement besoin d'un identifiant à faible risque de collision.

## Confidentialité et fiabilité

La génération s'exécute dans cet onglet du navigateur avec Web Crypto, donc l'UUID n'est pas envoyé à InBrowser.App ni à un autre service. Copiez la valeur une fois qu'elle vous convient, puis régénérez-en une lorsque vous avez besoin d'un nouvel identifiant pour l'enregistrement ou l'exemple suivant.
