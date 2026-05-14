## Que fait cet outil de caméra ?

Cet outil transforme l'onglet actuel du navigateur en surface de capture locale. Il peut ouvrir la caméra de votre appareil, prendre une photo, enregistrer une courte vidéo lorsque le navigateur prend en charge `MediaRecorder`, afficher un aperçu de la dernière capture et télécharger le fichier.

## Bons cas d'utilisation

- Prendre rapidement une photo de profil ou un instantané de webcam sans ouvrir d'application séparée.
- Enregistrer une courte note visuelle lorsque vous avez besoin d'un extrait jetable local au navigateur.
- Vérifier le comportement des caméras avant et arrière, la prise en charge du zoom ou celle de la torche sur un appareil.

## Confidentialité et limites du navigateur

Le flux multimédia reste dans votre navigateur et n'est pas téléversé par cet outil. La caméra, le microphone, la torche, le zoom, les appareils disponibles et les formats d'enregistrement dépendent toujours du navigateur, du système d'exploitation, du matériel de l'appareil et du fait que la page soit servie depuis un contexte sécurisé comme HTTPS ou localhost.

- L'aperçu, la capture et l'exportation se font localement dans ce navigateur.
- Les photos sont enregistrées au format JPEG. Le format vidéo dépend de ce que le navigateur actuel peut enregistrer, généralement WebM ou MP4.
- Les invites d'accès à la caméra et au microphone sont contrôlées par le navigateur. Cette page ne peut pas contourner les autorisations bloquées.
