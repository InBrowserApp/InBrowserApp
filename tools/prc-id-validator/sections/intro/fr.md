## Qu'est-ce qu'un ID de résident de la RPC ?

Le numéro d'ID de résident de la RPC comporte 18 caractères et inclut un code d'adresse, une date de naissance, un code de séquence et un chiffre de contrôle. Ce validateur vérifie ces éléments hors ligne et vous aide à comprendre la structure du numéro.

### Fonctionnement de la validation

- Supprime les espaces et les tirets et normalise le dernier caractère en `X` majuscule
- Exige exactement 18 caractères : 17 chiffres suivis d’un chiffre final ou de `X`
- Compare les 6 premiers chiffres au jeu de données des divisions administratives 2023 et analyse la date de naissance sur 8 chiffres
- Recalcule le chiffre de contrôle à partir des 17 premiers chiffres et le compare au dernier caractère

### Ce que montre le résultat

- Détail de la région : province, ville, district/comté et code de région brut
- Date de naissance, âge actuel, code de séquence et genre dérivé du code de séquence
- ID normalisé ainsi que le chiffre de contrôle attendu et réel pour le débogage

### Exemple

`110101199001010015` peut se lire ainsi :

- `110101` -> district de Dongcheng, Pékin
- `19900101` -> date de naissance `1990-01-01`
- `001` -> code de séquence
- `5` -> chiffre de contrôle

### Remarque importante

Cet outil effectue uniquement une validation structurelle et du checksum hors ligne. Un numéro qui passe ces contrôles ne prouve pas qu'il correspond à une identité réelle ni qu'un document est encore actif.

Les noms de région sont basés sur le jeu de données des divisions administratives de 2023.
