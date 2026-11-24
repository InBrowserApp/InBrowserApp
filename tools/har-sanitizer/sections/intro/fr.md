## Comment nettoyer un fichier HAR

Un fichier HAR (HTTP Archive) enregistre les requêtes et les réponses réseau du navigateur. Il peut contenir des cookies de session, des jetons d’autorisation, des URL et des données privées dans le corps des messages. Préparez une copie nettoyée pour l’assistance, un rapport de bug ou un collègue tout en conservant la méthode, le code d’état et les durées de chaque requête.

1. Ouvrez les outils de développement de votre navigateur et accédez au panneau **Réseau**. Reproduisez le problème, puis exportez le journal au format HAR. Dans Chrome, choisissez **Exporter au format HAR (nettoyé)** pour obtenir une copie dont les en-têtes d’authentification standard ont déjà été retirés.
2. Ouvrez ou déposez ici le fichier HAR exporté. L’outil prépare une copie dès que vous sélectionnez un fichier. Essayez l’exemple pour voir ce qui change dans une capture.
3. Vérifiez les compteurs, puis choisissez **Télécharger le HAR nettoyé**. Le nom du nouveau fichier se termine par `.sanitized.har`. Vous pouvez l’importer dans les outils de développement ou dans l’[Analyseur réseau HAR](/fr/tools/har-analyzer/). Le traitement a lieu dans votre navigateur.

## Quelles données sont supprimées ou masquées ?

Les cookies et les en-têtes d’authentification courants, dont `Authorization` et `X-API-Key`, sont supprimés. Par défaut, l’outil masque les valeurs des paramètres d’URL et supprime le corps des requêtes et des réponses, ainsi que les données WebSocket enregistrées. Par exemple, `?token=example&page=2` devient `?token=REDACTED&page=REDACTED` dans le fichier exporté. Les noms des paramètres restent disponibles pour le débogage. Chaque champ modifié est compté séparément, même si une même valeur figure dans plusieurs champs.

Désactivez l’option correspondante si vous avez besoin des valeurs ou des contenus d’origine pour reproduire le problème. Les noms d’hôte, les chemins d’URL, les autres en-têtes et les métadonnées propres au navigateur peuvent encore contenir des informations privées. Vérifiez ces champs avant de partager le fichier.
