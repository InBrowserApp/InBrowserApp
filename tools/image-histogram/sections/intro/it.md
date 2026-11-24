## Come visualizzare l’istogramma di un’immagine

Scegli o trascina una foto, uno screenshot o un’illustrazione per vedere l’istogramma accanto all’immagine. Puoi anche provare con la foto di esempio. Parti da **Luminosità** per vedere la distribuzione complessiva dei toni, poi passa a **RGB** per confrontare rosso, verde e blu sulla stessa scala. Seleziona un singolo canale per esaminarlo più da vicino.

## Come leggere ombre, mezzitoni e luci

L’asse orizzontale va da 0 (il livello più scuro) a 255 (il più chiaro). A sinistra ci sono le ombre, al centro i mezzitoni e a destra le luci. Più una barra è alta, più pixel ci sono a quel livello. Passa il puntatore sul grafico, tocca il livello che ti interessa oppure sposta il cursore del livello con i tasti freccia per leggere il numero esatto di pixel.

Un picco a una delle estremità può indicare che le ombre o le luci sono tagliate, con una possibile perdita di dettaglio. Per esempio, un picco a 255 nel canale del rosso può indicare un ritaglio in quel canale anche se nell’istogramma della luminosità c’è ancora margine a destra. Anche uno sfondo bianco puro può creare un picco all’estremità destra. Guarda l’anteprima dell’immagine per capire come interpretarlo. Gli indicatori **Ombre** e **Luci** mostrano la percentuale di pixel analizzati che si trovano esattamente ai livelli 0 e 255, rispettivamente.

## Quando usare una scala logaritmica

Con la scala **Lineare**, l’altezza di ogni barra è proporzionale al numero di pixel. Prova la scala **Logaritmica** quando un’ampia area di colore uniforme rende difficile leggere il resto dell’istogramma. Con la scala cambia l’altezza delle barre, mentre il numero di pixel per livello resta lo stesso.

## Che cosa misura il visualizzatore

Il visualizzatore conta i pixel dell’immagine a 8 bit renderizzata dal browser, alle dimensioni originali. La luminosità si ricava combinando i valori di rosso, verde e blu, con un peso maggiore per il verde. I pixel completamente trasparenti vengono ignorati e ogni pixel parzialmente trasparente viene contato una sola volta. Il browser può arrotondarne i valori RGB durante il rendering. Per le immagini animate viene analizzato un solo fotogramma. Le immagini vengono elaborate sul tuo dispositivo.
