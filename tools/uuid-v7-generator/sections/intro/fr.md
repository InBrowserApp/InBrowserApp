UUID v7 est un format UUID moderne qui place un horodatage Unix en millisecondes au début de l'identifiant et remplit les bits restants avec de l'aléatoire. En pratique, les valeurs sont ainsi uniques à l'échelle mondiale tout en restant naturellement triables par heure de création.

## Ce que fait cet outil

Ce générateur crée des valeurs UUID v7 entièrement dans votre navigateur. Vous pouvez générer un seul identifiant ou un lot allant jusqu'à 100, puis copier la liste ou la télécharger sous forme de fichier texte pour des données d'initialisation, des enregistrements de base de données, des jeux d'événements ou des charges utiles de test.

## Quand UUID v7 est utile

UUID v7 est utile lorsque vous voulez des identifiants opaques qui se trient tout de même correctement dans les bases de données, les journaux, les files d'attente et les flux d'événements distribués. Par rapport aux valeurs UUID v4 aléatoires, UUID v7 réduit le brassage des index, car les nouveaux enregistrements tendent à apparaître près de la fin d'un espace de clés trié.

## Notes sur la triabilité et la sécurité

La partie horodatage enregistre des millisecondes, pas une valeur privée ou secrète. Si un identifiant ne doit pas révéler son heure approximative de création, utilisez plutôt un format entièrement aléatoire. Dans un même lot généré, cet outil garde les valeurs monotones pour la même milliseconde tout en préservant les bits de version et de variante UUID v7.
