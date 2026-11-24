## Générer un enregistrement TXT DNSLink pour IPFS

DNSLink fait pointer un domaine ou un sous-domaine vers un chemin de contenu. Saisissez votre domaine et collez un CID IPFS ou un chemin IPFS ou IPNS. Copiez le **Nom** et la **Valeur TXT** générés dans un nouvel enregistrement TXT chez votre fournisseur DNS. Par exemple, le domaine `www.example.com` utilise le nom d’enregistrement `_dnslink.www.example.com`. Si l’éditeur DNS ajoute automatiquement `example.com`, saisissez `_dnslink.www` dans le champ du nom.

## Vérifier la cible de votre DNSLink

Sélectionnez **Vérifier l’enregistrement publié** pour consulter les réponses TXT de Cloudflare et de Google. Laissez la cible vide pour consulter une configuration existante ou saisissez la cible souhaitée pour la comparer à la valeur publiée. Après une modification, les résolveurs peuvent renvoyer une ancienne valeur jusqu’à l’expiration de leur cache. Le TTL affiché indique combien de temps la réponse DNS reçue peut rester en cache.

## Mettre à jour un site IPFS sur un domaine personnalisé

Utilisez un CID IPFS pour pointer directement vers une version fixe de vos fichiers ou un chemin IPNS pour suivre un nom que vous pouvez mettre à jour. DNSLink indique aux clients et aux passerelles compatibles quel contenu résoudre. Pour servir ce contenu sur votre propre domaine en HTTPS, configurez une passerelle compatible avec DNSLink et faites pointer votre domaine vers elle. [Domaines personnalisés et DNSLink dans IPFS](https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains/)
