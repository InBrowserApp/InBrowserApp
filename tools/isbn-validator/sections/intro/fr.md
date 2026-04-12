## Qu'est-ce que l'ISBN ?

L'ISBN (International Standard Book Number) est un identifiant pour les livres et éditions.

- `ISBN-10`: `0-306-40615-2`
- `ISBN-13`: `978-0-306-40615-7`
- `X = 10`

### Vérification ISBN-10

ISBN-10 comporte 9 chiffres de données et un chiffre de contrôle (X signifie 10).

1. Retirez les tirets et les espaces
2. Multipliez par des poids de 10 à 2 et additionnez
3. Le chiffre de contrôle rend la somme divisible par 11

`10×d1 + 9×d2 + ... + 2×d9 + check ≡ 0 (mod 11)`

`0-8044-2957-X`

### Vérification ISBN-13

ISBN-13 comporte 12 chiffres de données et un chiffre de contrôle, commence généralement par 978 ou 979.

1. Multipliez alternativement par 1 et 3
2. Additionnez les 12 premiers chiffres
3. Le chiffre de contrôle rend la somme multiple de 10

`1×d1 + 3×d2 + 1×d3 + ... + 3×d12 + check ≡ 0 (mod 10)`

`978-0-306-40615-7`

Un ISBN-10 valide devient ISBN-13 avec le préfixe 978 ; seuls les ISBN-13 avec 978 se reconvertissent.

`9780306406157` -> `0306406152`
