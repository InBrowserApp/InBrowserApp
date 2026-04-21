## Pourquoi on rencontre des Data URI

Les Data URI regroupent un fichier et ses métadonnées dans une seule chaîne, ce qui explique leur présence dans HTML, CSS, SVG, les modèles d’e-mail, les réponses d’API et les exports du navigateur. C’est pratique pour de petites ressources, mais difficile à inspecter quand il ne reste qu’une valeur encodée.

## Ce que ce convertisseur apporte

Collez un `data:` URI complet pour le décoder localement dans votre navigateur. L’outil affiche le type MIME, indique si la charge utile est en Base64 ou encodée pour l’URL, prévisualise le texte, les images, l’audio ou la vidéo quand le navigateur sait les rendre, et suggère un nom de fichier selon le type de média.

## Ce qu’il faut vérifier avant d’enregistrer

Un Data URI valide peut tout de même contenir un mauvais type MIME ou une extension trompeuse. Comparez le panneau de détails avec le résultat attendu, vérifiez l’aperçu lorsqu’il existe, puis renommez le fichier avant téléchargement si vous avez besoin d’un autre nom.
