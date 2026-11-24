Un lien magnet identifie un torrent BitTorrent grâce à son info hash. Il peut aussi contenir un nom d’affichage, des adresses de trackers, des sources web ou une source de métadonnées. Pour connaître les noms et les tailles des fichiers, le client doit récupérer les métadonnées du torrent.

## Comment inspecter un lien magnet

Collez un lien `magnet:?` et lancez la recherche de métadonnées. La visionneuse affiche l’info hash, ainsi que le nom et les adresses des trackers s’ils figurent dans le lien. Une fois les métadonnées récupérées par WebTorrent, la visionneuse affiche le nom du torrent, les chemins et tailles des fichiers, la taille totale et les informations sur les morceaux. Vous pouvez filtrer la liste des fichiers et copier l’info hash.

## Pourquoi la recherche échoue pour certains liens magnet

Dans un navigateur, WebTorrent a besoin de pairs joignables compatibles avec WebRTC, généralement trouvés via un tracker WebSocket. Certains liens magnet indiquent aussi une source de métadonnées HTTPS accessible au navigateur. Un lien qui fonctionne dans un client BitTorrent installé sur votre ordinateur peut donc rester sans résultat ici. Si vous avez le fichier `.torrent`, ouvrez-le dans la visionneuse de fichiers torrent pour le lire immédiatement.

## Quelles connexions la recherche établit-elle ?

La recherche s’effectue dans votre navigateur. WebTorrent peut contacter les trackers, les pairs ou une source de métadonnées pour le torrent demandé. Ces services peuvent voir votre adresse IP et le torrent recherché. La visionneuse récupère uniquement les métadonnées. Les liens magnet doivent contenir un info hash BitTorrent v1 (`btih`), y compris lorsqu’ils identifient aussi un torrent v2.
