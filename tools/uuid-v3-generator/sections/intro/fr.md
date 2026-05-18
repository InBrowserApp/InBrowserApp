## Qu'est-ce que UUID v3 ?

UUID v3 est un format d'UUID basé sur un nom. Il prend un UUID d'espace de
noms et un nom, les hache avec MD5, puis formate le résultat comme un UUID
standard. Le comportement important est le déterminisme : le même espace de
noms et le même nom produisent toujours le même UUID.

Cet outil s'exécute entièrement dans votre navigateur. L'espace de noms, le nom
et l'UUID généré restent sur votre appareil, sauf si vous copiez le résultat
ailleurs.

## Quand l'utiliser

- Utilisez UUID v3 lorsque vous avez besoin d'un identifiant stable pour un nom
  connu, comme un nom DNS, une URL, un chemin d'objet ou un nom d'utilisateur.
- Choisissez l'espace de noms qui correspond au type de nom que vous
  identifiez. DNS et URL sont les préréglages les plus courants.
- Réutilisez toujours le même espace de noms. Changer l'espace de noms change
  tous les UUID générés, même lorsque le nom reste le même.
- Préférez UUID v5 ou un autre identifiant moderne lorsque vous avez le choix et
  que vous avez besoin d'un UUID basé sur un nom avec un hachage plus fort.
  UUID v3 existe pour assurer la compatibilité avec les systèmes qui attendent
  spécifiquement des UUID basés sur MD5.

## Notes de sécurité

UUID v3 n'est pas un ID aléatoire et n'est pas secret. Toute personne qui
connaît l'espace de noms et le nom peut régénérer le même UUID. Ne l'utilisez
pas pour des mots de passe, des jetons de session, des clés d'API ou d'autres
valeurs qui doivent être imprévisibles.
