## Qu'est-ce qu'Argon2 ?

Argon2 est un algorithme de hachage de mots de passe conçu pour rendre coûteux le craquage de mots de passe hors ligne. Il combine des calculs répétés avec un coût mémoire configurable, afin que les attaquants aient besoin de temps et de mémoire pour chaque tentative de mot de passe.

**Pourquoi Argon2id est généralement le choix par défaut :**

- Il équilibre mieux la résistance aux attaques par canal auxiliaire et au craquage par GPU que l'utilisation d'Argon2i ou Argon2d pour la plupart des systèmes de stockage de mots de passe
- La sortie encodée stocke l'algorithme, la version, la mémoire, les itérations, le parallélisme, le sel et le hachage dans une seule chaîne portable
- Un sel aléatoire unique empêche des mots de passe identiques de produire des hachages stockés identiques
- Les paramètres de mémoire et d'itérations peuvent être augmentés à mesure que votre environnement de vérification devient plus rapide

**Comment utiliser cet outil :**

1. Saisissez le mot de passe que vous voulez hacher.
2. Conservez le sel généré ou créez un nouveau sel aléatoire.
3. Choisissez la variante Argon2 et ajustez la mémoire, les itérations, le parallélisme et la longueur du hachage pour le système qui vérifiera le hachage.
4. Générez le hachage encodé et stockez cette chaîne complète dans la base de données de votre application.

**Notes de sécurité :**

- Ne stockez pas et ne journalisez pas le mot de passe en clair.
- Utilisez un nouveau sel aléatoire pour chaque mot de passe.
- Utilisez le secret facultatif uniquement si votre vérificateur possède aussi ce même secret ; sinon, le hachage ne pourra pas être vérifié plus tard.
- Préférez les paramètres de mémoire et d'itérations les plus élevés qui gardent une latence de connexion acceptable pour les utilisateurs réels.
