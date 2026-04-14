## Qu'est-ce que l'échappement Unicode ?

L'échappement Unicode convertit les caractères en séquences encodées qui représentent leurs points de code Unicode. C'est indispensable lorsque le code source, les fichiers de configuration ou les formats de données ne peuvent pas contenir directement certains caractères.

**Formats d'échappement courants :**

- `\uXXXX` — JavaScript / JSON, utilisé dans la plupart des langages de programmation
- `\u{XXXXX}` — JavaScript ES6+, prend en charge les caractères supplémentaires sans paires de substitution
- `&#xXXXX;` / `&#DDDD;` — Entités HTML en notation hexadécimale ou décimale
- `U+XXXX` — Notation Unicode standard utilisée dans la documentation
- `\xXX` / `%XX` — Encodage au niveau des octets UTF-8, courant dans les URL et les langages de type C
- `\UXXXXXXXX` — Format Python à 8 chiffres pour tout point de code
- `0xXXXX` — Notation littérale hexadécimale

## Quand utiliser cet outil

- Intégrer des caractères non ASCII dans du code source ou des fichiers de configuration nécessitant un encodage compatible ASCII
- Déboguer du texte mal affiché en inspectant les points de code Unicode sous-jacents
- Convertir entre différentes notations d'échappement lors du portage entre langages ou formats
- Préparer du texte pour des contextes JSON, HTML ou URL nécessitant des caractères encodés en entités

## Comment ça fonctionne

Saisissez ou collez du texte brut à gauche et l'outil échappe les caractères non ASCII en utilisant le format sélectionné. Collez du texte échappé à droite et l'outil détecte et décode automatiquement tous les formats pris en charge simultanément. Tout s'exécute localement dans le navigateur.
