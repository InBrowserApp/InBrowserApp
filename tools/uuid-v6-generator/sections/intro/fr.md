Le générateur d'UUID v6 crée des UUID basés sur le temps qui conservent la forme UUID familière tout en plaçant l'horodatage en premier pour un tri lexicographique naturel. Il s'exécute entièrement dans votre navigateur; les identifiants générés et les valeurs de nœud facultatives ne quittent donc jamais la page.

## Quand UUID v6 est utile

Utilisez UUID v6 quand vous avez besoin d'identifiants qui restent largement compatibles avec les outils UUID, tout en se triant presque selon leur ordre de création dans les journaux, les index de bases de données, les flux d'événements ou les scripts de migration. UUID v6 est sémantiquement très proche d'UUID v1 : il utilise un horodatage grégorien, une séquence d'horloge et un champ de nœud de 48 bits, mais réorganise les bits de l'horodatage pour que les ID récents se trient après les ID plus anciens.

## ID de nœud et confidentialité

Les générateurs UUID v1 classiques utilisent souvent une véritable adresse MAC comme champ de nœud. Cet outil utilise par défaut un ID de nœud aléatoire administré localement pour chaque UUID généré, afin de ne pas exposer d'adresse matérielle. Ne passez à un nœud personnalisé que lorsque vous avez volontairement besoin d'une sortie compatible v1 pour des jeux de tests, des contrôles d'interopérabilité ou des systèmes maîtrisés.

## Séquence d'horloge et heure personnalisée

La séquence d'horloge aide à éviter les collisions lorsque les horodatages se répètent ou que les horloges reculent. La séquence aléatoire par défaut est la plus sûre pour une utilisation normale. Les horodatages, ID de nœud et séquences d'horloge personnalisés sont utiles pour des exemples déterministes, mais les valeurs personnalisées répétées doivent être utilisées avec prudence dans les données de production.
