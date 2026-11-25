## Ouvrir une archive web WARC

Sélectionne ou dépose un fichier `.warc` ou `.warc.gz`, ou essaie l’archive d’exemple. La visionneuse dresse la liste des enregistrements et ouvre la première page HTML archivée qu’elle trouve. Filtre par URL ou type d’enregistrement pour retrouver une capture, puis passe de l’aperçu de la page aux détails de l’enregistrement. L’indexation d’une archive volumineuse peut prendre du temps. Le fichier reste dans ton navigateur.

## Consulter les dates de capture et les en-têtes

Un fichier Web ARChive (WARC) stocke les enregistrements recueillis par un robot d’exploration ou un outil d’archivage lorsqu’il visite un site web. Plusieurs enregistrements peuvent correspondre à la même URL. Pour les distinguer, consulte la date de capture en UTC et le statut HTTP d’origine. Un enregistrement de réponse contient ce que le serveur a renvoyé. Un enregistrement de requête indique ce que le robot a envoyé. Un enregistrement de revisite peut renvoyer à une autre capture sans stocker une nouvelle copie de la page. Tu peux consulter ces enregistrements même lorsqu’aucun aperçu de la page n’est disponible.

## Que contient l’aperçu ?

L’aperçu statique utilise le HTML ainsi que les images et les feuilles de style compatibles stockées dans la même archive. Les ressources manquantes peuvent modifier la mise en page ou laisser des zones vides. Les scripts sont désactivés et l’aperçu n’envoie aucune requête au site d’origine, ce qui rend indisponibles les fonctions interactives telles que la connexion et la lecture vidéo. La visionneuse prend en charge WARC 1.0 et 1.1, y compris les enregistrements compressés avec gzip.

[Spécification du format WARC](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)
