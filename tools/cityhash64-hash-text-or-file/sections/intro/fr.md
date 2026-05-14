## Qu'est-ce que CityHash64 ?

CityHash64 est un algorithme de hachage non cryptographique rapide de Google qui produit une valeur de 64 bits (8 octets). Il est utile lorsque vous avez besoin d'une empreinte compacte et déterministe pour du texte ou des fichiers, et que la vitesse compte davantage que la sécurité cryptographique.

**Caractéristiques principales :**

- **Rapide et déterministe** : la même entrée et la même graine produisent toujours le même hachage de 64 bits
- **Non cryptographique** : n'utilisez pas CityHash64 pour les mots de passe, les signatures, les jetons ou les contrôles d'intégrité infalsifiables
- **Compatible avec les graines** : laissez la graine vide pour le CityHash64 standard, ou saisissez une graine décimale ou hexadécimale `0x` lorsque vous avez besoin d'un espace de hachage avec graine distinct
- **Traitement local** : le texte et les fichiers sont hachés dans le navigateur ; les fichiers importés ne sont pas envoyés à un serveur
- **Plusieurs encodages** : les résultats sont affichés en hexadécimal, Base64, décimal et binaire

**Utilisations courantes :**

- Tables de hachage et structures de donnees
- Empreintes de fichiers hors sécurité
- Déduplication et répartition de données
- Clés de cache et clés de partitionnement
- Jeux de référence de régression pour les systèmes qui utilisent déjà CityHash64
- Indexation de bases de données
