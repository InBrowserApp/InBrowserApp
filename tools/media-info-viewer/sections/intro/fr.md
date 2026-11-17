## Ce que montre cette visionneuse

La Visionneuse d’informations multimédias lit les métadonnées techniques des
fichiers audio et vidéo locaux, notamment MP4, MOV, MKV, WebM, AVI, MP3, FLAC et
WAV. Utilisez-la pour vérifier les caractéristiques d’un export, consulter les
étiquettes de langue des pistes audio d’un film ou recueillir un rapport technique
pour résoudre un problème. L’analyse démarre dès que vous choisissez ou déposez
un fichier.

## Informations sur le fichier et les pistes vidéo, audio et de sous-titres

- **Vue d’ensemble du fichier :** format réel du conteneur, taille du fichier,
  durée, débit global, titre et application d’encodage, lorsque ces informations
  sont disponibles.
- **Pistes vidéo :** codec, profil et débit, résolution, fréquence d’images et
  mode de fréquence d’images, rapport largeur/hauteur, rotation, profondeur de
  bits, espace colorimétrique, sous-échantillonnage de chrominance et format HDR.
- **Pistes audio :** codec, débit, langue, titre de la piste, nombre et disposition
  des canaux, fréquence d’échantillonnage, profondeur de bits et indicateurs de
  piste par défaut ou forcée. Chaque piste audio est répertoriée séparément :
  version originale, doublage et commentaires restent ainsi bien distincts.
- **Pistes de sous-titres :** format, langue, titre, durée et indicateurs de piste
  par défaut ou forcée, lorsqu’ils sont présents dans le fichier.

Les principales caractéristiques sont immédiatement visibles. Ouvrez **Détails
techniques** dans une piste pour afficher des champs supplémentaires, ou
sélectionnez un lien indiquant le nombre de pistes pour accéder à la première
piste du type correspondant. Les champs disponibles dépendent du format et de
ses métadonnées.

## Comment examiner un fichier

1. Choisissez un fichier audio ou vidéo local, ou faites-le glisser dans la zone
   prévue à cet effet.
2. Consultez le résumé, puis examinez chaque piste vidéo, audio et de sous-titres.
3. Copiez le rapport lisible pour l’inclure dans un message ou un ticket
   d’assistance, ou téléchargez le JSON pour un inventaire de ressources, un
   script ou une analyse approfondie. Les deux incluent les champs techniques
   masqués dans les volets repliés de l’interface.
4. Choisissez **Changer de fichier** pour examiner un autre fichier, ou **Retirer
   le fichier** pour effacer les résultats. Sélectionner un autre fichier ou
   retirer le fichier actuel arrête également toute analyse encore en cours.

## Comprendre les valeurs

- **Le conteneur et le codec décrivent des choses différentes.** MP4 et Matroska
  sont des conteneurs ; AVC/H.264, HEVC/H.265 et AAC décrivent la façon dont les
  flux sont encodés. Un conteneur peut contenir plusieurs pistes audio ou de
  sous-titres.
- **Le débit global concerne l’ensemble du fichier.** Il comprend tous les flux
  et les données supplémentaires du conteneur. Le débit d’une piste s’applique
  uniquement à ce flux. Les débits sont exprimés en kb/s ou Mb/s ; les tailles
  des fichiers en B, KiB, MiB, GiB ou TiB.
- **La durée inclut les millisecondes.** L’affichage utilise `HH:MM:SS.mmm`. La
  fréquence d’images est exprimée en fps, et la fréquence d’échantillonnage audio
  en kHz. CFR indique une fréquence d’images constante ; VFR, une fréquence
  d’images variable.
- **Les indicateurs de piste précisent la sélection prévue.** L’indicateur
  « par défaut » désigne une piste à privilégier ; l’indicateur « forcée » est
  couramment utilisé pour des sous-titres qui doivent apparaître sans sélectionner
  une piste de sous-titres complète. Il s’agit de deux indicateurs distincts lus
  dans le fichier.

Certains conteneurs ne fournissent pas un débit distinct pour chaque flux. Les
valeurs indisponibles restent absentes ou sont indiquées comme non disponibles ;
elles ne sont pas déduites du nom du fichier. Les pochettes intégrées ne sont
pas comptées comme des pistes vidéo.

## Utilisations courantes

Vérifiez la résolution et la fréquence d’images après l’export d’une vidéo,
examinez les canaux et la fréquence d’échantillonnage avant de monter un fichier
audio, repérez les pistes dans différentes langues ou les commentaires, ou
recueillez les détails du codec pour rechercher la cause d’un problème de
lecture. Le rapport permet de partager les caractéristiques utiles sans envoyer
le fichier multimédia.

## Traitement local et export des rapports

L’analyse s’effectue dans votre navigateur : le fichier multimédia n’est pas
envoyé et son contenu n’est pas modifié. L’analyseur lit les segments du fichier
selon les besoins ; il peut donc examiner les métadonnées même lorsque le
navigateur ne peut pas lire le conteneur ou le codec.

**Copier le rapport** produit un résumé lisible au format texte. **Télécharger le
JSON** exporte les métadonnées renvoyées par l’analyseur, accompagnées du nom et
de la taille du fichier. Dans le JSON, `Duration` est exprimé en secondes,
`BitRate` et `OverallBitRate` en bits par seconde, et `SamplingRate` en hertz.
L’interface convertit ces valeurs en unités plus lisibles. L’export conserve
également des champs de métadonnées supplémentaires qui ne figurent pas dans les
fiches des pistes.
