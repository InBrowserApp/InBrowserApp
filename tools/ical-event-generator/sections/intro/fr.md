## Créez des fichiers de calendrier sans quitter le navigateur

Cet outil génère des fichiers d’événement `.ics` standard directement dans votre navigateur. Vous pouvez définir des événements horaires ou sur toute la journée, choisir une stratégie de fuseau horaire, ajouter des rappels et exporter l’entrée finale du calendrier sans synchroniser de données vers un serveur.

### Pourquoi l’utiliser

- Il est pratique lorsque vous avez seulement besoin d’un fichier de calendrier, sans passer par tout le flux d’un compte de calendrier.
- Il conserve les plannings sensibles en local tout en générant une pièce jointe d’événement conforme aux standards.
- Vous pouvez ajuster les règles de récurrence et les rappels avant de télécharger le fichier `.ics` final.

### Flux recommandé

1. Renseignez le résumé de l’événement, le lieu, les notes et l’URL de référence facultative.
2. Choisissez la plage de l’événement, puis décidez si vous exportez en horodatage `UTC` ou si vous conservez le fuseau d’origine avec `TZID`.
3. Ajoutez des règles de récurrence et des rappels uniquement si nécessaire, puis téléchargez le fichier et joignez-le partout où vous partagez l’événement.

### Notes

- La sortie `UTC` est généralement l’option la plus sûre si vous visez une large compatibilité entre calendriers.
- La sortie `TZID` conserve le contexte d’origine pour les clients capables d’interpréter des fuseaux horaires nommés.
- Pour les événements sur toute la journée, le formulaire garde la date de fin inclusive alors que le fichier ICS l’enregistre comme une fin exclusive.
