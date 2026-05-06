## Créer des planifications cron visuellement

Les expressions cron sont compactes, mais une petite modification dans le
mauvais champ peut faire passer une tâche de « matins en semaine » à « toutes
les minutes ». Ce générateur donne à chaque champ ses propres contrôles afin que
vous puissiez créer une expression standard à cinq champs sans mémoriser chaque
règle de syntaxe.

### Quand il est utile

- Créer des planifications pour les tâches CI, les sauvegardes, les
  préchauffages de cache, les rapports et d'autres tâches récurrentes.
- Partir d'un préréglage connu et affiner un champ à la fois.
- Prévisualiser les prochaines heures d'exécution locales avant de coller
  l'expression dans un planificateur.

### Comment l'utiliser

1. Choisissez un préréglage rapide, ou gardez l'expression par défaut et
   modifiez chaque champ manuellement.
2. Choisissez si chaque champ doit s'exécuter sur chaque valeur, à un
   intervalle, sur des valeurs spécifiques ou sur une plage.
3. Vérifiez l'expression générée et l'aperçu des prochaines exécutions, puis
   copiez-la dans votre planificateur.

### Notes

- Cet outil génère du cron standard à cinq champs : minute, heure, jour du
  mois, mois et jour de la semaine.
- Le dimanche est affiché comme `0`, ce qui est accepté par les planificateurs
  cron courants de style Unix.
- Si le jour du mois et le jour de la semaine sont tous deux restreints, de
  nombreuses implémentations de cron exécutent la tâche lorsque l'un ou l'autre
  champ correspond. Certains systèmes diffèrent, donc vérifiez cette combinaison
  dans votre planificateur cible.
