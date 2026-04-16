## Qu’est-ce que Base85 ?

Base85 est un encodage binaire-vers-texte qui transforme 4 octets en 5 caractères imprimables. Il est plus dense que Base64, et cet outil vous permet de choisir ASCII85 ou Z85 selon le format attendu par la destination.

## Quand l’utiliser

- Encodez des octets, du texte ou des fichiers pour des canaux texte uniquement tout en gardant une sortie relativement compacte.
- Utilisez ASCII85 lorsque vous avez besoin d’un format souple qui accepte des octets finaux incomplets.
- Utilisez Z85 lorsque vous avez besoin d’un texte Base85 compatible ZeroMQ et que la longueur d’entrée est un multiple exact de 4 octets.

## Ce qu’il faut garder en tête

- Base85 est un format d’encodage, pas de chiffrement.
- ASCII85 et Z85 utilisent des alphabets différents, ils ne sont donc pas interchangeables.
- Z85 refuse les données dont la longueur en octets n’est pas divisible par 4, alors qu’ASCII85 peut encoder des blocs finaux partiels.
