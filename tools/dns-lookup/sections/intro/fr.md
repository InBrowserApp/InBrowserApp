Recherche DNS vérifie les enregistrements DNS publics renvoyés pour un nom de domaine. C'est utile lorsque vous validez le lancement d'un nouveau site, déboguez la distribution des e-mails, vérifiez des changements de CDN ou d'équilibreur de charge, ou confirmez si les réponses liées à DNSSEC diffèrent selon les résolveurs.

## Quand l'utiliser

Utilisez cet outil lorsque vous avez besoin d'une réponse rapide, côté navigateur, pour les types d'enregistrement DNS courants. Les enregistrements A et AAAA indiquent les destinations IPv4 et IPv6, les enregistrements CNAME affichent les alias, les enregistrements MX identifient les serveurs de messagerie, les enregistrements TXT contiennent souvent des jetons SPF ou de vérification, et les enregistrements NS/SOA/CAA/SRV/HTTPS/SVCB exposent la délégation, l'autorité, les certificats, les services et les indications modernes de point de terminaison.

## Fonctionnement

La recherche s'exécute dans votre navigateur avec DNS over HTTPS. Choisissez un résolveur, sélectionnez un ou plusieurs types d'enregistrement, puis envoyez un domaine ou une URL. Les URL sont normalisées vers leur nom d'hôte avant l'envoi de la requête ; ainsi, coller `https://www.example.com/path` interroge `www.example.com`.

## Lire les résultats

Chaque type d'enregistrement est affiché séparément avec le code de réponse DNS, les drapeaux du résolveur, les lignes de réponse et le JSON brut. `NoError` signifie que le serveur DNS a répondu correctement, mais il peut tout de même ne renvoyer aucune ligne de réponse pour un type précis. `NXDomain`, `ServFail` ou `Refused` signifie généralement que le nom n'existe pas, que le résolveur n'a pas pu terminer la recherche ou que la politique du résolveur a bloqué la requête.

## Confidentialité et limites

Les requêtes sont envoyées au résolveur DNS over HTTPS sélectionné, et non à un serveur InBrowser.App. Le comportement du résolveur, l'état du cache, la validation DNSSEC et le filtrage du réseau local peuvent tous influer sur les résultats. Cet outil ne remplace pas les vérifications `dig` faisant autorité depuis plusieurs réseaux, mais il offre un moyen rapide d'inspecter ce que les résolveurs DoH publics renvoient depuis votre navigateur actuel.
