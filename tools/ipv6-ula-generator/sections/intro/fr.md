## Qu’est-ce qu’une adresse locale unique IPv6 ?

Une adresse locale unique IPv6 (ULA) est destinée aux communications au sein de sites, de réseaux privés et d’organisations interconnectées. L’espace ULA complet est `fc00::/7`. Son huitième bit est le **bit L** : la valeur `1` sélectionne la plage `fd00::/8` attribuée localement qu’utilise ce générateur, tandis que la moitié `fc00::/8` reste réservée à une autre méthode d’attribution.

Les ULA ne sont pas joignables globalement par défaut, mais « local » ne signifie ni secret ni automatiquement sécurisé. Elles peuvent franchir les limites de sites routés, les VPN et les interconnexions privées lorsque les opérateurs configurent ces chemins.

## Comment ce générateur RFC 4193 construit un /48

Ce générateur RFC 4193 demande exactement 40 bits aléatoires à la Web Crypto API et les combine avec `fd`. Le résultat est un préfixe de site de 48 bits statistiquement unique, comme `fd12:3456:789a::/48`. La génération reste dans le navigateur : elle ne collecte aucune adresse MAC, aucun horodatage, aucun identifiant d’appareil ni aucune réponse de serveur.

Il existe `2^40` ID globaux possibles, soit environ 1 100 milliards. Une source aléatoire sécurisée rend la réutilisation accidentelle peu probable, mais ne peut garantir que deux préfixes générés indépendamment ne coïncideront jamais. Consignez le `/48` choisi dans la documentation de votre réseau et réutilisez-le de manière cohérente.

## Planification des 65 536 sous-réseaux /64 disponibles

Après le préfixe de site `/48` vient un ID de sous-réseau de 16 bits. Les valeurs de `0000` à `ffff` permettent 65 536 réseaux `/64`. Par exemple, l’ID de sous-réseau `00a0` transforme `fd12:3456:789a::/48` en réseau canonique `fd12:3456:789a:a0::/64`.

Les 64 bits restants constituent l’ID d’interface. Cet outil planifie uniquement des préfixes réseau ; il ne génère pas d’adresses d’hôte `/128` et ne dérive pas d’identifiants d’interface à partir d’adresses MAC.

## Où utiliser les ULA — et où ne pas les utiliser

Les ULA conviennent à un adressage interne stable, aux sites reliés par VPN, aux réseaux de laboratoire et aux services qui doivent conserver un préfixe interne tout en utilisant également une adresse IPv6 unicast globale. Elles ne sont ni un pare-feu ni une limite de sécurité intrinsèque. Appliquez les contrôles d’accès habituels, filtrez le trafic ULA inapproprié aux limites du site et évitez de publier les enregistrements ULA internes dans le DNS public.

Un hôte peut utiliser simultanément une ULA et une adresse unicast globale. Utilisez l’adresse globale pour l’accès à Internet et le préfixe ULA pérenne pour les chemins privés qui en ont besoin.
