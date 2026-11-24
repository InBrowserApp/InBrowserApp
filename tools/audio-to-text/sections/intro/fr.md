## Comment transcrire un enregistrement audio

Déposez l’enregistrement d’une réunion, d’un entretien, d’un cours, d’un podcast ou d’un mémo vocal. Gardez la détection automatique ou indiquez la langue parlée si vous la connaissez. Choisissez un modèle de transcription et sélectionnez **Transcrire l’audio**. Une fois le texte prêt, sélectionnez un horodatage pour écouter le passage correspondant. Vous pouvez corriger les noms, la ponctuation et les mots mal reconnus avant de copier ou de télécharger le texte.

L’outil lit les formats audio que votre navigateur sait décoder, notamment les formats MP3, WAV, M4A, FLAC, OGG et WebM courants. La prise en charge des codecs varie d’un navigateur à l’autre. Si un fichier ne s’ouvre pas, essayez de l’exporter en WAV ou en MP3 depuis votre application d’enregistrement.

## Quel modèle de transcription choisir ?

Utilisez **Whisper Base** pour un enregistrement clair ou une première transcription. **Whisper Small** peut aider avec les accents et les conversations. **Whisper Large V3 Turbo** convient aux enregistrements bruités ou difficiles, mais nécessite un téléchargement plus volumineux et davantage de mémoire. Les modèles Whisper transcrivent plusieurs langues dans leur langue d’origine. **SenseVoiceSmall** prend en charge le mandarin, le cantonais, l’anglais, le japonais et le coréen. **Qwen3-ASR 0.6B** propose du texte sans horodatage ou un alignement pour la lecture et les sous-titres ; cet alignement télécharge un modèle supplémentaire. Le texte sans horodatage peut être exporté en TXT. La reconnaissance Qwen utilise WebGPU si disponible et sinon le processeur ; l’alignement des horodatages utilise le processeur.

Whisper utilise WebGPU si le navigateur et le matériel graphique le prennent en charge. Au premier lancement, l’outil télécharge le modèle sélectionné. Le navigateur peut réutiliser les fichiers de modèle conservés dans son cache. Le volume téléchargé et la durée du traitement dépendent du modèle et de l’appareil. L’audio est décodé et transcrit sur votre appareil. Le téléchargement du modèle est indépendant de votre enregistrement. **SenseVoiceSmall (CPU)** est optimisé pour le cantonais et fonctionne localement via WebAssembly. **SenseVoiceSmall (WebGPU)** utilise une quantification différente du modèle d’origine et passe à la version pour processeur si nécessaire. Si WebGPU est indisponible, Whisper utilise le processeur via WebAssembly.

## Exporter une transcription horodatée ou des sous-titres

- **TXT** indique l’heure de début de chaque passage dans l’enregistrement. Par exemple, `[00:02:15.320] Passons en revue l’ordre du jour.` correspond à une phrase prononcée un peu plus de deux minutes après le début. Ce format convient aux notes de réunion, aux citations d’entretiens et aux recherches dans le texte.
- **SRT (SubRip)** associe un début et une fin à chaque sous-titre numéroté. De nombreux logiciels de montage acceptent ce format.
- **VTT (WebVTT)** indique aussi le début et la fin de chaque sous-titre et fonctionne avec les lecteurs vidéo HTML qui acceptent les pistes de sous-titres.

L’outil estime le début et la fin de chaque passage. Réécoutez les citations importantes et vérifiez la synchronisation des sous-titres avant de les partager. Les bruits de fond et les voix qui se chevauchent peuvent affecter le résultat. La transcription regroupe le texte par intervalles.
