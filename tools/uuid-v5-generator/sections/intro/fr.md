Générez des identifiants UUID v5 à partir d'un UUID d'espace de noms et d'un nom sans envoyer aucune de ces valeurs à un serveur. UUID v5 est utile lorsque vous avez besoin d'un identifiant stable qui peut être recréé plus tard à partir de la même entrée, par exemple un ID pour un nom de domaine, une URL, un chemin d'objet, un identifiant de compte ou un enregistrement de fixture.

## Fonctionnement d'UUID v5

UUID v5 combine un UUID d'espace de noms avec une chaîne de nom, hache ces octets avec SHA-1, puis applique les bits de version et de variante RFC 4122. Comme l'entrée est déterministe, `example.com` dans l'espace de noms DNS produit toujours le même UUID : `cfbff0d1-9375-5685-968c-48ce8b15ae17`.

## Choisir un espace de noms

Utilisez `ns:DNS` pour les noms de domaine, `ns:URL` pour les URL, `ns:OID` pour les identifiants d'objet et `ns:X.500 DN` pour les noms distinctifs X.500. Vous pouvez également coller votre propre espace de noms UUID lorsque votre application a besoin d'identifiants limités à un produit, un locataire, un jeu de données ou une migration.

## Quand l'utiliser

Choisissez UUID v5 lorsque la reproductibilité compte plus que le hasard. Il convient bien aux importations déterministes, aux fixtures de test, aux enregistrements avec espace de noms et aux systèmes qui exigent que le même élément logique reçoive le même ID à chaque exécution. Pour les jetons secrets ou les ID publics imprévisibles, utilisez plutôt un générateur aléatoire.
