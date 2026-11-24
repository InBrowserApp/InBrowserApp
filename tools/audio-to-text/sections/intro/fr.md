## Comment transcrire un enregistrement audio

Déposez l’enregistrement d’une réunion, d’un entretien, d’un cours, d’un podcast ou d’un mémo vocal. Gardez la détection automatique ou indiquez la langue parlée si vous la connaissez. Choisissez un modèle Whisper et sélectionnez **Transcrire l’audio**. Une fois le texte prêt, sélectionnez un horodatage pour écouter le passage correspondant. Vous pouvez corriger les noms, la ponctuation et les mots mal reconnus avant de copier ou de télécharger le texte.

L’outil lit les formats audio que votre navigateur sait décoder, notamment les formats MP3, WAV, M4A, FLAC, OGG et WebM courants. La prise en charge des codecs varie d’un navigateur à l’autre. Si un fichier ne s’ouvre pas, essayez de l’exporter en WAV ou en MP3 depuis votre application d’enregistrement.

## Quel modèle de transcription choisir ?

Essayez d’abord **Rapide (Whisper Base)** pour un mémo vocal bien audible ou une première transcription. **Équilibré (Whisper Small)** peut mieux reconnaître les accents et les échanges à plusieurs. **Précision maximale (Whisper Large V3 Turbo)** est le plus performant sur les enregistrements difficiles. Son téléchargement est plus volumineux et il demande plus de mémoire. Les trois modèles reconnaissent plusieurs langues et transcrivent dans la langue d’origine.

Whisper utilise WebGPU si le navigateur et le matériel graphique le prennent en charge. Le traitement peut aussi se faire sur le processeur via WebAssembly. Au premier lancement, l’outil télécharge le modèle sélectionné. Le navigateur peut réutiliser les fichiers de modèle conservés dans son cache. Le volume téléchargé et la durée du traitement dépendent du modèle et de l’appareil. L’audio est décodé et transcrit sur votre appareil. Le téléchargement du modèle est indépendant de votre enregistrement.

## Exporter une transcription horodatée ou des sous-titres

- **TXT** indique l’heure de début de chaque passage dans l’enregistrement. Par exemple, `[00:02:15.320] Passons en revue l’ordre du jour.` correspond à une phrase prononcée un peu plus de deux minutes après le début. Ce format convient aux notes de réunion, aux citations d’entretiens et aux recherches dans le texte.
- **SRT (SubRip)** associe un début et une fin à chaque sous-titre numéroté. De nombreux logiciels de montage acceptent ce format.
- **VTT (WebVTT)** indique aussi le début et la fin de chaque sous-titre et fonctionne avec les lecteurs vidéo HTML qui acceptent les pistes de sous-titres.

Whisper estime le début et la fin de chaque passage. Réécoutez les citations importantes et vérifiez la synchronisation des sous-titres avant de les partager. Les bruits de fond et les voix qui se chevauchent peuvent affecter le résultat. La transcription regroupe le texte par intervalles.
