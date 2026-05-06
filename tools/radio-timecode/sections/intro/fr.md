## Ce que fait Radio Timecode Sync

Radio Timecode Sync génère dans le navigateur un signal audio suivant les formats courants de signaux horaires radio en ondes longues : JJY, BPC, DCF77, MSF et WWVB. Il est utile lorsqu'une horloge radio-pilotée compatible ne peut pas recevoir le véritable émetteur en intérieur, ou lorsque vous voulez tester la réaction d'une horloge à un format de station connu.

## Comment l'utiliser

Sélectionnez la station correspondant à l'horloge, placez le haut-parleur de l'appareil près de la zone d'antenne de l'horloge, démarrez le signal, puis laissez à l'horloge assez de temps pour écouter au moins une trame complète d'une minute. Gardez d'abord le volume bas, puis augmentez-le seulement si l'horloge ne détecte pas le signal.

## Précision et limites

L'heure générée provient de l'horloge système de cet appareil, plus le décalage facultatif ; synchronisez donc l'horloge de l'appareil avant d'utiliser l'outil. Les navigateurs ne peuvent pas émettre directement la véritable porteuse en ondes longues ; cet outil utilise une approximation en onde carrée de fréquence plus basse qui peut fonctionner par harmoniques sur certains appareils. Le matériel, le placement du haut-parleur et le micrologiciel de l'horloge influencent tous les résultats, et l'audio d'indicatif JJY est volontairement omis.
