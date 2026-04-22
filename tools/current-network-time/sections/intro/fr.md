## A quoi sert cet outil

Utilisez cet outil pour comparer l'horloge de votre appareil avec une heure
issue du reseau. Il recupere un horodatage depuis le point de trace
Cloudflare, estime le milieu de la latence aller-retour et affiche l'horloge
reseau dans votre navigateur.

## Quand il aide

- Verifier si l'horloge locale de votre systeme est en avance ou en retard.
- Confirmer une derive horaire avant de depanner TLS, des jetons, des taches
  planifiees ou des journaux.
- Obtenir rapidement une heure de reference basee sur le reseau sans installer
  d'outils NTP.

## Points a surveiller

- Le decalage affiche est une estimation qui depend de la latence reseau.
- Si la requete de trace echoue, l'outil revient a votre horloge locale
  jusqu'a la prochaine synchronisation reussie.
- Pour une correction systeme precise, ajustez les reglages de synchronisation
  horaire de l'appareil ou la configuration NTP.
