## Aperçu

JSON Diff Path compare deux documents JSON et transforme chaque changement structurel en un enregistrement de chemin lisible, avec une sortie en JSONPath et JSON Pointer.

## Quand l'utiliser

Utilisez-le pour examiner des modifications de charge utile d'API, inspecter des migrations de configuration ou générer des opérations JSON Patch RFC 6902 pour l'automatisation.

## Comment ça fonctionne

L'outil analyse les deux entrées JSON, calcule les changements `add`, `remove` et `replace`, puis vous permet de filtrer ces opérations et de basculer entre une liste de chemins et une sortie JSON Patch dans le même panneau de résultats.
