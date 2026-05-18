Générez un lot d'identifiants UUID v4 directement dans votre navigateur lorsque vous avez besoin d'ID aléatoires pour des lignes de base de données, des fixtures d'API, des clés d'objet, des charges de test, des modèles d'import ou une opération ponctuelle.

## Ce que fournit UUID v4

UUID v4 est un identifiant de 128 bits construit principalement à partir d'octets aléatoires cryptographiquement sûrs. Les bits de version et de variante sont fixés par la disposition RFC 4122, ce qui donne à un UUID v4 la forme familière `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` tout en conservant un très grand espace aléatoire.

## Choisir une taille de lot pratique

Le lot par défaut fournit assez d'ID pour de nombreux workflows de fixtures et de tableurs sans rendre la page difficile à parcourir. Augmentez le nombre lorsque vous préparez un import plus volumineux, ou réduisez-le si vous n'avez besoin que de quelques identifiants pour un exemple de requête ou une modification manuelle en base.

## Copier ou exporter

Vérifiez la liste générée, puis copiez-la dans votre éditeur ou téléchargez un fichier texte brut. Chaque valeur est générée localement, et le lot actuel n'est jamais téléversé par cet outil.

## Conseils sur les collisions

Le risque de collision UUID v4 est extrêmement faible pour les charges applicatives normales, mais il ne remplace pas une contrainte d'unicité en base de données. Continuez à imposer l'unicité lorsque l'ID devient une clé primaire, un jeton public ou une référence durable.
