Reverse-IP-Lookup wandelt eine IPv4- oder IPv6-Adresse in ihren Reverse-DNS-Namen um und fragt den zugehörigen `PTR`-Eintrag ab. So kannst du prüfen, welchen Hostnamen ein Adressinhaber für Mailserver, Netzwerkgeräte, Cloud-Instanzen und Notizen zur Fehlerbehebung veröffentlicht.

## What It Checks

Für IPv4 dreht das Tool die Oktette um und fragt einen `in-addr.arpa`-Namen ab. Für IPv6 erweitert es die Adresse auf 32 hexadezimale Nibbles, dreht sie um und fragt den passenden `ip6.arpa`-Namen ab. Das Ergebnis zeigt die genaue Reverse-DNS-Domain, den DNS-Statuscode, den Resolver, die Adressfamilie und alle zurückgegebenen Hostnamen mit ihren TTL-Werten.

## How the Query Runs

Die Abfrage läuft in deinem Browser mit DNS-over-HTTPS. Du kannst Cloudflare, Google oder AliDNS als Resolver wählen, und der Browser sendet eine standardmäßige `PTR`-Abfrage an diesen Endpunkt. Es ist kein serverseitiger InBrowser.App-Abfragedienst beteiligt.

## How to Read Missing Results

Eine fehlende PTR-Antwort ist häufig. Viele Privatanschluss-, Cloud-, private oder neu zugewiesene Adressen veröffentlichen keine Reverse-DNS-Einträge. Eine erfolgreiche DNS-Antwort ohne Hostnamen beweist nicht, dass die Adresse ungenutzt ist; sie bedeutet nur, dass die Reverse-Zone über den ausgewählten Resolver keinen nutzbaren `PTR`-Eintrag zurückgegeben hat.

## Practical Notes

- Reverse DNS ordnet eine IP-Adresse einem Hostnamen zu; das ist etwas anderes, als jede Domain zu finden, die auf derselben Adresse gehostet wird.
- PTR-Einträge werden vom Eigentümer der IP-Adresse oder vom Upstream-Anbieter kontrolliert, nicht allein vom Domaininhaber.
- Mail- und Sicherheitssysteme vergleichen häufig Forward- und Reverse-DNS, daher sollte ein PTR-Eintrag in der Regel auf einen Hostnamen zeigen, der wieder auf dieselbe Adresse auflöst.
