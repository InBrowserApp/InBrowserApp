## Ce que recherche cet outil

IP Info Lookup résout une adresse IPv4, une adresse IPv6, un domaine ou une URL et affiche les métadonnées publiques que les services internet peuvent fournir pour chaque adresse. Il est utile lorsque vous devez vérifier vers où pointe un domaine, quel réseau possède une adresse, quel nom d'hôte de DNS inverse existe, ou si les enregistrements IPv4 et IPv6 mènent à des fournisseurs différents.

## Comment fonctionnent les recherches de domaine et d'URL

Lorsque vous saisissez un domaine ou une URL, l'outil extrait le nom d'hôte et interroge le résolveur DNS-over-HTTPS sélectionné pour les enregistrements A et AAAA. Chaque adresse renvoyée est ensuite enrichie séparément, afin que les domaines double pile puissent afficher des pays, ASN, FAI, noms d'hôte ou fuseaux horaires différents pour IPv4 et IPv6.

## Ce que signifient les résultats

Les champs de localisation et de FAI proviennent de fournisseurs publics de métadonnées IP tels que geojs.io et ip.sb, tandis que les noms d'hôte proviennent des recherches PTR DNS inverses lorsqu'elles sont disponibles. Ces enregistrements décrivent la façon dont les bases de données publiques voient l'adresse, et non l'emplacement physique exact d'une personne ou d'un appareil.

## Notes sur la confidentialité et l'exactitude

La recherche s'exécute dans votre navigateur et envoie des requêtes DNS et de métadonnées IP à des services tiers. Les VPN, proxys, CDN, réseaux mobiles et plateformes cloud peuvent faire différer la localisation ou l'organisation indiquée de l'utilisateur final ou du serveur attendu. Les champs vides sont normaux pour les adresses privées, réservées, nouvellement attribuées ou peu documentées.
