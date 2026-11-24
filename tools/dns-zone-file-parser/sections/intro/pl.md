## Jak odczytać plik strefy DNS

Otwórz eksport strefy DNS w formacie BIND lub wklej jego treść. Wczytaj przykład, aby zobaczyć rekord SOA, rekordy adresów IPv4 i IPv6, rekordy pocztowe i ciąg TXT. Każdy wiersz pokazuje nazwę, klasę, typ, czas życia w sekundach (TTL) i dane rekordu. Filtruj według nazwy, typu, np. MX, lub fragmentu wartości. Następnie skopiuj widoczne rekordy jako JSON na potrzeby inwentaryzacji lub migracji.

## Jak interpretowane są domena bazowa, TTL i dane rekordu

Po ustawieniu $ORIGIN na example.com. względna nazwa „www” staje się www.example.com. Znak @ oznacza bieżącą domenę bazową, a rekord poprzedzony wcięciem dziedziczy poprzednią nazwę. Jeśli plik nie zawiera $ORIGIN, wpisz domenę w polu Domena bazowa. Domyślne $TTL równe 1h oznacza 3 600 sekund, a rekord z własnym TTL zachowuje tę wartość. Dane rekordów zachowują cudzysłowy, sekwencje ucieczki i zapis względnych nazw docelowych. Dzięki temu „hello; world” pozostaje jedną wartością TXT, a „mail” w danych MX pozostaje „mail”.

## Co obejmują wyniki

Parser odczytuje komentarze, tekst w cudzysłowach i rekordy wielowierszowe. Uwagi wskazują numer wiersza z problemem, a odczytane rekordy pozostają widoczne. Jeśli strefa używa $INCLUDE lub $GENERATE, rozwiń te dyrektywy przed wklejeniem pełnych rekordów. Narzędzie odczytuje dane lokalnie. Nie odpytuje serwerów DNS ani nie sprawdza, czy dany dostawca wczyta strefę.
