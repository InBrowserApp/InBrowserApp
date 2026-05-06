## Ce que fait cet outil

Cet outil combine des blocs CIDR dans le plus petit ensemble équivalent, puis soustrait tous les blocs CIDR que vous placez dans la liste d'exclusion. Il prend en charge IPv4 et IPv6 dans la même exécution, et tout le traitement s'effectue localement dans votre navigateur.

## Fonctionnement de la fusion et de l'exclusion

La liste de fusion est d'abord normalisée : les bits d'hôte sont effacés, les réseaux qui se chevauchent sont regroupés, et les réseaux adjacents sont réduits lorsqu'ils peuvent être représentés par un bloc CIDR plus court. Ensuite, la liste d'exclusion est soustraite des plages fusionnées. La sortie finale est redéployée sous forme de liste CIDR minimale qui couvre exactement ce qui reste.

## Quand l'utiliser

Utilisez-le pour nettoyer des règles de pare-feu, préparer des entrées de groupes de sécurité cloud, vérifier des listes d'autorisation VPN, synthétiser des tables de routage ou retirer des plages réservées d'une allocation plus large. Il est particulièrement utile lorsqu'une configuration copiée contient des blocs qui se chevauchent ou lorsqu'un vaste réseau doit perdre quelques plages plus petites.

## Notes de saisie

Saisissez un CIDR par ligne, ou séparez plusieurs CIDR par des virgules. Les blocs IPv4 et IPv6 peuvent être collés ensemble, mais les exclusions ne s'appliquent qu'aux blocs de la même famille d'adresses. Les entrées non valides sont signalées avec leur liste et leur numéro de ligne afin que vous puissiez corriger de grandes saisies collées sans deviner.
