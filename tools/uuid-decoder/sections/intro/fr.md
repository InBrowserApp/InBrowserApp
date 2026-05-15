# Qu’est-ce qu’un décodeur UUID ?

Un décodeur UUID explique la structure interne d’un identifiant unique universel. Il normalise les formats courants collés, vérifie que la valeur est un UUID 128 bits et affiche la version, la variante, les octets hexadécimaux bruts et des représentations numériques prêtes à copier.

Les UUID sont souvent traités comme des chaînes opaques, mais le quartet de version indique comment l’identifiant a été créé. Les UUID de version 4 sont aléatoires, les versions 3 et 5 sont des hachages basés sur un nom, et les versions ordonnées dans le temps, comme 1, 6 et 7, peuvent transporter des informations d’horodatage.

## Quand l’utiliser

Utilisez cet outil lorsque vous devez inspecter un identifiant provenant de journaux, de bases de données, d’API, de traces ou de jeux de test. Il est utile pour confirmer si un UUID est aléatoire ou basé sur le temps, le convertir en décimal ou en Base64 pour un autre système, et repérer si le champ de nœud d’un UUID v1 ou v6 peut exposer un identifiant de type MAC.

Le décodeur s’exécute dans votre navigateur et n’envoie pas les valeurs UUID à un serveur. Il accepte les UUID canoniques, les valeurs `urn:uuid:`, les UUID entre accolades, les entrées en majuscules et les UUID hexadécimaux de 32 caractères sans traits d’union.

## Points de vigilance

Les champs de version et de variante d’un UUID décrivent la disposition des bits, pas le fait que l’identifiant soit réellement unique à l’échelle mondiale. Un UUID d’apparence valide peut tout de même être dupliqué s’il a été généré de manière incorrecte ou copié par erreur.

Pour les UUID de version 1 et de version 6, le champ de nœud peut ressembler à une adresse MAC. Les générateurs modernes peuvent plutôt définir le bit multicast et utiliser un nœud aléatoire ; traitez-le donc comme un identifiant de nœud, sauf si vous contrôlez le générateur.
