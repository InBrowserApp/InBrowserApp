## Ce que cet outil normalise

Cet outil convertit les adresses IPv4, les adresses IPv6 et les plages CIDR en notation canonique directement dans le navigateur. Il supprime le remplissage IPv4 inutile, compresse IPv6 sous la forme abrégée standard et préserve la famille d'adresses d'origine.

## Comment fonctionne la normalisation CIDR

Lorsque vous entrez un bloc CIDR, l'outil réécrit l'adresse en adresse réseau réelle pour ce préfixe. Les bits de l'hôte sont effacés, donc `192.168.0.15/24` devient `192.168.0.0/24` et `2001:db8::1234/64` devient `2001:db8::/64`.

## Quand cela est utile

Utilisez-le avant de comparer les règles de pare-feu, les ACL, les tables de routage, les listes autorisées VPN ou les fichiers de configuration importés. La saisie normalisée rend plus fiables la détection des doublons, les révisions et le copier-coller dans les outils réseau.

## Pourquoi une contribution peut être rejetée

L'outil rejette les adresses IPv4 ou IPv6 mal formées, les préfixes CIDR non valides et les combinaisons d'adresses ou de préfixes qui ne correspondent pas à la famille de protocoles. Si la valeur ne peut pas être analysée sans ambiguïté, il est plus sûr de la rejeter que de normaliser le mauvais réseau.
