## Ce que fait cet outil

- Encode du texte brut en entités HTML nommées, décimales ou hexadécimales.
- Décode des extraits déjà encodés en texte lisible.
- Tout s'exécute localement dans votre navigateur, donc vos données restent sur
  l'appareil.

## Quand l'utiliser

- Échapper les caractères spéciaux avant de coller du HTML dans de la
  documentation, des modèles ou des démos.
- Inspecter du balisage copié qui contient `&amp;`, `&#60;` ou `&#x3C;`.
- Comparer les formats d'entités nommées, décimales et hexadécimales selon vos
  besoins de compatibilité.

## Remarques sur les formats d'entité

- Les entités nommées sont les plus lisibles, mais tous les caractères n'en ont
  pas.
- Les entités décimales et hexadécimales peuvent représenter n'importe quel
  caractère Unicode, y compris les emoji.
- Les entités inconnues ou invalides restent inchangées lors du décodage.
