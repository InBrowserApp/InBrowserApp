## Qu'est-ce qu'un numéro de TVA intracommunautaire ?

Un numéro d'identification à la TVA est délivré par un État membre de l'UE aux entreprises assujetties à la taxe sur la valeur ajoutée. Il commence par un code pays à deux lettres (par exemple, `BE` pour la Belgique ou `EL` pour la Grèce), suivi d'une séquence de chiffres, et parfois de lettres, propre à chaque pays. Les administrations fiscales l'utilisent pour suivre les échanges transfrontaliers et les demandes de remboursement : une erreur sur une facture, un contrat ou un document d'approvisionnement peut donc facilement bloquer un paiement ou déclencher un contrôle.

## Ce que cet outil vérifie réellement

Ce vérificateur effectue trois validations indépendantes, entièrement dans votre navigateur :

1. **Code pays** — les deux premières lettres doivent correspondre à un État membre de l'UE participant au régime de TVA (y compris le code spécial `EL` utilisé pour la Grèce).
2. **Format** — les caractères restants doivent respecter le format de TVA documenté du pays. Par exemple, la TVA belge compte exactement dix chiffres, la TVA autrichienne commence par `U` suivi de huit chiffres, et la TVA néerlandaise a la forme `<neuf chiffres>B<deux chiffres>`.
3. **Somme de contrôle** — lorsqu'une somme de contrôle déterministe existe dans les règles de TVA du pays (Autriche, Belgique, Danemark, Finlande, France, Allemagne, Italie, Pays-Bas, Pologne, Portugal, Espagne, Suède), le dernier chiffre ou la dernière lettre est recalculé(e) et comparé(e).

Un numéro qui passe ces trois contrôles est syntaxiquement bien formé. Cela ne revient pas à confirmer que l'entreprise est actuellement immatriculée — pour cela, vous devez toujours passer par le service VIES de la Commission européenne ou par l'administration fiscale locale. Cet outil s'utilise idéalement avant cette vérification finale, pour détecter les fautes de frappe, les chiffres intervertis et les erreurs de copier-coller qui feraient échouer une requête VIES pour la mauvaise raison.

## Les erreurs fréquentes qu'il détecte

- Des numéros qui semblent corrects au premier coup d'œil mais à qui il manque un pays (par exemple, commençant par `US` ou `UK`).
- Des zéros en tête supprimés par un tableur, produisant un numéro trop court d'un chiffre.
- Des espaces, points ou tirets collés par un système de facturation — l'outil les normalise puis vérifie le résultat.
- La confusion classique entre le code pays grec `GR` et le code TVA `EL`, que la vérification de format rejette immédiatement.

## Ce qu'affiche la carte de résultat

Au-delà d'un simple indicateur valide/invalide, le résultat détaille le pays, le numéro normalisé, le format attendu par le pays, et indique si la somme de contrôle a réussi, échoué ou a été ignorée parce que le pays n'en publie pas. Ce niveau de détail est utile pour expliquer un rejet — « le format est correct, mais la somme de contrôle ne correspond pas » est bien plus exploitable qu'« invalide ».

## Confidentialité

Toutes les vérifications s'exécutent localement dans votre navigateur. Rien n'est envoyé à un serveur, journalisé ou stocké ailleurs que dans le localStorage de votre propre navigateur (pour la dernière saisie, afin qu'elle survive à un rechargement de page). Vous pouvez coller le numéro de TVA d'un client sans vous soucier de son devenir.
