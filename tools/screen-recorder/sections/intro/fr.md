# Enregistreur d'écran

Enregistrez un écran, une fenêtre ou un onglet sélectionné dans le navigateur
sans téléverser la vidéo vers un serveur. L'outil utilise les API Screen
Capture et MediaRecorder de votre navigateur, ce qui garde l'enregistrement en
local jusqu'à son téléchargement.

## Quand l'utiliser

Utilisez l'enregistreur pour de courtes démos, des rapports de bug, des
présentations guidées, des notes de QA ou de rapides vidéos internes lorsqu'un
flux de travail léger dans le navigateur suffit. Vous pouvez demander au
navigateur d'inclure le son de l'onglet ou du système et, si besoin, d'y mêler
votre microphone avant le démarrage de l'enregistrement.

## Confidentialité et compatibilité des navigateurs

Le navigateur décide quelles sources de capture et quelles options audio sont
disponibles. Certains navigateurs ne partagent l'audio que pour l'onglet actif,
certains exigent HTTPS, et d'autres ne prennent pas en charge la mise en pause
ou l'enregistrement. Si l'autorisation est refusée, aucun flux n'est conservé et
vous pouvez réessayer avec d'autres paramètres.

## Conseils pour des enregistrements fiables

Fermez les sessions de capture sans rapport avant de commencer, choisissez la
plus petite source utile et faites un court essai lorsque l'audio est important.
Téléchargez le résultat avant de l'effacer, car les enregistrements ne sont
conservés que dans la session de page en cours.
