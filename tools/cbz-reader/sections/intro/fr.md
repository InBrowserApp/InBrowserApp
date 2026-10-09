## Lire une BD dans votre navigateur

Ouvrez une archive de BD `.cbz` locale ou déposez-la dans le lecteur. Commencez à la première image lisible, tournez les pages, accédez à un numéro de page ou parcourez le volet repliable de miniatures. La lecture concentrée laisse plus de place aux illustrations. Le mode page entière affiche toute l’image, y compris les doubles pages larges ; le mode pleine largeur et le zoom permettent d’examiner le lettrage et les illustrations en haute résolution.

## Ordre des pages et sens de lecture

Les pages sont triées naturellement selon les chemins complets de leurs dossiers et fichiers : `chapter2/page2.jpg` précède `chapter2/page10.jpg`, puis vient `chapter10/page1.jpg`. Le tri utilise une comparaison numérique fixe en anglais ; en cas d’égalité, le chemin exact puis la position dans l’archive départagent les entrées. Les fichiers cachés, les dossiers `__MACOSX` et les métadonnées sans rapport sont ignorés. ComicInfo et les autres métadonnées ne modifient jamais cet ordre. Les images illisibles conservent leur numéro de page, afin qu’une illustration manquante ne raccourcisse pas silencieusement le livre.

Choisissez la lecture de gauche à droite ou de droite à gauche indépendamment de la langue du site. Activez la zone de lecture pour utiliser les flèches gauche et droite dans ce sens. Les touches Page suivante et Page précédente permettent toujours d’avancer et de reculer ; Début et Fin mènent à la première et à la dernière page. Les boutons Précédente et Suivante désignent toujours les pages de numéro précédent et suivant.

## Images prises en charge et compatibilité

Les pages JPEG, PNG, GIF, WebP et BMP sont prises en charge ; la prise en charge d’AVIF dépend du décodeur du navigateur. Les formats animés utilisent l’affichage normal des images du navigateur. Les entrées TIFF, HEIC, JPEG XL, PSD et les autres formats d’image non pris en charge restent visibles comme pages illisibles. Les images SVG ne sont volontairement pas affichées. Les fichiers sans extension d’image reconnue sont ignorés. Les formats CBR, RAR et les autres familles d’archives ne sont pas pris en charge.

Les entrées protégées par mot de passe ne peuvent pas être ouvertes. Une image endommagée n’empêche pas de lire les autres pages si le répertoire ZIP est lisible. Un répertoire ZIP endommagé peut empêcher l’ouverture de toute la BD. Le lecteur vérifie le décodage des images à l’ouverture des pages et des miniatures ; d’autres problèmes peuvent donc apparaître au fil de la lecture.

## Confidentialité et ressources du navigateur

L’archive est lue localement. Le contenu de la BD n’est pas envoyé à un serveur, aucun script n’est exécuté et aucune ressource distante du document n’est téléchargée. Fermer ou remplacer la BD libère les URL de ses images. Aucune BD ni position de lecture n’est enregistrée automatiquement.

Aucune limite de taille de fichier ou de nombre de pages n’est imposée. Les données des images sont extraites à la demande, et le volet de miniatures affiche un groupe de pages qui se déplace pour faciliter la navigation dans les longues BD. Les archives ou images très volumineuses peuvent néanmoins épuiser la mémoire du navigateur ou ses ressources de décodage. Fermez d’autres onglets ou utilisez un appareil doté de plus de mémoire en cas d’erreur de ressources.
