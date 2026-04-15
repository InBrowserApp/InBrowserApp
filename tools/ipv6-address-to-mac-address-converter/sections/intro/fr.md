## Comment convertir IPv6 en adresse MAC

Vous ne pouvez retrouver une adresse MAC à partir d'une adresse IPv6 que si
l'identifiant d'interface IPv6 a été dérivé de cette MAC avec la méthode
EUI-64. C'est surtout le cas des anciennes adresses link-local commençant par
`fe80::` et de certaines adresses autoconfigurées sans état.

### Quand cela fonctionne

Cette conversion inverse fonctionne lorsque les 64 derniers bits de l'adresse
IPv6 contiennent encore un identifiant d'interface EUI-64.

- L'identifiant d'interface a été construit à partir d'une adresse MAC 48 bits.
- Les octets du milieu sont toujours `ff:fe`.
- L'adresse n'a pas été générée par des extensions de confidentialité ni par
  un autre mécanisme de randomisation.

### Comment fonctionne la conversion

Le convertisseur reconstruit l'adresse MAC en suivant ces étapes :

1. Lire les 64 derniers bits de l'adresse IPv6.
2. Retirer les octets `ff:fe` insérés au milieu de l'identifiant d'interface.
3. Inverser le bit universel/local du premier octet.
4. Formater les 48 bits restants comme une adresse MAC standard.

### Pourquoi aucune MAC n'apparaît

Vous pouvez ne pas obtenir de résultat pour plusieurs raisons :

- L'adresse IPv6 n'est pas syntaxiquement valide.
- L'adresse est valide, mais elle n'a pas été générée à partir d'une MAC via
  EUI-64.
- L'adresse utilise la confidentialité, un identifiant aléatoire stable,
  DHCPv6 ou une autre méthode d'attribution non basée sur une MAC.
