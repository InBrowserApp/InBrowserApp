## Qu’est-ce qu’un analyseur de certificats X.509 ?

Un certificat X.509 est un document signé qui associe une clé publique à une identité, comme un domaine, un service, une organisation ou une personne. Les certificats TLS, les fichiers de chaînes de certificats et de nombreux flux S/MIME ou de signature utilisent ce format.

Cet analyseur lit les certificats et les clés publiques directement dans votre navigateur. Il peut inspecter les blocs PEM, les fichiers DER binaires et le texte DER base64, puis afficher le sujet, l’émetteur, le numéro de série, la fenêtre de validité, l’algorithme de signature, l’algorithme de clé publique, les empreintes et les extensions courantes.

Utilisez-le lorsque vous devez comparer l’empreinte d’un certificat, vérifier qu’un certificat correspond à l’hôte attendu, inspecter les noms alternatifs du sujet, confirmer l’utilisation de la clé ou extraire les détails d’une clé publique pendant le dépannage de problèmes TLS et de déploiement.

L’outil ne valide pas les chaînes de confiance et ne contacte pas les autorités de certification. Il affiche ce qui est encodé dans le certificat ou la clé publique que vous fournissez ; utilisez donc un scanner TLS dédié lorsque vous avez besoin de vérifier la révocation, la chaîne, le nom d’hôte ou un point de terminaison actif.

- Comparez les empreintes SHA-256 ou SHA-1 avant d’installer ou de renouveler des certificats.
- Examinez SAN, l’utilisation de la clé, l’utilisation étendue de la clé et les contraintes de base sans téléverser le contenu du certificat.
- Inspectez les clés publiques SPKI autonomes lorsqu’un service ne vous fournit qu’un fichier PEM ou DER de clé publique.
