## Een SPF-record controleren

Plak de waarde van één DNS TXT-record, beginnend met `v=spf1`, en kies Syntax controleren. Toont DNS de TXT-waarde als meerdere tekenreeksen tussen aanhalingstekens? Voeg ze dan in de juiste volgorde samen en behoud de spaties binnen de tekenreeksen. De controle toont elk mechanisme en elke modifier en markeert syntaxfouten bij de bijbehorende tekst. De invoer blijft in je browser.

## Zo werken SPF-mechanismen en kwalificatoren

Met SPF (Sender Policy Framework) geeft een domein aan welke servers namens dat domein e-mail mogen versturen. De ontvangende server doorloopt de mechanismen in volgorde. Zo controleert `v=spf1 ip4:192.0.2.0/24 include:_spf.example.com -all` eerst een IPv4-blok en het SPF-beleid van een provider, gevolgd door het afsluitende `-all`. Kwalificatoren geven de uitkomst van een overeenkomend mechanisme aan: pass (`+`), fail (`-`), softfail (`~`) of neutral (`?`). De standaardkwalificator is `+`. Modifiers zoals `redirect=` gebruiken een gelijkteken en hebben geen kwalificator.

## Wat het aantal termen met DNS-opzoekingen betekent

RFC 7208 staat tijdens de SPF-evaluatie maximaal 10 termen toe die een DNS-opzoeking veroorzaken. Het aantal hier telt de mogelijke termen in het geplakte record, waaronder `a`, `mx`, `include`, `exists`, `ptr` en een actieve `redirect`. Via `include` of `redirect` kunnen er meer termen bijkomen, terwijl een overeenkomend mechanisme de evaluatie voortijdig kan stoppen. Bekijk het gepubliceerde TXT-record en de domeinen waarnaar het verwijst om het actieve SPF-beleid en het totale aantal termen met DNS-opzoekingen te controleren.
