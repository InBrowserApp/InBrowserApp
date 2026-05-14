Reverse IP Lookup zamienia adres IPv4 lub IPv6 na jego odwrotną nazwę DNS i odpytuje odpowiedni rekord `PTR`. Pomaga sprawdzić, jaką nazwę hosta właściciel adresu publikuje dla serwerów pocztowych, urządzeń sieciowych, instancji w chmurze i notatek diagnostycznych.

## Co sprawdza

Dla IPv4 narzędzie odwraca oktety i odpytuje nazwę `in-addr.arpa`. Dla IPv6 rozwija adres do 32 cyfr szesnastkowych, odwraca ich kolejność i odpytuje pasującą nazwę `ip6.arpa`. Wynik pokazuje dokładną odwrotną domenę DNS, kod statusu DNS, resolver, rodzinę adresów oraz wszystkie zwrócone nazwy hostów z ich wartościami TTL.

## Jak działa zapytanie

Wyszukiwanie działa z przeglądarki przy użyciu DNS-over-HTTPS. Jako resolver możesz wybrać Cloudflare, Google albo AliDNS, a przeglądarka wysyła standardowe zapytanie `PTR` do tego punktu końcowego. Nie bierze w tym udziału żadna serwerowa usługa wyszukiwania InBrowser.App.

## Jak czytać brakujące wyniki

Brak odpowiedzi PTR jest częsty. Wiele adresów domowych, chmurowych, prywatnych albo niedawno przydzielonych nie publikuje odwrotnych rekordów DNS. Pomyślna odpowiedź DNS bez nazw hostów nie dowodzi, że adres jest nieużywany; oznacza tylko, że strefa odwrotna nie zwróciła używalnego rekordu `PTR` przez wybrany resolver.

## Uwagi praktyczne

- Odwrotny DNS mapuje adres IP na nazwę hosta; to co innego niż znajdowanie każdej domeny hostowanej pod tym samym adresem.
- Rekordy PTR są kontrolowane przez właściciela adresu IP albo dostawcę nadrzędnego, a nie wyłącznie przez właściciela domeny.
- Systemy pocztowe i bezpieczeństwa często porównują DNS w przód i wstecz, więc rekord PTR powinien zwykle wskazywać nazwę hosta, która rozwiązuje się z powrotem na ten sam adres.
