## Qu’est-ce qu’un sous-ensemble de police ?

Un sous-ensemble de police contient les caractères nécessaires à un texte donné,
ainsi que les glyphes complémentaires indispensables à leur rendu. Supprimer
les glyphes inutilisés peut réduire considérablement le poids des polices à
télécharger, notamment pour les grandes polices chinoises, japonaises ou coréennes,
ou pour un titre fixe, un logo ou une page de campagne.

## Comment utiliser cet outil

Choisissez un fichier TTF, OTF, WOFF ou WOFF2 et collez tout le texte qui l’utilisera.
Choisissez WOFF2 pour le web ou TTF / OTF pour une police non compressée, puis
générez le sous-ensemble. Comparez les tailles, vérifiez l’aperçu et téléchargez
la police ainsi que le CSS correspondant. Le traitement s’effectue localement
dans un Web Worker.

## Qu’est-ce qui est conservé ?

HarfBuzz conserve les dépendances entre glyphes et les fonctions de mise en page
OpenType nécessaires aux ligatures, au crénage, aux signes combinatoires et aux
écritures complexes. Le hinting et les axes des polices variables sont conservés.
Les formes composées et décomposées canoniquement équivalentes du texte sont
incluses lorsque la police source les prend en charge. L’aperçu utilise la police
générée et les caractères absents de la source sont indiqués séparément.

## Conseils pratiques

- Incluez les espaces, la ponctuation, les chiffres et toutes les chaînes traduites
  nécessaires. Ajoutez le jeu latin prédéfini si votre texte contiendra aussi des
  caractères latins de base.
- Régénérez le sous-ensemble chaque fois que votre texte change. Un sous-ensemble
  fixe convient surtout à un contenu connu ; prévoyez une couverture plus large
  pour le texte saisi par les utilisateurs.
- Le sous-ensemble ne peut pas ajouter les caractères absents de la police
  d’origine. Conservez une police de secours CSS pour les caractères qu’il ne couvre pas.
- Utilisez une police dont la licence autorise la modification et l’intégration
  sur le web. Les collections de polices (`.ttc` / `.otc`) doivent d’abord être
  exportées en polices individuelles.
- Les petites polices ou celles déjà réduites à un sous-ensemble ne deviennent
  pas toujours plus légères. WOFF2 offre généralement le téléchargement le plus
  léger pour le web ; le nombre de glyphes inclut aussi les glyphes complémentaires.
