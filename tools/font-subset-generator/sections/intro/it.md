## Che cos’è un sottoinsieme di font?

Un sottoinsieme di font contiene i caratteri necessari a un testo specifico,
insieme ai glifi di supporto richiesti per visualizzarli. Rimuovere i glifi
inutilizzati può ridurre notevolmente i dati da scaricare, soprattutto per i
font cinesi, giapponesi e coreani di grandi dimensioni o per un titolo fisso,
un logo o una pagina promozionale.

## Come usare questo strumento

Scegli un file TTF, OTF, WOFF o WOFF2 e incolla tutto il testo che lo userà.
Seleziona WOFF2 per il web oppure TTF / OTF per un font non compresso, quindi
genera il sottoinsieme. Confronta le dimensioni, controlla l’anteprima e scarica
il font con il CSS corrispondente. L’elaborazione avviene localmente in un
Web Worker.

## Che cosa viene conservato?

HarfBuzz conserva le dipendenze tra glifi e le funzionalità di impaginazione
OpenType necessarie per legature, crenatura, segni combinanti e sistemi di
scrittura complessi. Vengono mantenuti anche l’hinting e gli assi dei font
variabili. Le forme composte e decomposte canonicamente equivalenti sono incluse
quando il font di origine le supporta. L’anteprima usa il font generato e i
caratteri mancanti nell’originale sono elencati separatamente.

## Consigli pratici

- Includi spazi, punteggiatura, numeri e tutte le stringhe tradotte necessarie.
  Aggiungi il set latino predefinito se il testo conterrà anche caratteri latini
  di base.
- Rigenera il sottoinsieme ogni volta che il testo cambia. Un sottoinsieme fisso
  è adatto a contenuti noti; per i contenuti creati dagli utenti, mantieni una
  copertura più ampia dei caratteri.
- La creazione del sottoinsieme non può aggiungere caratteri assenti nel font
  originale. Mantieni un font di riserva nel CSS per i caratteri esclusi.
- Usa un font la cui licenza consenta la modifica e l’incorporamento nel web.
  Le raccolte di font (`.ttc` / `.otc`) devono prima essere esportate come font
  singoli.
- I font piccoli o già ridotti a un sottoinsieme potrebbero non diventare più
  leggeri. WOFF2 offre in genere il download più piccolo per il web; il numero
  di glifi comprende anche quelli di supporto.
