Les UUID v1 et UUID v6 contiennent les mêmes informations de base : un horodatage, une séquence d'horloge et un identifiant de nœud. UUID v1 stocke l'horodatage dans l'ordre historique des champs UUID, tandis que UUID v6 réordonne ces bits d'horodatage afin qu'un simple tri lexicographique suive plus naturellement l'heure de création.

Utilisez cet outil lorsque vous devez transférer des identifiants entre des systèmes qui attendent différentes dispositions d'UUID basés sur le temps. Collez un UUID v1 pour obtenir son équivalent UUID v6, ou collez un UUID v6 pour retrouver la représentation UUID v1. La conversion est déterministe et conserve inchangés la séquence d'horloge et les octets du nœud.

## Quand l'utiliser

- Migrer des enregistrements d'un stockage UUID v1 historique vers UUID v6 tout en préservant les métadonnées d'identité.
- Déboguer des bases de données, des journaux ou des files d'attente qui mélangent des valeurs UUID v1 et UUID v6.
- Vérifier si une valeur UUID v6 correspond bien à la valeur UUID v1 attendue par une ancienne intégration.

## Format d'entrée

Le convertisseur accepte les chaînes UUID canoniques avec traits d'union, les chaînes UUID compactes de 32 caractères, les UUID en majuscules, les valeurs `urn:uuid:` et les UUID entre accolades. Les résultats sont toujours normalisés en forme UUID canonique en minuscules.

## Notes sur la confidentialité et la compatibilité

Les UUID v1 et UUID v6 peuvent encoder l'heure de création et des informations de nœud. Traitez-les comme des identifiants opérationnels, pas comme des secrets, et évitez de les exposer lorsque les métadonnées d'horodatage ou de nœud pourraient être sensibles. Cet outil s'exécute localement dans votre navigateur et n'envoie pas vos UUID.
