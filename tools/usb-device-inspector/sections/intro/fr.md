## Comment examiner un périphérique USB dans le navigateur

Connectez le périphérique avec un câble qui transporte des données, puis choisissez **Sélectionner un périphérique** et sélectionnez-le dans la boîte de dialogue WebUSB du navigateur. La fiche du périphérique affiche l’identifiant du fabricant (VID), l’identifiant du produit (PID) et les informations d’identification disponibles. La version USB provient du descripteur du périphérique. La vitesse réelle de la liaison dépend aussi du câble, du port et du système d’exploitation.

## Comment lire les configurations, interfaces et points de terminaison

Développez une configuration pour voir les fonctions proposées par ses interfaces. Une interface peut avoir plusieurs paramètres alternatifs, chacun avec sa classe, sa sous-classe, son protocole et ses points de terminaison. Les points de terminaison IN transportent les données vers l’hôte et les points de terminaison OUT vers le périphérique. Le type de point de terminaison et la taille de paquet décrivent comment il transfère les données.

## Que m’indique la vérification de l’accès ?

Sélectionnez **Vérifier l’accès** pour savoir si le navigateur peut ouvrir le périphérique sélectionné. La vérification utilise le handle du périphérique, puis le libère. L’accès aux interfaces peut toutefois dépendre du pilote du système d’exploitation ou d’une autre application. L’inspecteur lit les descripteurs fournis par le navigateur et ne modifie pas les paramètres du périphérique.

## Pourquoi ne puis-je pas voir ou ouvrir mon périphérique USB ?

Si votre périphérique n’apparaît pas dans le sélecteur, essayez un câble de données et vérifiez que le système d’exploitation le reconnaît. Si le navigateur refuse l’accès, vérifiez l’autorisation USB du site ou la politique du navigateur. Si la sélection réussit mais que l’ouverture échoue, fermez les applications susceptibles d’utiliser le périphérique et vérifiez les pilotes requis pour votre périphérique et votre système. Certaines classes USB sont protégées par le navigateur. Consultez [Informations sur l’appareil](../device-information/) pour connaître les capacités de ce navigateur et de ce système.
