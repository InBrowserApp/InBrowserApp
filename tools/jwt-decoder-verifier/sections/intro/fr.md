## Qu'est-ce qu'un décodeur et vérificateur de JWT ?

Un JSON Web Token est une chaîne compacte composée de trois segments base64url : un en-tête, une charge utile et une signature. Cet outil décode l'en-tête et la charge utile dans votre navigateur afin que vous puissiez inspecter la structure du token sans l'envoyer à un serveur.

La vérification de signature contrôle si le token a été signé avec la clé et l'algorithme attendus. Utilisez un secret partagé pour les tokens HS256, HS384 ou HS512. Utilisez une clé publique PEM, un JWK ou un JWKS pour les tokens RS, PS et ES.

## Quand l'utiliser

Utilisez le décodeur pour déboguer des flux d'authentification, vérifier des claims OAuth ou OpenID Connect, comparer des environnements, ou confirmer qu'un backend émet les valeurs attendues d'audience, d'émetteur, de sujet, d'expiration et d'identifiant de clé.

Utilisez la vérification lorsque vous disposez du secret ou de la clé publique correspondants et que vous devez confirmer que l'en-tête, la charge utile et la signature appartiennent toujours au même ensemble. L'outil met aussi en évidence `exp`, `nbf` et `iat` afin que les problèmes courants d'horloge et d'expiration soient visibles immédiatement.

## Notes de sécurité

Les charges utiles JWT sont seulement encodées, pas chiffrées. Toute personne qui possède le token peut lire ses claims, sauf si le token est un JWE chiffré distinct, que cet outil ne traite pas.

Ne collez pas de tokens de production ni de secrets privés sur des machines partagées. L'outil s'exécute localement dans votre navigateur et ne stocke pas le token ni les éléments de vérification, mais le flux le plus sûr reste d'utiliser autant que possible des tokens de test à courte durée de vie et des clés publiques.
