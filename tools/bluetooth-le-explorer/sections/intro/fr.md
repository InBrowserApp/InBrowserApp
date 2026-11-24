## Comment se connecter à un appareil Bluetooth Low Energy

Activez le Bluetooth et placez l’appareil dans un mode permettant la connexion. Sélectionnez **Connecter un appareil**, puis choisissez votre périphérique dans le navigateur. Cet explorateur demande l’accès à des services GATT courants comme Battery Service, Device Information, Heart Rate et Environmental Sensing. Pour un service GATT personnalisé, saisissez son UUID avant d’ouvrir le sélecteur. Utilisez un UUID de 16 bits comme `180F` ou un UUID complet de 128 bits fourni dans la documentation de l’appareil.

## Comment lire les caractéristiques GATT

Développez un service pour voir ses caractéristiques et les opérations qu’elles prennent en charge. Sélectionnez **Lire** pour demander la valeur actuelle. Le mode hexadécimal affiche les octets exactement tels qu’ils ont été reçus, tandis que le mode UTF-8 est utile pour les caractéristiques contenant du texte. Un niveau de batterie, une mesure ou une autre valeur binaire peut nécessiter une interprétation à l’aide de la spécification de la caractéristique concernée.

## Comment capturer les notifications Bluetooth

Sélectionnez **S’abonner** sur une caractéristique prenant en charge les notifications ou les indications. Les mises à jour apparaissent avec leur heure et l’UUID de la caractéristique. Téléchargez les 100 dernières notifications au format JSON pour les examiner plus tard, ou sélectionnez **Se désabonner** pour arrêter ce flux. La page conserve le journal localement.

## Pourquoi ne vois-je pas mon appareil ou ses services ?

La prise en charge de Web Bluetooth dépend du navigateur et du système d’exploitation. Utilisez un navigateur compatible via HTTPS, gardez l’appareil à proximité et déconnectez-le des autres applications s’il ne permet qu’une seule connexion. Le navigateur donne accès aux services GATT autorisés des périphériques Bluetooth LE. Les appareils Bluetooth Classic, comme les écouteurs qui ne proposent que des profils audio, nécessitent une autre interface.
