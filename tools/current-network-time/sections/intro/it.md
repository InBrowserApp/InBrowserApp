## A cosa serve questo strumento

Usa questo strumento per confrontare l'orologio del tuo dispositivo con un'ora
ricavata dalla rete. Recupera un timestamp dall'endpoint di trace di
Cloudflare, stima il punto medio della latenza di richiesta e mostra
l'orologio di rete nel browser.

## Dove aiuta

- Verificare se l'orologio locale del sistema e avanti o indietro.
- Confermare una deriva temporale prima di analizzare TLS, token, scheduler o
  log.
- Ottenere rapidamente un'ora di riferimento basata sulla rete senza
  installare strumenti NTP.

## Cosa tenere presente

- L'offset mostrato e una stima e dipende dalla latenza di rete.
- Se la richiesta di trace fallisce, lo strumento torna a mostrare
  l'orologio locale fino alla sincronizzazione successiva.
- Per una correzione precisa a livello di sistema, regola la sincronizzazione
  dell'ora del dispositivo o la configurazione NTP.
