## Comment utiliser le terminal série dans le navigateur

Connectez votre Arduino, ESP32, Raspberry Pi Pico ou adaptateur USB-série avec un câble de données. Réglez le débit en bauds utilisé par le périphérique, par exemple 9600 ou 115200, puis sélectionnez **Connecter** et choisissez son port dans le navigateur. Ce moniteur série utilise 8 bits de données, aucune parité, un bit d’arrêt et aucun contrôle de flux (8N1).

## Envoyer du texte et des octets hexadécimaux

Le texte est envoyé en UTF-8. Choisissez LF, CR ou CR + LF si votre périphérique utilise une fin de ligne pour valider les commandes. Pour les commandes binaires, sélectionnez **Hexadécimal** et saisissez des octets complets comme `41 54 0D 0A`. Le mode hexadécimal envoie les octets tels que saisis, sans ajouter de fin de ligne automatique.

## Lire et enregistrer les journaux série

Le journal affiche les données reçues (RX) et envoyées (TX) avec leur horodatage. Passez en mode hexadécimal pour examiner les octets individuellement si le texte semble illisible. Suspendez le défilement pour examiner une entrée précédente pendant que les données continuent d’arriver, ou téléchargez le journal conservé sous forme de fichier texte. Les données série restent dans cet onglet jusqu’à ce que vous choisissiez de les enregistrer.

## Pourquoi ne puis-je pas connecter mon périphérique ?

Utilisez un navigateur à jour compatible avec Web Serial et vérifiez que le système d’exploitation reconnaît le port série. Essayez un autre câble et fermez tout autre moniteur série qui utilise déjà le port. Si le périphérique se connecte mais produit du texte illisible, vérifiez le débit en bauds et essayez d’afficher les octets en mode hexadécimal.
