## Qu'est-ce qu'un validateur d'UUID ?

Un validateur d'UUID vérifie si un identifiant est écrit dans la forme UUID standard de 36 caractères, comme `6ba7b810-9dad-11d1-80b4-00c04fd430c8`. Il est utile lorsque vous devez vérifier des ID copiés depuis des journaux, des API, des bases de données, des fixtures de test ou une saisie utilisateur avant de vous y fier dans le code.

### Entrée prise en charge

Cet outil valide le texte UUID canonique avec cinq groupes hexadécimaux dans la disposition `8-4-4-4-12`. Les lettres majuscules sont acceptées et normalisées en minuscules. L'UUID nil (`00000000-0000-0000-0000-000000000000`) et l'UUID max (`ffffffff-ffff-ffff-ffff-ffffffffffff`) sont traités comme des valeurs spéciales valides.

### Détails de validation

Pour les UUID standard, le validateur contrôle le demi-octet de version et les bits de variante. Les versions 1 à 8 sont reconnues, couvrant les UUID historiques RFC 4122 et les nouveaux formats RFC 9562 comme UUID v6, v7 et v8. Le panneau de résultat divise aussi l'UUID en ses cinq segments afin que vous puissiez inspecter les octets exacts en cours de validation.

### Confidentialité

La validation s'exécute entièrement dans votre navigateur. L'UUID que vous collez n'est pas téléversé, ce qui rend l'outil sûr pour les identifiants internes, les clés de base de données et les exemples de journaux de production qui doivent rester locaux.
