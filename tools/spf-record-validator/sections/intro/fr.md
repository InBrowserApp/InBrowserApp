## Comment vérifier un enregistrement SPF

Collez la valeur d’un enregistrement TXT DNS commençant par `v=spf1`, puis choisissez Vérifier la syntaxe. Si le DNS affiche la valeur TXT sous forme de plusieurs chaînes entre guillemets, réunissez-les dans l’ordre en conservant les espaces qu’elles contiennent. L’outil présente chaque mécanisme ou modificateur et indique les erreurs de syntaxe à côté du texte à corriger. La valeur saisie reste dans votre navigateur.

## Comment fonctionnent les mécanismes et qualificateurs SPF

SPF (Sender Policy Framework) permet à un domaine d’indiquer quels serveurs peuvent envoyer du courrier en son nom. Le serveur destinataire vérifie les mécanismes dans l’ordre. Par exemple, `v=spf1 ip4:192.0.2.0/24 include:_spf.example.com -all` vérifie un bloc IPv4 et la politique SPF d’un fournisseur avant le `-all` final. Un qualificateur indique le résultat du mécanisme, à savoir une réussite (`+`), un échec (`-`), un échec souple (`~`) ou un résultat neutre (`?`). Le qualificateur par défaut est `+`. Les modificateurs comme `redirect=` utilisent un signe égal et n’ont pas de qualificateur.

## Que signifie le nombre de termes liés aux requêtes DNS ?

La RFC 7208 autorise jusqu’à 10 termes susceptibles de déclencher une requête DNS lors de l’évaluation SPF. Le nombre affiché compte les termes possibles dans l’enregistrement collé, dont `a`, `mx`, `include`, `exists`, `ptr` et tout `redirect` actif. Un `include` ou un `redirect` peut ajouter d’autres termes. Un mécanisme qui correspond peut arrêter l’évaluation plus tôt. Pour confirmer la politique SPF en vigueur et le nombre total de termes concernés, examinez l’enregistrement TXT publié et les domaines qu’il référence.
