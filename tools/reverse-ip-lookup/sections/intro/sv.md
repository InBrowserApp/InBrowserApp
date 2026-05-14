Omvänd IP-sökning omvandlar en IPv4- eller IPv6-adress till dess omvända DNS-namn och frågar efter motsvarande `PTR`-post. Den hjälper dig att kontrollera vilket värdnamn en adressägare publicerar för e-postservrar, nätverksenheter, molninstanser och felsökningsanteckningar.

## Vad den kontrollerar

För IPv4 vänder verktyget på oktetterna och frågar efter ett `in-addr.arpa`-namn. För IPv6 expanderar det adressen till 32 hexadecimala nibbles, vänder på dem och frågar efter det matchande `ip6.arpa`-namnet. Resultatet visar den exakta omvända DNS-domänen, DNS-statuskoden, resolver, adressfamilj och eventuella returnerade värdnamn med respektive TTL-värden.

## Hur frågan körs

Sökningen körs från din webbläsare med DNS-over-HTTPS. Du kan välja Cloudflare, Google eller AliDNS som resolver, och webbläsaren skickar en standardfråga av typen `PTR` till den slutpunkten. Ingen serverbaserad söktjänst från InBrowser.App används.

## Hur du tolkar saknade resultat

Ett saknat PTR-svar är vanligt. Många hem-, moln-, privata eller nyligen tilldelade adresser publicerar inga omvända DNS-poster. Ett lyckat DNS-svar utan värdnamn bevisar inte att adressen är oanvänd; det betyder bara att den omvända zonen inte returnerade någon användbar `PTR`-post via den valda resolvern.

## Praktiska anteckningar

- Omvänd DNS mappar en IP-adress till ett värdnamn; det skiljer sig från att hitta varje domän som finns på samma adress.
- PTR-poster kontrolleras av IP-adressens ägare eller den överordnade leverantören, inte enbart av domänägaren.
- E-post- och säkerhetssystem jämför ofta framåt- och omvänd DNS, så en PTR-post bör vanligtvis peka på ett värdnamn som löser tillbaka till samma adress.
