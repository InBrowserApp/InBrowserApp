## Comment planifier des sous-réseaux IPv4 avec VLSM

Saisissez un bloc parent en notation CIDR, par exemple 192.168.10.0/24. Ajoutez une ligne par sous-réseau et indiquez le nombre d’adresses d’hôtes nécessaires. Prévoyez aussi les adresses des passerelles et une marge pour les futurs équipements. Lancez le calcul pour afficher chaque réseau attribué, son masque, sa plage d’IP utilisables, son adresse de diffusion et les blocs CIDR encore disponibles.

Les masques de sous-réseau de longueur variable (VLSM) permettent de diviser un réseau en sous-réseaux de tailles différentes. Le calculateur choisit le plus petit bloc adapté à chaque besoin. Il attribue les blocs les plus grands en premier en les alignant sur les limites CIDR. Dans un sous-réseau standard, l’adresse réseau et l’adresse de diffusion sont réservées. Par exemple, un /26 offre 62 adresses utilisables et peut donc accueillir 50 hôtes.

Choisissez un /31 uniquement pour une liaison IPv4 point à point qui prend en charge deux adresses utilisables. Choisissez un /32 pour une adresse unique, comme celle de l’interface de bouclage d’un routeur. Dans les deux cas, il n’y a pas d’adresse de diffusion. Le calcul s’effectue dans votre navigateur, où restent aussi les noms des sous-réseaux.
