## Come verificare un record SPF

Incolla il valore di un singolo record DNS TXT che inizia con `v=spf1`, poi seleziona Verifica sintassi. Se il DNS mostra il valore TXT in più stringhe tra virgolette, uniscile nell’ordine mantenendo gli spazi al loro interno. Lo strumento mostra ogni meccanismo o modificatore e segnala gli errori di sintassi accanto al testo da correggere. Il valore inserito resta nel browser.

## Come funzionano i meccanismi e i qualificatori SPF

SPF (Sender Policy Framework) permette a un dominio di indicare quali server possono inviare email per suo conto. Il server che riceve il messaggio valuta i meccanismi nell’ordine. Per esempio, `v=spf1 ip4:192.0.2.0/24 include:_spf.example.com -all` verifica un blocco IPv4 e la policy SPF di un provider prima del termine finale `-all`. I qualificatori indicano esito positivo (`+`), negativo (`-`), negativo non definitivo (`~`) o neutro (`?`). Il qualificatore predefinito è `+`. I modificatori come `redirect=` usano un segno di uguale e non hanno qualificatore.

## Cosa indica il conteggio dei termini che richiedono query DNS

RFC 7208 consente fino a 10 termini che possono causare query DNS durante la valutazione SPF. Il numero qui mostrato conta i termini potenziali del record incollato, tra cui `a`, `mx`, `include`, `exists`, `ptr` e un `redirect` attivo. Un `include` o un `redirect` può portare ad altri termini. Una corrispondenza può concludere la valutazione in anticipo. Per verificare la policy SPF in uso e il conteggio effettivo, esamina il record TXT pubblicato e i domini a cui rimanda.
