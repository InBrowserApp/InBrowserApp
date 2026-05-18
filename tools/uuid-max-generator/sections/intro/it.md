## Che cos'e' un Max UUID?

Un max UUID e' l'UUID standardizzato i cui 128 bit sono tutti impostati a uno. La sua forma testuale canonica e' `ffffffff-ffff-ffff-ffff-ffffffffffff` e viene spesso usato per indicare il valore UUID piu' alto possibile.

## Quando usarlo

Usa un max UUID quando un'API, una query di database, una fixture o un controllo di intervallo richiede un limite superiore o un valore sentinella in formato UUID. E' utile nei test, negli script di migrazione, nei cursori di paginazione e nei protocolli che definiscono un valore UUID massimo esplicito.

## A cosa fare attenzione

Non trattare il max UUID come un identificatore univoco generato. E' sempre lo stesso valore, quindi salvarlo dove e' previsto un vero ID oggetto puo' nascondere la logica sentinella, rompere le ipotesi di unicita' o far ordinare i record in fondo in modo inatteso.
