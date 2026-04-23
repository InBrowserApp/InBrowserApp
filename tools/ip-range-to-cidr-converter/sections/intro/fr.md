## Que fait cet outil

Cet outil convertit une adresse IP de début et une adresse IP de fin en le plus petit ensemble de blocs CIDR couvrant exactement toute la plage. Tout s'exécute localement dans votre navigateur, de sorte que les adresses ne quittent jamais votre appareil.

## Comment fonctionne la couverture CIDR

Un bloc CIDR représente un réseau de taille puissance de deux aligné sur une limite correspondante. Lorsqu’une plage commence ou se termine au milieu de ces limites, un bloc ne suffit pas. Le convertisseur continue de prendre le plus grand bloc aligné qui convient, puis répète jusqu'à ce que toute la plage soit couverte.

## Pourquoi plusieurs blocs peuvent apparaître

Les plages telles que 192.168.1.10 à 192.168.1.25 ne commencent pas sur une limite de réseau propre et ne se terminent pas non plus. Le résultat exact est donc une courte liste de blocs, chacun couvrant une partie alignée sans inclure d'adresses supplémentaires en dehors de la plage demandée.

## Quand cela est utile

Utilisez-le lors de la préparation de règles de pare-feu, de résumés de routage, d'entrées ACL, de groupes de sécurité cloud ou de listes de contrôle de migration où une plage de début et de fin brute doit devenir une notation CIDR standard.
