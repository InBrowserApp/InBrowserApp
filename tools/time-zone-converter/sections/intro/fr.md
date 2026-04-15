## À quoi sert cet outil

Utilisez ce convertisseur pour transformer une date et une heure locales d'un fuseau horaire IANA en l'heure locale équivalente d'un autre fuseau. Il est utile lorsque vous devez comparer des horaires entre plusieurs villes sans additionner les offsets manuellement ni deviner si l'heure d'été est active.

## Cas d'usage courants

- Vérifier si une réunion à Tokyo tombe le même jour calendaire à New York ou à Londres.
- Vérifier les offsets avant de publier des horaires, des alertes ou des plages de support.
- Copier les valeurs ISO 8601, UTC ou les timestamps Unix correspondants pour les logs et les API.

## Comment ce convertisseur fonctionne

- Saisissez une date et une heure locales au format `YYYY-MM-DD HH:mm:ss.SSS` d'un côté, puis choisissez les fuseaux horaires source et cible.
- Le côté modifié en dernier devient la référence. L'outil convertit d'abord cet instant en UTC en interne, puis affiche l'heure locale équivalente dans l'autre fuseau.
- Utilisez `Now` pour remplir rapidement l'heure actuelle, ou `Swap` pour inverser la comparaison. Les offsets peuvent changer autour des transitions d'heure d'été.
