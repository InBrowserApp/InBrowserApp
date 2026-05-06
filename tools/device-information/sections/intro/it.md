## Cosa mostra questo strumento

Device Information raccoglie i dettagli visibili al browser per il dispositivo che stai usando in questo momento. Raggruppa i risultati in sezioni dedicate a browser, display, hardware, rete, archiviazione e funzionalità, così puoi vedere rapidamente che cosa può rilevare un sito web senza installare software di diagnostica.

## Quando è utile

Usalo quando devi eseguire il debug di layout responsive, riprodurre ticket di supporto, confrontare browser, confermare se i cookie o il local storage sono disponibili, controllare le dimensioni del display o acquisire un'istantanea JSON compatta per una segnalazione di bug. È utile anche prima di testare canvas, WebGL, clipboard, service worker o funzionalità dipendenti dall'archiviazione.

## Note su privacy e accuratezza

Lo strumento viene eseguito interamente nel browser e non carica l'istantanea. I browser nascondono o arrotondano intenzionalmente alcuni valori, soprattutto dettagli su memoria, CPU, GPU, rete e user agent. I valori mancanti di solito indicano che il browser non espone quell'API, che la pagina non si trova in un contesto sicuro o che un'impostazione di privacy ha bloccato l'accesso.

## Come leggere i risultati

Considera i dati come la vista corrente del browser sul tuo ambiente, non come un inventario hardware garantito. Ridimensiona la finestra o ruota il dispositivo, quindi aggiorna l'istantanea per aggiornare i valori di viewport, orientamento e display. Usa l'azione di copia JSON quando devi condividere i valori esatti osservati con uno sviluppatore o un team di supporto.
