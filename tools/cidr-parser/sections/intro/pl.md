CIDR Parser zamienia blok taki jak `10.24.8.19/21` lub `2001:db8:abcd::123/64` na sieć, którą faktycznie masz na myśli. Normalizuje wejście z adresem hosta, pokazuje kanoniczną podsieć i ujawnia granice potrzebne zwykle przy pisaniu reguł zapory, dokumentowaniu zakresów albo sprawdzaniu, czy alokacja nie jest zbyt duża.

## Co pokazuje

Wynik zaczyna się od krótkiego przeglądu, a następnie rozbija blok na praktyczne szczegóły: kanoniczny CIDR, całkowitą i używalną liczbę adresów, początek i koniec zakresu oraz wartości całkowite stojące za blokiem. Dla IPv4 otrzymujesz też maskę sieci, maskę wildcard i adres broadcast. Dla IPv6 parser zachowuje ten sam przepływ, ale ukrywa pola, które nie mają zastosowania.

## Dlaczego kanonizacja ma znaczenie

Wiele wklejanych wartości CIDR zawiera bity hosta. Dla ludzi to wygodne, ale routery, ACLs i dokumentacja zwykle potrzebują kanonicznego adresu sieci. Przepisanie bloku przed kopiowaniem ułatwia wykrycie założeń off-by-one, zanim trafią do konfiguracji.

## Uwagi praktyczne

- Bloki IPv4 `/31` i `/32` są traktowane jako w pełni używalne, zgodnie ze współczesnym użyciem point-to-point i host-route.
- Bloki IPv6 pokazują całą przestrzeń adresową i używalny zakres bez tworzenia pojęcia broadcast.
- Wszystko działa lokalnie w przeglądarce, więc wewnętrzne podsieci nie opuszczają strony podczas sprawdzania.
