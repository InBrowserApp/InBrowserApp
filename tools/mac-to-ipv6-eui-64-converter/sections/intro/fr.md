## Comment convertir une adresse MAC en IPv6

Saisissez une adresse MAC de 48 bits avec des deux-points, des tirets, des points ou sans séparateurs. Ajoutez le préfixe réseau IPv6 `/64` à utiliser. Le convertisseur accepte les notations abrégée et complète. Les bits d’hôte du préfixe doivent tous être à zéro. L’adresse IPv6 se met à jour pendant la saisie et peut être copiée. Le bouton **Essayer un exemple** remplit les deux champs.

## Comment EUI-64 modifié construit l’adresse

Dans un sous-réseau `/64`, le préfixe réseau fournit les 64 premiers bits et l’identifiant d’interface fournit les 64 derniers. EUI-64 modifié insère `ff:fe` entre les deux moitiés de l’adresse MAC et inverse le bit universel/local du premier octet. Par exemple, `00:11:22:33:44:55` donne l’identifiant d’interface `211:22ff:fe33:4455`. Avec le préfixe `2001:db8:1:2::/64`, on obtient l’adresse `2001:db8:1:2:211:22ff:fe33:4455`.

## Préfixes IPv6 courants

- **Lien local.** Utilisez `fe80::/64` pour communiquer sur le même lien. Le bouton **Utiliser le préfixe de lien local** renseigne ce préfixe et conserve votre adresse MAC. Pour ajouter le nom d’une interface, par exemple `%eth0`, utilisez le [convertisseur d’adresses IPv6 de lien local](/fr/tools/mac-address-to-ipv6-link-local-address-converter/).
- **Adresse locale unique (ULA).** Le bouton **Utiliser l’exemple ULA** renseigne `fd12:3456:789a:1::/64`, un exemple de la plage `fd00::/8` destinée aux réseaux internes. Le [générateur d’ULA IPv6](/fr/tools/ipv6-ula-generator/) permet de créer un préfixe unique pour votre réseau.
- **Monodiffusion globale.** Saisissez un sous-réseau `/64` issu du bloc attribué par votre fournisseur d’accès à Internet, votre fournisseur cloud ou votre administrateur réseau.
- **Documentation.** Le préfixe `2001:db8:1:2::/64` appartient à la plage `2001:db8::/32`, réservée à la documentation et aux exemples.

## Le résultat correspond-il à l’adresse IPv6 de mon appareil ?

Le résultat est l’adresse calculée pour votre préfixe selon EUI-64 modifié. Un appareil peut utiliser un autre identifiant d’interface, par exemple un identifiant stable ou temporaire généré pour protéger la vie privée. Si vous disposez d’une adresse IPv6 dont l’identifiant d’interface dérive d’une adresse MAC, vous pouvez retrouver celle-ci avec le [convertisseur d’IPv6 en MAC](/fr/tools/ipv6-address-to-mac-address-converter/).
