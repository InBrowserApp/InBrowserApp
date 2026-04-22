## Qu'est-ce qu'un NIV ?

Un numéro d'identification du véhicule (NIV) est un code de 17 caractères qui identifie de manière unique un véhicule.

- `1M8GDM9AXKP042788`
- Les lettres I, O, Q ne sont pas utilisées
- Le 9e caractère est un chiffre de contrôle

### Structure du NIV

1. **WMI** (positions 1-3) : identifiant mondial du constructeur
2. **VDS** (positions 4-8) : section descriptive du véhicule
3. **Chiffre de contrôle** (position 9) : calculé à partir de tous les autres caractères
4. **VIS** (positions 10-17) : section d'identification du véhicule

### Chiffre de contrôle

Chaque lettre est convertie en un nombre (A=1, B=2, ... en excluant I, O, Q). Chaque position a un poids. La somme pondérée modulo 11 donne le chiffre de contrôle ; 10 est représenté par X.

`(w1×v1 + w2×v2 + ... + w17×v17) mod 11 = chiffre de contrôle`

Cet outil valide uniquement le format et les règles du chiffre de contrôle. Il ne vérifie pas l'immatriculation réelle du véhicule.
