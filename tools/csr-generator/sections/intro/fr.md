## Qu'est-ce qu'un CSR ?

Une demande de signature de certificat (CSR) est un petit document PKCS#10 dont une autorité de certification (CA) a besoin pour émettre un certificat TLS ou de signature de code. Il regroupe la partie publique d'une paire de clés, l'identité que vous souhaitez que la CA atteste (le Sujet), et tout identifiant supplémentaire comme des noms DNS ou des adresses IP (les Subject Alternative Names, ou SAN), le tout signé par la clé privée correspondante.

Cet outil construit le CSR entièrement dans votre navigateur à l'aide de l'API Web Crypto et de [`@peculiar/x509`](https://github.com/PeculiarVentures/x509). Rien concernant votre clé ou votre demande n'est envoyé à un serveur.

## Quand utiliser cet outil

- Demander un certificat TLS auprès d'une CA publique (Let's Encrypt, DigiCert, ZeroSSL, Sectigo, etc.) lorsque leur processus vous demande de coller votre propre CSR.
- Générer un CSR pour une autorité de certification interne — basée sur ACME, smallstep, EJBCA, AD CS — sans faire confiance à un formulaire hébergé.
- Réémettre un certificat avec la même clé privée en important une clé PKCS#8 PEM existante et en signant uniquement un nouveau CSR.

## Comment remplir le formulaire

- **Source de la clé** — choisissez _Générer une nouvelle clé_ pour créer une nouvelle paire de clés, ou _Importer une clé existante_ pour coller une clé PKCS#8 PEM non chiffrée. Les clés chiffrées, les blocs `RSA PRIVATE KEY` hérités et les blocs `EC PRIVATE KEY` ne sont pas acceptés ; convertissez-les d'abord avec `openssl pkcs8 -topk8 -nocrypt`.
- **Algorithme** — RSA offre la compatibilité la plus large par défaut. ECDSA produit des signatures plus petites et est largement pris en charge par les CA modernes et les clients TLS.
- **Sujet** — la plupart des CA publiques ignorent tout sauf le Common Name et considèrent la liste DNS SAN comme faisant autorité, mais les CA privées peuvent encore nécessiter un DN complet.
- **Entrées SAN** — listez les noms d'hôtes, adresses IP, adresses e-mail ou URI que vous souhaitez couvrir par le certificat. Un par ligne, ou séparés par des virgules.

## Points importants à garder à l'esprit

- La clé privée affichée à côté du CSR est générée localement et ne quitte jamais votre navigateur. Sauvegardez-la avant de fermer l'onglet — sans la clé privée correspondante, le certificat signé est inutilisable.
- Les CA publiques exigent que le Common Name (ou au moins une entrée SAN) soit un nom DNS qu'elles peuvent valider. Les SAN d'adresse IP sont surtout utiles pour les certificats internes.
- La clé privée générée est non chiffrée. Ajoutez une phrase secrète avec `openssl pkcs8 -in key.pem -topk8 -out key-enc.pem` si vous en avez besoin avant de la stocker.
- Seuls RSA (2048/3072/4096) et ECDSA (P-256/P-384/P-521) sont pris en charge. EdDSA est intentionnellement omis car son acceptation dans les navigateurs et les CA reste encore inconsistante.
