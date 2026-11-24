## Comment lire un rapport agrégé DMARC

Ouvrez la pièce jointe d’un rapport agrégé envoyé à l’adresse `rua` de votre enregistrement DMARC. La visionneuse accepte les fichiers XML et GZIP ainsi que les ZIP contenant un seul rapport XML. Vous pouvez aussi coller le XML ou charger l’exemple. Le résumé indique qui a envoyé le rapport, la période couverte en UTC et la politique publiée par le domaine. Les fichiers et le texte sont traités dans votre navigateur.

## Comment interpréter le nombre de messages

Chaque enregistrement regroupe des messages qui partagent une IP source et un résultat d’évaluation. Une ligne peut représenter plusieurs messages, et une même IP peut figurer sur plusieurs lignes. Les totaux additionnent le nombre de messages de chaque ligne. Un message réussit le contrôle DMARC si SPF ou DKIM réussit et s’aligne sur le domaine From visible. La visionneuse compte un échec uniquement si les deux alignements échouent. Si les données d’alignement sont incomplètes et qu’aucun des deux contrôles ne réussit, le résultat est inconnu.

## Pourquoi l’alignement, l’authentification et le traitement diffèrent

Dépliez Résultats bruts de l’authentification pour voir les domaines, les résultats et les sélecteurs DKIM signalés. SPF ou DKIM peut réussir pour un autre domaine alors que l’alignement DMARC échoue. Le traitement appliqué indique ce que le destinataire a fait d’un groupe de messages. Il peut différer de la politique publiée si le destinataire y déroge. Filtrez par IP source ou domaine From pour examiner un expéditeur. Les totaux du rapport restent les mêmes.

## Quels formats XML DMARC sont pris en charge ?

La visionneuse lit les rapports agrégés conformes à la RFC 9990, y compris ceux qui utilisent son espace de noms DMARC, ainsi que les anciens rapports qui suivent la RFC 7489. La RFC 9990 décrit le format XML qui résume les résultats d’authentification et le traitement des messages dans les rapports agrégés. Si votre messagerie regroupe plusieurs rapports dans une archive, extrayez celui que vous souhaitez consulter et ouvrez-le séparément.
