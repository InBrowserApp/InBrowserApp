## Qu'est-ce que la Validation de Carte de Crédit?

La validation de carte de crédit est un processus pour vérifier si un numéro de carte est potentiellement valide avant de traiter une transaction. Elle utilise l'algorithme de Luhn et l'identification de la marque de carte pour vérifier le format.

### Algorithme de Luhn

L'algorithme de Luhn (aussi connu comme Mod 10) est une formule de somme de contrôle utilisée pour valider les numéros d'identification. Voici comment cela fonctionne:

1. En commençant par le chiffre le plus à droite, doublez chaque deuxième chiffre
2. Si le doublement donne un nombre supérieur à 9, soustrayez 9 du résultat
3. Additionnez tous les chiffres. Si le total est divisible par 10, le numéro est valide

### Marques de Cartes Supportées

Les marques de cartes sont identifiées par leur BIN (Numéro d'Identification Bancaire) ou IIN (Numéro d'Identification de l'Émetteur), qui sont les premiers chiffres du numéro de carte.

- Visa: `4` · `13, 16, 19`
- Mastercard: `51-55`, `2221-2720` · `16`
- American Express: `34`, `37` · `15`
- Discover: `6011`, `65`, `644-649`, `622126-622925` · `16, 19`
- JCB: `3528-3589` · `16, 17, 18, 19`
- UnionPay: `62` · `16, 17, 18, 19`
- Diners Club: `36`, `38`, `39`, `300-305` · `14, 16, 19`
