## Pourquoi le décodage Base85 est utile

Base85 apparaît lorsque des données binaires doivent circuler dans des systèmes purement textuels avec moins de surcharge que l’hexadécimal ou Base64. On le rencontre dans des flux PostScript ou PDF, des charges Z85 de ZeroMQ, des captures de débogage, des exports archivés et des outils qui exigent des caractères imprimables au lieu d’octets binaires bruts.

## Ce que ce décodeur permet de faire

Cet outil reconvertit du texte ASCII85 ou Z85 en octets d’origine directement dans le navigateur. Vous pouvez coller des données encodées, importer un fichier, changer d’alphabet pour correspondre au système source, prévisualiser le résultat décodé et télécharger le binaire restauré sans rien envoyer à un serveur.

## Points à garder en tête

- ASCII85 et Z85 ne sont pas interchangeables. Choisir le mauvais alphabet provoque généralement une erreur de décodage ou une sortie corrompue.
- Base85 est un format d’encodage, pas de chiffrement. Le résultat décodé peut être du texte brut, un contenu compressé ou des données binaires arbitraires.
- Z85 exige des groupes complets de 5 caractères, tandis qu’ASCII85 peut aussi inclure des délimiteurs et des raccourcis comme `z` pour les blocs nuls.
