## Qu'est-ce que bcrypt ?

bcrypt est un algorithme de hachage de mots de passe conçu pour le stockage des mots de passe. Il combine le mot de passe avec un sel aléatoire et répète un travail coûteux selon un facteur de coût, afin que les attaquants aient besoin de plus de temps pour tester chaque supposition.

## Quand utiliser cet outil

- Générez un hash bcrypt pour un compte de test, un script d'initialisation ou un environnement de développement local.
- Comparez la manière dont différents facteurs de coût modifient le format de sortie et le temps d'exécution.
- Créez un hash prêt à copier sans envoyer le mot de passe à un serveur.

## Comment choisir le facteur de coût

Les valeurs de coût plus élevées sont plus lentes et généralement plus sûres, mais elles ralentissent aussi chaque tentative de connexion dans votre application. Un coût autour de 10-12 est courant pour les systèmes interactifs ; des valeurs plus élevées peuvent être raisonnables pour des flux réservés aux administrateurs ou à faible volume. Testez le coût sur le même type de matériel que celui qui vérifiera le mot de passe.

## Ce qu'il faut garder à l'esprit

- Chaque hash généré utilise un sel aléatoire neuf, donc la sortie change même lorsque le mot de passe et le coût restent identiques.
- Stockez le hash bcrypt, pas le mot de passe d'origine.
- Utilisez bcrypt pour les mots de passe, pas pour les sommes de contrôle de fichiers, les signatures ou le hachage général.
- Gardez un comportement de vérification constant et évitez de révéler si un compte utilisateur existe.
