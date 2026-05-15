Outils réseau est un point de départ pour les tâches réseau dans le navigateur. Utilisez-le quand vous connaissez le type de problème à résoudre, mais que vous voulez accéder plus vite au bon utilitaire : inspecter une plage IP, interroger des enregistrements DNS, décoder un domaine internationalisé, rechercher un port, ou vérifier l'empreinte d'un certificat ou d'une clé SSH.

## Ce que vous pouvez faire

- Travailler avec IPv4, IPv6, les blocs CIDR, les plages d'adresses et les adresses link-local dérivées de MAC.
- Interroger les enregistrements DNS et DNS inverse avec des outils de recherche adaptés au navigateur.
- Rechercher les codes d'état HTTP, les types MIME, les numéros de port et l'heure réseau actuelle.
- Inspecter les détails des certificats et des clés publiques sans envoyer le contenu source à un serveur.

## Choisir le bon outil

Commencez par **IP et CIDR** lorsque l'entrée est une adresse, une plage, un sous-réseau ou un bloc de routage. Utilisez **DNS et domaines** pour les enregistrements, les recherches PTR et la conversion IDN/Punycode. Utilisez **Références de protocoles** lorsque vous avez besoin d'un tableau de référence rapide. Utilisez **Clés et certificats** lorsque le contenu source est un certificat TLS, une clé publique ou une entrée de clé autorisée SSH.

## Notes de confidentialité

La plupart des outils de cette collection s'exécutent entièrement dans votre navigateur. Les outils qui ont besoin de données réseau publiques, comme les recherches DNS ou les informations IP, peuvent contacter le résolveur ou le service de recherche nécessaire pour répondre à la requête. Évitez de coller des secrets dans les outils de recherche publics, et préférez les outils entièrement locaux pour inspecter les certificats et les clés lorsque le contenu est sensible.
