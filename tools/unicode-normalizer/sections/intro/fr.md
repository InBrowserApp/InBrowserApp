## Comment normaliser un texte Unicode

Collez ou saisissez votre texte dans **Texte d’origine**, puis choisissez une forme de normalisation. Le résultat s’actualise pendant la saisie et lorsque vous changez de forme. Sélectionnez **Copier le résultat** pour utiliser le texte normalisé dans une autre application. La conversion s’effectue dans votre navigateur et votre texte reste sur votre appareil.

## Quelle forme de normalisation Unicode choisir ?

- **NFC (composition canonique)** convient à la plupart des textes. Elle réunit une lettre et son accent en un seul point de code s’il existe un caractère composé. Utilisez-la pour uniformiser les représentations équivalentes avant de stocker ou de comparer du texte.
- **NFD (décomposition canonique)** sépare les séquences en leurs composants canoniques, par exemple une lettre de base et un accent combinatoire. Choisissez-la pour examiner ou traiter les signes diacritiques séparément.
- **NFKC (composition de compatibilité)** uniformise aussi les variantes de compatibilité, comme les lettres pleine chasse et les ligatures. Elle facilite la recherche ou la comparaison lorsque ces différences n’ont pas d’importance.
- **NFKD (décomposition de compatibilité)** applique les mêmes correspondances de compatibilité et garde le résultat sous forme décomposée, ce qui peut faciliter l’analyse du texte.

## Pourquoi le texte normalisé peut-il avoir la même apparence ?

La lettre **é** peut être représentée par `U+00E9` ou par un **e** suivi d’un accent aigu combinatoire (`U+0065 U+0301`). NFC produit la première représentation, et NFD la seconde. Ouvrez **Comparer les points de code** pour voir la séquence au début de chaque texte, même si leur apparence est identique.

Sélectionnez **Essayer un exemple** pour voir aussi des différences visibles. Avec NFKC, **ＡＢＣ ① ﬁ** devient **ABC 1 fi**. NFC conserve ces distinctions de compatibilité.

## Quand la normalisation peut-elle modifier le sens ?

NFKC et NFKD peuvent effacer des distinctions de mise en forme, comme un exposant dans une formule ou un nombre cerclé dans une liste. Choisissez NFC si ces distinctions sont importantes. Le changement de casse, la suppression des accents ou la conversion d’un encodage à un autre, comme UTF-8 vers UTF-16, sont des opérations distinctes.

Pour en savoir plus, consultez [l’annexe du standard Unicode sur les formes de normalisation](https://www.unicode.org/reports/tr15/).
