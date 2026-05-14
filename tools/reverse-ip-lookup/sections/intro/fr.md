La recherche IP inversée convertit une adresse IPv4 ou IPv6 en son nom DNS inverse et interroge l'enregistrement `PTR` correspondant. Elle vous aide à vérifier quel nom d'hôte le propriétaire d'une adresse publie pour les serveurs de messagerie, les équipements réseau, les instances cloud et les notes de dépannage.

## Ce qui est vérifié

Pour IPv4, l'outil inverse les octets et interroge un nom `in-addr.arpa`. Pour IPv6, il développe l'adresse en 32 chiffres hexadécimaux, les inverse, puis interroge le nom `ip6.arpa` correspondant. Le résultat affiche le domaine DNS inverse exact, le code de statut DNS, le résolveur, la famille d'adresses et tous les noms d'hôte renvoyés avec leurs valeurs TTL.

## Fonctionnement de la requête

La recherche s'exécute depuis votre navigateur avec DNS-over-HTTPS. Vous pouvez choisir Cloudflare, Google ou AliDNS comme résolveur, et le navigateur envoie une requête `PTR` standard à ce point de terminaison. Aucun service de recherche côté serveur d'InBrowser.App n'intervient.

## Comment lire les résultats absents

Il est courant qu'une réponse PTR soit absente. De nombreuses adresses résidentielles, cloud, privées ou récemment attribuées ne publient pas d'enregistrements DNS inverses. Une réponse DNS réussie sans nom d'hôte ne prouve pas que l'adresse est inutilisée ; cela signifie seulement que la zone inverse n'a pas renvoyé d'enregistrement `PTR` utilisable via le résolveur sélectionné.

## Notes pratiques

- Le DNS inverse associe une adresse IP à un nom d'hôte ; ce n'est pas la même chose que trouver tous les domaines hébergés sur la même adresse.
- Les enregistrements PTR sont contrôlés par le propriétaire de l'adresse IP ou par le fournisseur amont, pas uniquement par le propriétaire du domaine.
- Les systèmes de messagerie et de sécurité comparent souvent le DNS direct et inverse ; un enregistrement PTR devrait donc généralement pointer vers un nom d'hôte qui se résout vers la même adresse.
