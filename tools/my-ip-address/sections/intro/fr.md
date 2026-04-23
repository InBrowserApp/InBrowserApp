## Ce que montre cet outil

Cet outil recherche les adresses publiques IPv4 et IPv6 que les services externes peuvent voir à partir de votre session de navigateur actuelle. Si le navigateur peut également exposer des interfaces locales candidates via WebRTC, l'outil les répertorie séparément.

## Pourquoi les résultats IPv4, IPv6 et WebRTC peuvent être différents

Votre adresse IPv4 et votre adresse IPv6 peuvent provenir de différents chemins réseau, FAI ou configurations de tunneling. Les candidats WebRTC peuvent inclure des adresses LAN privées, des adresses d'interface IPv6 temporaires ou des routes liées au VPN que les sites Web normaux n'affichent pas toujours directement.

## Comment fonctionne la recherche

L'outil interroge les fournisseurs IP publics tels que Cloudflare, geojs.io, ip.sb et ipify.org, puis enrichit l'adresse détectée avec le nom d'hôte, l'ASN, l'organisation, le pays, le fuseau horaire et les métadonnées de coordonnées lorsqu'elles sont disponibles. Cela signifie que l'outil nécessite une connexion Internet active et dépend de la qualité de réponse de ces services tiers.

## Pourquoi une adresse peut manquer

Une adresse peut ne pas apparaître si votre réseau bloque une famille de protocoles, si votre VPN ou proxy filtre la demande, si votre navigateur désactive l'exposition WebRTC ou si le service de recherche en amont est temporairement indisponible. Si IPv6 n'est pas disponible sur votre réseau, il est normal de voir uniquement IPv4.
