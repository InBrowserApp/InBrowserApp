CIDR Parser transforme un bloc comme `10.24.8.19/21` ou `2001:db8:abcd::123/64` en réseau réellement visé. Il normalise les entrées avec adresse d’hôte, affiche le sous-réseau canonique et expose les limites utiles pour écrire des règles de pare-feu, documenter des plages ou vérifier qu’une allocation n’est pas trop large.

## Ce qu’il montre

Le résultat commence par une vue d’ensemble, puis détaille le bloc: CIDR canonique, nombre total et utilisable d’adresses, début et fin de plage, ainsi que les valeurs entières du bloc. Pour IPv4, vous obtenez aussi le masque réseau, le masque wildcard et l’adresse de broadcast. Pour IPv6, le flux reste le même mais les champs sans objet sont masqués.

## Pourquoi la canonicalisation compte

De nombreuses valeurs CIDR collées contiennent des bits d’hôte. C’est pratique pour les humains, mais les routeurs, ACLs et documents attendent généralement l’adresse réseau canonique. En réécrivant le bloc avant toute copie, l’outil aide à repérer les erreurs de limite avant qu’elles arrivent en configuration.

## Notes pratiques

- Les blocs IPv4 `/31` et `/32` sont traités comme entièrement utilisables, ce qui correspond aux usages modernes point-à-point et host-route.
- Les blocs IPv6 indiquent tout l’espace d’adressage et la plage utilisable sans inventer de notion de broadcast.
- Tout s’exécute localement dans le navigateur: les sous-réseaux internes ne quittent pas la page pendant l’inspection.
