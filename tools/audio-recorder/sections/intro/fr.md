## Enregistrer l'audio du navigateur hors ligne

Utilisez l'enregistreur audio pour capturer rapidement une note vocale, un test de microphone, une ébauche de narration ou un échantillon sonore sans quitter le navigateur. L'outil demande l'accès au microphone uniquement lorsque vous démarrez un enregistrement, puis vous permet de mettre en pause, reprendre, arrêter, écouter un aperçu et télécharger le résultat.

## Usages pratiques

Il est utile pour vérifier si un microphone fonctionne, recueillir un rappel parlé, enregistrer un échantillon de prononciation temporaire ou créer un court clip à joindre à un autre flux de travail. Comme l'enregistreur s'exécute côté client, c'est aussi une option pratique lorsque vous ne voulez pas installer d'application audio de bureau pour une simple prise.

## Confidentialité et formats du navigateur

L'enregistrement passe par l'API MediaRecorder du navigateur. L'audio reste local sur la page pendant l'enregistrement et l'aperçu ; InBrowser.App n'envoie pas le flux du microphone. Le type de fichier final dépend de la prise en charge du navigateur : l'un peut télécharger un fichier WebM ou OGG, tandis qu'un autre produit un fichier M4A.

## Conseils pour des enregistrements propres

Utilisez un environnement calme, gardez un niveau d'entrée du microphone raisonnable et faites une courte prise de test avant d'enregistrer quelque chose d'important. Si la page ne peut pas démarrer l'enregistrement, vérifiez que le site est ouvert via HTTPS ou localhost et que l'autorisation du microphone est accordée pour l'onglet actuel du navigateur.
