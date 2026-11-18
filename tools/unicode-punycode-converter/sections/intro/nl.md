## Unicode-domeinnamen omzetten naar Punycode en terug

Plak een domein zoals `bücher.com` in **Unicode‑domein** en je krijgt `xn--bcher-kva.com` in **ASCII‑domein**. Plak een domein met `xn--` in **ASCII‑domein** om het in Unicode te lezen. Tijdens het typen verandert de waarde in het andere veld automatisch. Je kunt beide versies kopiëren.

## Wanneer gebruik je welke versie?

Punycode geeft niet-ASCII-tekens in internationale domeinnamen (IDN's) weer met ASCII-letters, cijfers en koppeltekens. Een omgezet label begint met `xn--`. Gewone ASCII-labels zoals `com` blijven hetzelfde. Gebruik de ASCII-versie in DNS- of hostinginstellingen die daarom vragen. Gebruik de Unicode-versie om een domeinnaam uit een logbestand of configuratiebestand te lezen.

## Wat vul je in bij de converter?

Vul alleen de hostnaam in. Plak bij `https://bücher.com/catalog` dus alleen `bücher.com`. Subdomeinen werken ook. Zo wordt `www.bücher.com` omgezet naar `www.xn--bcher-kva.com`.
