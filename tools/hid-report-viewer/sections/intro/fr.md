## Comment connecter un périphérique HID dans le navigateur

Connectez un périphérique d’interface humaine compatible, comme une manette de jeu, un joystick, une pédale ou un clavier de macros. Sélectionnez **Connecter un périphérique**, puis choisissez-le dans le sélecteur WebHID. La visionneuse affiche l’identifiant du fabricant (VID) et celui du produit (PID), qui aident à identifier le matériel. Utilisez un navigateur de bureau compatible via HTTPS.

## Comment lire les collections HID et les identifiants de rapport

Ouvrez une collection pour voir sa page d’utilisation, son utilisation et ses identifiants de rapport. La page d’utilisation regroupe des fonctions apparentées, tandis que l’utilisation identifie une fonction au sein de ce groupe. Les rapports d’entrée transportent les données du périphérique, les rapports de sortie décrivent les données qu’un hôte peut envoyer et les rapports de fonctionnalités décrivent des paramètres ou l’état propres au périphérique. Un identifiant de rapport égal à 0 signifie que l’interface n’utilise pas d’identifiant de rapport explicite.

## Comment examiner les octets d’entrée qui changent

Actionnez une commande à la fois en observant les rapports en hexadécimal en direct. Les octets mis en évidence diffèrent des données utiles précédentes pour le même identifiant de rapport. L’identifiant du rapport est affiché séparément des données utiles. Suspendez la capture pour examiner les derniers rapports, ou effacez la liste pour recommencer. Consultez le format de rapport du périphérique pour interpréter les boutons, les axes et les autres champs.

## Pourquoi mon périphérique ou une collection n’apparaît-il pas ?

Vérifiez que le système d’exploitation reconnaît le périphérique, puis rouvrez le sélecteur. Les navigateurs protègent les collections courantes de claviers et de souris, et certains périphériques ne rendent qu’une partie de leurs rapports accessibles sur le Web. Cette visionneuse reçoit les rapports d’entrée du périphérique sélectionné et conserve les données dans cet onglet. Pour les commandes standard, essayez le [Testeur de manette](../gamepad-tester/) ou le [Testeur de clavier](../keyboard-tester/).
