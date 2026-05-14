Wyszukiwanie DNS sprawdza publiczne rekordy DNS zwracane dla nazwy domeny. Przydaje się podczas weryfikowania uruchomienia nowej strony, diagnozowania dostarczania poczty, sprawdzania zmian w CDN lub load balancerze albo potwierdzania, czy odpowiedzi związane z DNSSEC różnią się między resolverami.

## Kiedy używać

Użyj tego narzędzia, gdy potrzebujesz szybkiej odpowiedzi w przeglądarce dla typowych typów rekordów DNS. Rekordy A i AAAA pokazują docelowe adresy IPv4 i IPv6, rekordy CNAME pokazują aliasy, rekordy MX wskazują serwery pocztowe, rekordy TXT często zawierają SPF lub tokeny weryfikacyjne, a rekordy NS/SOA/CAA/SRV/HTTPS/SVCB ujawniają delegację, autorytet, certyfikaty, usługi i nowoczesne wskazówki dotyczące endpointów.

## Jak to działa

Wyszukiwanie działa w przeglądarce z użyciem DNS over HTTPS. Wybierz resolver, zaznacz co najmniej jeden typ rekordu i prześlij domenę lub URL. URL-e są normalizowane do nazwy hosta przed wysłaniem zapytania, więc wklejenie `https://www.example.com/path` odpytuje `www.example.com`.

## Odczytywanie wyników

Każdy typ rekordu jest pokazany osobno z kodem odpowiedzi DNS, flagami resolvera, wierszami odpowiedzi i surowym JSON. `NoError` oznacza, że serwer DNS odpowiedział poprawnie, ale nadal może nie zwrócić żadnych wierszy odpowiedzi dla konkretnego typu. `NXDomain`, `ServFail` lub `Refused` zwykle oznacza, że nazwa nie istnieje, resolver nie mógł ukończyć wyszukiwania albo polityka resolvera zablokowała żądanie.

## Prywatność i ograniczenia

Zapytania są wysyłane do wybranego resolvera DNS over HTTPS, a nie do serwera InBrowser.App. Zachowanie resolvera, stan cache, walidacja DNSSEC i filtrowanie w sieci lokalnej mogą wpływać na wyniki. To narzędzie nie zastępuje autorytatywnych sprawdzeń `dig` z wielu sieci, ale pozwala szybko zobaczyć, co publiczne resolwery DoH zwracają z bieżącej przeglądarki.
