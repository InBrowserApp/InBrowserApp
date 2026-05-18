## Che cos'è un UUID nil?

Un UUID nil è l'UUID standardizzato i cui 128 bit sono tutti zero. La sua forma testuale canonica è `00000000-0000-0000-0000-000000000000` e viene spesso usata per indicare che "non è stato ancora assegnato alcun UUID".

## Quando usarlo

Usa un UUID nil quando un'API, una colonna di database, una fixture o un file di configurazione richiede un valore nel formato UUID, ma l'identificatore reale è intenzionalmente assente. È utile come segnaposto nei test, nei modelli di importazione, negli script di migrazione e nei protocolli che definiscono un valore UUID vuoto esplicito.

## A cosa prestare attenzione

Non trattare l'UUID nil come un identificatore univoco generato. È sempre lo stesso valore, quindi salvarlo dove è previsto un ID oggetto reale può nascondere dati mancanti, violare le ipotesi di unicità o far sembrare collegati record che non lo sono.
