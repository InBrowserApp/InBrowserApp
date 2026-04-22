## Qu'est-ce que l'IBAN ?

L'IBAN (International Bank Account Number) est un identifiant standardisé des comptes bancaires utilisé pour les paiements internationaux.

### Structure de l'IBAN

Un IBAN commence par un code pays à deux lettres, deux chiffres de contrôle et un BBAN spécifique au pays.

### Validation de checksum

La validité de l'IBAN est vérifiée avec l'algorithme mod-97 de la norme ISO 13616.

1. Supprimez les espaces et déplacez les quatre premiers caractères à la fin
2. Convertissez les lettres en nombres (A=10, B=11, ..., Z=35)
3. Calculez mod 97 ; un IBAN valide laisse un reste de 1

Chaque pays définit une longueur et une structure fixes pour la partie BBAN.
