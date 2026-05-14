Ricerca DNS controlla i record DNS pubblici restituiti per un nome di dominio. È utile quando stai verificando il lancio di un nuovo sito, eseguendo il debug della consegna email, controllando modifiche a CDN o bilanciatori di carico, oppure confermando se le risposte relative a DNSSEC appaiono diverse tra resolver.

## Quando usarlo

Usa questo strumento quando hai bisogno di una risposta rapida nel browser per i tipi di record DNS comuni. I record A e AAAA mostrano le destinazioni IPv4 e IPv6, i record CNAME mostrano gli alias, i record MX identificano gli exchanger di posta, i record TXT spesso contengono token SPF o di verifica, mentre i record NS/SOA/CAA/SRV/HTTPS/SVCB espongono delega, autorità, certificati, servizi e indicazioni sugli endpoint moderni.

## Come funziona

La ricerca viene eseguita nel browser con DNS over HTTPS. Scegli un resolver, seleziona uno o più tipi di record e invia un dominio o URL. Gli URL vengono normalizzati al loro hostname prima dell'invio della query, quindi incollare `https://www.example.com/path` interroga `www.example.com`.

## Lettura dei risultati

Ogni tipo di record viene mostrato separatamente con il codice di risposta DNS, i flag del resolver, le righe di risposta e il JSON grezzo. `NoError` significa che il server DNS ha risposto correttamente, ma può comunque non restituire righe di risposta per un tipo specifico. `NXDomain`, `ServFail` o `Refused` di solito significano che il nome non esiste, che il resolver non ha potuto completare la ricerca o che la policy del resolver ha bloccato la richiesta.

## Privacy e limiti

Le query vengono inviate al resolver DNS over HTTPS selezionato, non a un server InBrowser.App. Il comportamento del resolver, lo stato della cache, la convalida DNSSEC e il filtraggio della rete locale possono influire sui risultati. Questo strumento non sostituisce controlli `dig` autoritativi da più reti, ma è un modo rapido per ispezionare cosa restituiscono i resolver DoH pubblici dal browser corrente.
