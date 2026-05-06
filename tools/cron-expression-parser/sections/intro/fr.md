## Comprendre les planifications cron avant de les mettre en production

Les expressions cron sont compactes, mais une petite erreur de champ peut exécuter une tâche bien plus souvent, ou bien moins souvent, que prévu. Cet analyseur valide l’expression dans votre navigateur, explique la planification en langage clair, détaille chaque champ et affiche un aperçu des prochaines heures d’exécution.

### Quand l’utiliser

- Vérifier une planification de déploiement, de sauvegarde, de nettoyage ou de notification avant de l’ajouter à un serveur, un système de CI ou un exécuteur de tâches.
- Comparer une expression cron copiée avec la planification que vous attendez réellement.
- Apprendre ou déboguer la syntaxe cron en modifiant un champ à la fois et en observant la mise à jour de l’explication.

### Format pris en charge

L’outil prend en charge les expressions cron Unix standard à cinq champs : minute, heure, jour du mois, mois et jour de la semaine. Il accepte aussi une expression à six champs avec les secondes au début pour les planificateurs qui prennent en charge la précision à la seconde.

### Lire le résultat

Le résumé donne une description en langage clair, tandis que le tableau des champs montre comment l’expression brute est découpée. Les prochaines heures d’exécution utilisent le fuseau horaire local de votre navigateur ; comparez-les donc avec le fuseau horaire utilisé par le planificateur qui exécutera la tâche.

### Notes

- Les valeurs du jour de la semaine utilisent couramment `0` ou `7` pour dimanche, et les noms tels que `MON` ou `FRI` sont également acceptés.
- Les noms de mois tels que `JAN` ou `DEC` peuvent faciliter la revue des planifications de production.
- Si votre planificateur utilise un autre dialecte cron, vérifiez les jetons spéciaux tels que `?`, `L`, `W` ou `#` dans la documentation propre à ce planificateur.
