## Jak utworzyć rekord TXT DNSLink dla IPFS

DNSLink przypisuje do domeny lub subdomeny ścieżkę do treści. Wpisz domenę i wklej identyfikator CID w IPFS albo ścieżkę IPFS lub IPNS. Skopiuj wygenerowaną **Nazwę** oraz **Wartość TXT** do nowego rekordu TXT w panelu dostawcy DNS. Na przykład dla domeny `www.example.com` nazwa rekordu to `_dnslink.www.example.com`. Jeśli edytor DNS automatycznie dopisuje `example.com`, wpisz `_dnslink.www` w polu nazwy.

## Jak sprawdzić, dokąd prowadzi DNSLink

Wybierz **Sprawdź opublikowany rekord**, aby wyświetlić odpowiedzi serwerów DNS Cloudflare i Google na zapytania o rekordy TXT. Pozostaw pole adresu docelowego puste, by sprawdzić istniejącą konfigurację, lub wpisz oczekiwany adres, by porównać go z opublikowaną wartością. Po zmianie wpisu serwery DNS mogą zwracać poprzednią wartość, dopóki jest w ich pamięci podręcznej. Wyświetlany TTL podaje czas, przez jaki można przechowywać otrzymaną odpowiedź DNS w pamięci podręcznej.

## Jak zaktualizować stronę w IPFS pod własną domeną

Użyj identyfikatora CID w IPFS, aby wskazać konkretną wersję plików, albo ścieżki IPNS, aby korzystać z nazwy, którą można aktualizować. DNSLink informuje zgodne programy klienckie i bramy, gdzie znaleźć treści. Aby udostępnić je przez HTTPS we własnej domenie, skonfiguruj bramę obsługującą DNSLink i skieruj na nią domenę. [Własne domeny i DNSLink w dokumentacji IPFS](https://docs.ipfs.tech/how-to/websites-on-ipfs/custom-domains/)
