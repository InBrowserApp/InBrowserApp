## Ouvrir une capture HAR

Exportez un fichier HAR (HTTP Archive) depuis le panneau Réseau de votre navigateur après avoir enregistré les requêtes à examiner. Ouvrez ou déposez le fichier `.har` ou `.json` ici, ou chargez l’exemple. Les limites sont de 20 MiB et de 20 000 entrées.

## Repérer les requêtes lentes ou échouées

Recherchez par URL, méthode, état ou type MIME, puis triez par heure de début, durée ou taille transférée. Les requêtes partagent une même échelle de temps, mesurée depuis la première requête. Sélectionnez-en une pour examiner ses en-têtes, cookies, paramètres et corps, ainsi que la durée de chaque phase.

Le filtre des échecs inclut les états 0, 4xx et 5xx. L’état 0 signifie qu’aucune réponse HTTP n’a été enregistrée ; le filtre 3xx inclut les réponses 304 liées au cache. TLS fait partie du temps de connexion.

## Lire les données enregistrées

Le traitement reste dans votre navigateur. Les détails disponibles dépendent de l’export. Les tailles inconnues sont exclues des totaux ; la durée de la capture est indisponible si la durée d’une requête est absente. La cascade utilise toujours les heures de début enregistrées et les fins connues.

Les aperçus des corps conservent le texte enregistré. Les aperçus et leurs copies, ainsi que chaque valeur de champ, sont limités à 100 000 caractères. Les corps encodés restent encodés.
