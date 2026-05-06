## Ce que montre cet outil

L'outil Informations sur l'appareil collecte les détails visibles par le navigateur pour l'appareil que vous utilisez en ce moment. Il regroupe les résultats en sections navigateur, affichage, matériel, réseau, stockage et capacités afin que vous puissiez voir rapidement ce qu'un site web peut détecter sans installer de logiciel de diagnostic.

## Quand il est utile

Utilisez-le lorsque vous devez déboguer des mises en page adaptatives, reproduire des tickets de support, comparer des navigateurs, confirmer si les cookies ou le stockage local sont disponibles, vérifier les dimensions d'affichage ou capturer un instantané JSON compact pour un rapport de bug. Il est aussi utile avant de tester des fonctionnalités qui dépendent de canvas, WebGL, du presse-papiers, des service workers ou du stockage.

## Notes sur la confidentialité et l'exactitude

L'outil s'exécute entièrement dans votre navigateur et n'envoie pas l'instantané. Les navigateurs masquent ou arrondissent volontairement certaines valeurs, en particulier les détails sur la mémoire, le CPU, le GPU, le réseau et le user agent. Les valeurs manquantes signifient généralement que le navigateur n'expose pas cette API, que la page n'est pas dans un contexte sécurisé ou qu'un paramètre de confidentialité a bloqué l'accès.

## Comment lire les résultats

Traitez les données comme la vue actuelle de votre environnement par le navigateur, et non comme un inventaire matériel garanti. Redimensionnez la fenêtre ou faites pivoter l'appareil, puis actualisez l'instantané pour mettre à jour les valeurs de fenêtre d'affichage, d'orientation et d'affichage. Utilisez l'action de copie JSON lorsque vous devez partager les valeurs observées exactes avec une équipe de développement ou de support.
