## À propos du convertisseur de sous-titres

Convertissez des fichiers de sous-titres existants entre 19 formats de texte synchronisé, ou exportez une transcription en texte brut. Vous pouvez notamment convertir un fichier SRT en VTT pour une vidéo web, transformer les dialogues ASS ou SSA en SRT, préparer des sous-titres pour une plateforme vidéo ou regrouper plusieurs épisodes convertis dans un fichier ZIP. La conversion s’effectue dans votre navigateur ; les fichiers de sous-titres et le contenu collé ne sont pas envoyés en ligne.

L’outil traite le texte des sous-titres et leurs temps d’affichage. Choisissez des fichiers ou collez des sous-titres, sélectionnez un format de sortie et examinez le résultat dans l’aperçu avant de le télécharger. Vous pouvez modifier le texte collé et le convertir à nouveau sans modifier le fichier d’origine sur votre appareil.

## Comment convertir des sous-titres

1. Sélectionnez **Choisir des fichiers** pour ouvrir un ou plusieurs fichiers de sous-titres, faites glisser des fichiers sur le panneau de saisie ou collez le texte des sous-titres dans l’éditeur. **Essayer un exemple** charge un court exemple SRT contenant deux sous-titres.
2. Pour une utilisation courante, laissez **Format d’entrée** sur **Détection automatique**. La détection examine le contenu au lieu de se fier uniquement au nom du fichier. Sélectionnez vous-même le format source si un fichier est ambigu.
3. Choisissez un **Format de sortie**. Pour une piste de sous-titres destinée à un site web classique, choisissez WebVTT ; pour un lecteur ou un éditeur qui demande un fichier SRT, choisissez SubRip.
4. Ouvrez **Paramètres de conversion** si vous avez besoin d’un autre encodage de fichier, d’une fréquence d’images ou d’un décalage temporel. Modifiez ces paramètres avant de lancer la conversion.
5. Sélectionnez **Convertir les sous-titres**. Le résultat indique les formats source et de sortie, le nom du fichier de sortie et le nombre de sous-titres convertis.
6. Passez d’**Aperçu** à **Contenu du fichier**, puis copiez le texte converti ou téléchargez le fichier. Le tableau affiche jusqu’à 100 sous-titres ; le contenu du fichier et les téléchargements comprennent le résultat complet.

**Effacer** supprime de la page les données saisies et les résultats actuels. Le choix d’un nouveau groupe de fichiers remplace la sélection précédente. Le convertisseur ne conserve aucun historique des sous-titres ; téléchargez donc les résultats que vous souhaitez garder.

## Formats pris en charge et précision de sortie

Tous les formats ci-dessous peuvent être lus et écrits, sauf TXT, qui permet d’exporter des transcriptions lisibles. Les formats enregistrent les temps de différentes façons ; choisir un format moins précis arrondit les horodatages aux unités qu’il prend en charge.

| Format                                         | Extension | Précision temporelle en sortie                |
| ---------------------------------------------- | --------- | --------------------------------------------- |
| SubRip                                         | `.srt`    | Millisecondes                                 |
| WebVTT                                         | `.vtt`    | Millisecondes                                 |
| Advanced SubStation Alpha                      | `.ass`    | Centièmes de seconde                          |
| SubStation Alpha                               | `.ssa`    | Centièmes de seconde                          |
| YouTube SubViewer                              | `.sbv`    | Millisecondes                                 |
| MicroDVD                                       | `.sub`    | Images vidéo                                  |
| SubViewer 2.0                                  | `.sub`    | Centièmes de seconde                          |
| SAMI                                           | `.smi`    | Millisecondes                                 |
| Paroles LRC                                    | `.lrc`    | Centièmes de seconde pour les débuts          |
| Timed Text                                     | `.ttml`   | Millisecondes                                 |
| Distribution Format Exchange Profile           | `.dfxp`   | Millisecondes                                 |
| YouTube SRV3                                   | `.srv3`   | Millisecondes                                 |
| Transcription YouTube XML                      | `.xml`    | Secondes avec une précision à la milliseconde |
| MPL2                                           | `.mpl`    | Dixièmes de seconde                           |
| Spruce Subtitle, format texte                  | `.stl`    | Images vidéo                                  |
| QuickTime Text                                 | `.qt.txt` | Millisecondes                                 |
| JSON                                           | `.json`   | Valeurs numériques en millisecondes           |
| CSV                                            | `.csv`    | Valeurs numériques en millisecondes           |
| TSV                                            | `.tsv`    | Valeurs numériques en millisecondes           |
| Transcription en texte brut, export uniquement | `.txt`    | Aucun horodatage                              |

L’entrée TTML accepte aussi les fichiers iTT compatibles. DFXP appartient à la famille TTML. L’export TTML ne recrée pas tous les profils, règles de mise en page ou styles propres à chaque plateforme.

L’extension `.sub` peut désigner ici MicroDVD ou SubViewer, tous deux au format texte. VobSub binaire est un format différent. De même, le format `.stl` pris en charge est Spruce STL au format texte, et non EBU STL binaire. Choisissez le format par son nom complet lorsque ces extensions sont ambiguës.

## Choisir entre SRT, VTT, ASS et le texte brut

**SRT** est un choix utile lorsqu’un lecteur vidéo, un éditeur ou un formulaire d’envoi demande des sous-titres SubRip. **VTT** est le format utilisé par les pistes de texte des vidéos HTML et peut aussi contenir des paramètres d’affichage propres au web. La conversion entre ces formats conserve le texte des sous-titres et leurs temps à la milliseconde tout en reconstruisant la syntaxe du fichier.

Un sous-titre SRT numéroté utilise une virgule avant les millisecondes :

```text
1
00:00:01,250 --> 00:00:03,500
Hello, world!
```

Le même sous-titre au format WebVTT comporte un en-tête de fichier et des horodatages avec un point décimal :

```text
WEBVTT

00:00:01.250 --> 00:00:03.500
Hello, world!
```

**ASS et SSA** sont des formats d’échange utiles lorsque l’application suivante les exige. La mise en forme prise en charge — gras, italique et soulignement — peut être conservée entre les formats capables de la représenter. Les polices, le positionnement à l’écran, les commandes de dessin, les animations de karaoké et les autres fonctions de présentation avancées sont simplifiés ; les événements graphiques ASS sans dialogue lisible sont ignorés. Le convertisseur privilégie des sous-titres lisibles plutôt que la reproduction d’une animation ou d’une mise en page élaborée.

**TXT** extrait les dialogues lisibles sans horodatage ni style. Son aperçu affiche le texte exporté au lieu d’un tableau des temps. L’export TXT n’invente pas de temps d’affichage, ne transcrit pas la parole et ne traduit pas la langue parlée.

## Encodage des fichiers et lisibilité du texte

Le décodage automatique utilise UTF-8, ou UTF-16 lorsqu’une marque d’ordre des octets l’identifie. Pour les fichiers plus anciens, choisissez l’encodage d’origine si les caractères s’affichent mal ou si le fichier ne peut pas être décodé. Les choix disponibles comprennent Windows-1252, Windows-1251, GB18030, Big5, Shift_JIS et EUC-KR, ainsi que des options explicites UTF-8 et UTF-16.

Par exemple, essayez GB18030 pour des sous-titres chinois dont vous savez qu’ils ont été enregistrés avec cet encodage, ou Shift_JIS pour un fichier japonais provenant d’une application ancienne. L’encodage modifie la façon dont les octets existants sont lus ; il ne traduit pas leur sens. Relancez la conversion après avoir sélectionné un autre encodage. Les fichiers de sous-titres téléchargés utilisent UTF-8, quel que soit l’encodage d’entrée.

## Ajuster les temps et la fréquence d’images

### Avancer ou retarder tous les sous-titres

Le décalage temporel se mesure en millisecondes. Une valeur de `1500` retarde chaque sous-titre de 1.5 seconde ; `-500` les affiche une demi-seconde plus tôt. Pour un sous-titre commençant à `00:00:01.250`, ces paramètres donnent respectivement `00:00:02.750` et `00:00:00.750`.

Un décalage déplace à la fois le début et la fin, en conservant la durée jusqu’à ce qu’il atteigne le début de la chronologie. Les sous-titres décalés entièrement avant zéro sont supprimés ; un sous-titre qui chevauche partiellement zéro commence à zéro. Un décalage corrige un retard constant. Il ne corrige pas une piste de sous-titres dont la désynchronisation évolue au fil de la vidéo.

### Utiliser la fréquence d’images pour les horodatages en images

MicroDVD et Spruce STL utilisent des images vidéo ; leur fréquence d’images détermine donc la correspondance entre les images et le temps écoulé. TTML peut aussi contenir des temps exprimés en images. Utilisez la fréquence d’images de la vidéo source, par exemple `23.976`, `24`, `25` ou `29.97`, lorsqu’elle est nécessaire pour interpréter l’entrée.

Une fréquence d’images intégrée au fichier d’entrée est prioritaire lorsque le format en fournit une. Pour une sortie dont les temps sont exprimés en images, le paramètre choisi détermine la fréquence d’images écrite. Modifier ce paramètre ne recalcule pas les horodatages horaires ordinaires des fichiers SRT ou VTT ; il modifie la façon dont les horodatages en images sont interprétés ou écrits.

### Comprendre les arrondis et les temps de fin manquants

SRT et VTT conservent une précision à la milliseconde. ASS, SSA, SubViewer et LRC arrondissent aux centièmes ; MPL2 arrondit aux dixièmes ; les sorties exprimées en images arrondissent à l’image. Un sous-titre très court conserve une durée positive après arrondi. L’aperçu reflète les temps du format exporté, au lieu d’afficher les horodatages d’entrée non arrondis.

LRC peut fournir des débuts sans fins. Les fins manquantes correspondent au début distinct suivant, ou à deux secondes pour le dernier sous-titre. L’export LRC ne peut pas conserver les intervalles vides d’origine ni les temps de fin qui se chevauchent, et les sous-titres sur plusieurs lignes deviennent des lignes de paroles uniques. QuickTime Text utilise des repères temporels ; SAMI et QuickTime peuvent reconstruire les sous-titres qui se chevauchent sous forme de texte combiné à chaque limite temporelle, de sorte que le résultat peut contenir un nombre différent de segments de sous-titres.

## Conversion par lots et téléchargements ZIP

Choisissez ou déposez plusieurs fichiers pour les convertir avec le même format de sortie et les mêmes paramètres. Sélectionnez un résultat dans le menu des noms de fichiers pour l’examiner. Chaque fichier qui ne peut pas être converti conserve son propre message d’erreur, tandis que les résultats réussis restent disponibles pour un téléchargement individuel.

Lorsqu’au moins deux fichiers sont convertis avec succès, **Tout télécharger en ZIP** rassemble ces résultats. L’archive ne contient que les conversions réussies. Consultez les erreurs affichées, ajustez le format d’entrée ou l’encodage si nécessaire, puis relancez la conversion pour les fichiers restants.

Les noms des fichiers de sortie conservent le nom de base du fichier source et utilisent l’extension choisie : `episode01.srt` devient par exemple `episode01.vtt`. Si plusieurs résultats devaient porter le même nom, un suffixe tel que ` (2)` permet de distinguer leurs entrées dans le ZIP. ZIP est ici une option de téléchargement ; sélectionnez les fichiers de sous-titres eux-mêmes en entrée.

## Échange de données JSON, CSV et TSV

JSON utilise un tableau d’objets de sous-titres avec des valeurs `start` et `end` en millisecondes et une chaîne `text` :

```json
[
  { "start": 1250, "end": 3500, "text": "Hello, world!" },
  { "start": 4000, "end": 6000, "text": "Another caption." }
]
```

L’outil accepte aussi le JSON de type Whisper contenant un tableau `segments`, où les valeurs `start` et `end` des segments sont en secondes. Il s’agit d’une convention d’entrée distincte ; l’export JSON standard continue d’utiliser les millisecondes.

CSV et TSV utilisent les noms de colonnes `start`, `end` et `text`. Les temps en entrée peuvent être des valeurs numériques en millisecondes ou des horodatages horaires. CSV place entre guillemets les champs contenant des virgules, des guillemets ou des sauts de ligne ; TSV utilise des tabulations entre les colonnes. Les deux exports écrivent des valeurs numériques en millisecondes. Utilisez ces formats pour transférer des sous-titres vers un tableur ou un autre processus de traitement des sous-titres.

## Questions fréquentes

### Pourquoi l’aperçu et le texte téléchargé sont-ils différents ?

Le tableau d’aperçu affiche le texte lisible des sous-titres et les temps du format cible. Le contenu du fichier montre le fichier tel qu’il est sérialisé, y compris les en-têtes, la numérotation, les délimiteurs et la syntaxe de mise en forme prise en charge. Les téléchargements contiennent l’intégralité de ce contenu sérialisé, même lorsque le tableau s’arrête aux 100 premiers sous-titres.

### Pourquoi les styles ou le positionnement ont-ils changé ?

Les formats ne partagent pas le même modèle de style. La mise en forme de base prise en charge est conservée lorsqu’elle peut être représentée ; les styles avancés, le positionnement des sous-titres web, les animations et les métadonnées des plateformes ne sont pas intégralement reproduits. Utilisez la vue du contenu du fichier pour examiner l’export et testez-le dans le lecteur ou l’éditeur où vous comptez l’utiliser.

### L’outil peut-il extraire des sous-titres d’une vidéo ou d’une piste d’images ?

Partez d’un fichier de sous-titres textuel existant. Extrayez d’abord les pistes de sous-titres intégrées à la vidéo. Les pistes PGS/SUP et VobSub/IDX sous forme d’images nécessitent une reconnaissance de texte (OCR) pour devenir du texte ; EBU STL binaire nécessite un éditeur de sous-titres capable de lire ce format.

### Où consulter les spécifications des formats ?

Consultez la [spécification WebVTT](https://www.w3.org/TR/webvtt1/), la [spécification TTML](https://www.w3.org/TR/ttml2/) et les [formats de sous-titres pris en charge par YouTube](https://support.google.com/youtube/answer/2734698) pour connaître leur syntaxe de fichier et les exigences des plateformes.
