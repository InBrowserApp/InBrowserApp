## Lire du texte et des journaux en local

Ouvrez un fichier .txt, .text ou .log pour le lire avec des numéros de ligne, une taille de texte réglable, un retour à la ligne facultatif et une lecture concentrée. Allez à une ligne, au début ou à la fin, ou utilisez Rechercher du texte pour parcourir tout le fichier. La recherche est littérale et sensible à la casse ; les résultats suivants et précédents parcourent le fichier en boucle.

## Fichiers volumineux et longues lignes

La visionneuse affiche une section à la fois pour faciliter la consultation des fichiers volumineux. Toutes les sections restent accessibles, y compris la suite des très longues lignes. La sélection et la commande de recherche du navigateur couvrent la section actuelle ; la fonction Rechercher du texte de la visionneuse parcourt tout le fichier décodé, y compris les résultats à cheval sur plusieurs sections. Aucune limite de taille de fichier ou de nombre de lignes n’est imposée. La mémoire disponible dans le navigateur constitue toutefois une limite pratique.

Les lignes vides, les tabulations, les fins de ligne mixtes CRLF/CR/LF et le texte Unicode sont préservés. Les fins de ligne sont affichées comme des sauts de ligne. Le balisage et les séquences d’échappement du terminal restent du texte inactif. Certains caractères de contrôle n’ont pas de glyphe visible ; les fichiers contenant des caractères NUL affichent un avertissement de fichier binaire.

## Choisir le bon encodage

Le mode automatique reconnaît les marques d’ordre des octets UTF-8 et UTF-16 et utilise sinon un décodage UTF-8 strict. Vous pouvez choisir UTF-8, UTF-16 LE/BE, Windows-1252, Windows-1251, GB18030 ou Shift JIS. Une erreur de décodage interrompt l’aperçu au lieu de remplacer silencieusement les caractères illisibles. Essayez un autre encodage si le fichier est illisible ou si les caractères semblent incorrects ; la visionneuse ne peut pas déterminer l’encodage d’origine de tous les fichiers.

Les fichiers sont traités sur votre appareil sans envoi, ressources distantes ni stockage automatique. Fermer ou remplacer un fichier libère sa session de lecture. Cette visionneuse ne modifie pas les fichiers, n’interprète ni le HTML ni les commandes de terminal et ne suit pas les journaux en direct.
