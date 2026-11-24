Un link magnet usa l'info hash per identificare un torrent. Il link può includere un nome da mostrare, gli indirizzi dei tracker e dei web seed oppure una fonte di metadati. Per vedere i nomi e le dimensioni dei singoli file, il client deve recuperare i metadati del torrent.

## Come esaminare un link magnet

Incolla un link `magnet:?` e seleziona «Cerca i metadati». Il visualizzatore mostra l'info hash e, se presenti nel link, il nome e gli indirizzi dei tracker. Quando WebTorrent recupera i metadati, puoi vedere il nome del torrent, i percorsi e le dimensioni dei file, la dimensione totale e le informazioni sui pezzi. Puoi anche filtrare l'elenco dei file e copiare l'info hash.

## Perché alcuni link magnet non restituiscono risultati

Nel browser WebTorrent ha bisogno di peer raggiungibili che supportino WebRTC. Di solito li trova tramite un tracker WebSocket. Alcuni link magnet includono anche una fonte di metadati HTTPS che il browser può leggere. La ricerca può scadere anche per un link che funziona in un client torrent per computer. Se hai il file `.torrent`, puoi leggerlo subito nel Visualizzatore di file torrent.

## Quali connessioni usa la ricerca

La ricerca avviene nel browser. WebTorrent può contattare tracker, peer o una fonte di metadati per il torrent richiesto. Questi servizi possono vedere il tuo indirizzo IP e il torrent che stai cercando. Il visualizzatore richiede soltanto i metadati. Il link deve contenere un info hash BitTorrent v1 (`btih`), anche se include l'hash v2 dello stesso torrent.
