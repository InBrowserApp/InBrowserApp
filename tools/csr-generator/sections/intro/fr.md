# CSR Generator

Une Certificate Signing Request (CSR) est un message PKCS#10 qui contient votre clé publique, les champs Subject d’identification, des extensions facultatives comme les Subject Alternative Names, ainsi qu’une signature créée avec la clé privée correspondante. Les autorités de certification utilisent la CSR pour émettre un certificat X.509 sans jamais recevoir votre clé privée.

Ce générateur crée des CSR directement dans votre navigateur. Vous pouvez générer une nouvelle paire de clés RSA ou ECDSA, ou importer une clé privée PEM non chiffrée existante lorsque vous devez renouveler un certificat pour une clé déjà déployée.

## Quand l’utiliser

Utilisez une CSR lorsque vous avez besoin qu’une autorité de certification émette ou renouvelle un certificat TLS, S/MIME, d’authentification client ou de service interne. La CSR prouve la possession de la clé privée et transporte les informations d’identité publique qui doivent apparaître dans le certificat.

Pour les certificats TLS publics, placez les noms d’hôte dans les Subject Alternative Names. Le Common Name reste utile pour la lisibilité et les systèmes hérités, mais les clients modernes valident les noms DNS et les adresses IP à partir des SAN.

## Comment générer une CSR

Choisissez de générer une nouvelle clé ou d’importer une clé privée existante. Remplissez les champs Subject pertinents pour votre demande de certificat, puis ajoutez des entrées SAN pour les noms DNS, adresses IP, adresses e-mail ou URI. Générez la CSR et envoyez uniquement la CSR PEM à votre autorité de certification.

Si cet outil génère une nouvelle clé, téléchargez et stockez la clé privée avant de quitter la page. Si vous importez une clé, l’outil génère uniquement la CSR et ne réexporte pas la clé privée importée.

## Notes sur les clés et les formats

RSA 2048 bits est largement compatible ; 3072 ou 4096 bits peuvent être préférables pour des certificats internes à plus longue durée de vie. ECDSA P-256 est compact et largement pris en charge, tandis que P-384 ou P-521 peuvent être exigés par des politiques plus strictes. Le parcours d’importation de clé prend en charge les blocs PEM PKCS#8, RSA PRIVATE KEY et EC PRIVATE KEY non chiffrés.

Les clés privées sont sensibles. Ne les collez pas dans des sites web non fiables, ne les envoyez pas aux autorités de certification et ne les validez pas dans le contrôle de code source. Cet outil s’exécute localement dans le navigateur, mais votre processus opérationnel doit tout de même prévoir un stockage sécurisé des clés et leur rotation.
