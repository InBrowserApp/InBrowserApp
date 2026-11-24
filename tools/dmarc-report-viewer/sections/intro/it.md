## Come leggere un report aggregato DMARC

Apri l’allegato di un report aggregato inviato all’indirizzo `rua` del tuo record DMARC. Il visualizzatore accetta XML, GZIP e archivi ZIP che contengono un solo report XML. Puoi anche incollare l’XML o caricare l’esempio. Il riepilogo mostra chi ha inviato il report, il periodo in UTC e il criterio pubblicato dal dominio. File e testo incollato vengono elaborati nel browser.

## Come interpretare i conteggi dei messaggi

Ogni record raggruppa i messaggi con lo stesso IP di origine e lo stesso esito della verifica. Una riga può rappresentare più messaggi e lo stesso IP può comparire in più righe. I totali sommano il numero di messaggi di ogni riga. Un messaggio supera il controllo DMARC quando SPF o DKIM ha esito positivo ed è allineato al dominio From visibile. Il visualizzatore conta un esito negativo solo se falliscono entrambi gli allineamenti. Se i dati di allineamento sono incompleti e nessun controllo ha esito positivo, l’esito è sconosciuto.

## Perché allineamento, autenticazione e azione applicata possono differire

Espandi Risultati di autenticazione originali per vedere i domini, gli esiti e i selettori DKIM riportati. L’autenticazione SPF o DKIM può avere esito positivo per un altro dominio anche se l’allineamento DMARC non riesce. L’azione applicata indica come il destinatario ha gestito il gruppo di messaggi. Può differire dal criterio pubblicato se il destinatario applica una deroga. Filtra per IP di origine o dominio From per esaminare un mittente senza modificare i totali complessivi.

## Quali formati XML DMARC sono supportati

Il visualizzatore legge i report aggregati conformi a RFC 9990, compresi quelli con il relativo namespace DMARC, e quelli precedenti basati su RFC 7489. RFC 9990 descrive il formato XML che riepiloga autenticazione e azioni applicate nei report aggregati. Se il tuo sistema di posta raggruppa più report in un archivio, estrai il report che ti interessa e aprilo singolarmente.
