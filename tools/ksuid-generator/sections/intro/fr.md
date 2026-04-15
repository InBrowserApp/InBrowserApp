## Qu'est-ce que KSUID ?

KSUID (K-Sortable Unique IDentifier) est un identifiant base62 de 27 caractères qui intègre un timestamp de 32 bits (secondes depuis 2014-05-13) et 128 bits de données aléatoires.

**Points clés :**

- **Triable par le temps** : l'ordre lexicographique suit l'heure de création.
- **Forte unicité** : 128 bits d'aléa par ID.
- **Précision à la seconde** : KSUID stocke les secondes, les millisecondes sont arrondies vers le bas.
