## Générer un préfixe ULA IPv6 en /48

Copiez le préfixe `fd` généré pour votre réseau domestique, votre environnement de test ou votre VPN. Notez le `/48` choisi dans la configuration de votre réseau pour le réutiliser lorsque vous ajoutez des sous-réseaux. Sélectionnez **Générer un nouveau préfixe** pour obtenir une nouvelle allocation.

## Calculer un sous-réseau /64

Saisissez un **ID de sous-réseau** hexadécimal de `0000` à `ffff`. Par exemple, l’ID `00a0` dans `fd12:3456:789a::/48` donne `fd12:3456:789a:a0::/64`. Un `/48` permet de créer 65 536 sous-réseaux `/64`. Vous pouvez ainsi attribuer des préfixes distincts à votre réseau local, au Wi-Fi invité ou à un VPN.

## D’où vient le préfixe fd

La RFC 4193 définit les adresses locales uniques dans l’espace `fc00::/7`. La moitié attribuée localement, `fd00::/8`, commence par `fd`. Le générateur utilise l’API Web Crypto du navigateur pour ajouter un ID global aléatoire de 40 bits et former le `/48`.

## Quand utiliser une adresse locale unique

Une ULA permet de disposer d’adresses IPv6 stables au sein d’un réseau ou entre des sites reliés par VPN. Un appareil peut utiliser une adresse IPv6 globale pour le trafic Internet public et conserver son ULA pour les services internes.
