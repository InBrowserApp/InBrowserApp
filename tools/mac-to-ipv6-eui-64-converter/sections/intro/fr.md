## Comment l’adresse est construite

EUI-64 modifié insère `ff:fe` entre les deux moitiés de l’adresse MAC et inverse le bit universel/local du premier octet. Par exemple, `00:11:22:33:44:55` donne l’identifiant d’interface `211:22ff:fe33:4455`. Avec le préfixe `2001:db8:1:2::/64`, on obtient l’adresse `2001:db8:1:2:211:22ff:fe33:4455`.

Saisissez `fe80::/64` pour obtenir une adresse de lien local. Pour ajouter le nom d’une interface, utilisez le [convertisseur d’adresses de lien local](/fr/tools/mac-address-to-ipv6-link-local-address-converter/). Pour obtenir une adresse de monodiffusion utilisable sur votre réseau, choisissez un préfixe /64 qui lui est attribué. L’exemple utilise un préfixe réservé à la documentation.
