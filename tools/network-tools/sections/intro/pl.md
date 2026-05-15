Narzędzia sieciowe to punkt startowy dla zadań sieciowych wykonywanych w przeglądarce. Użyj ich, gdy wiesz, jaki problem rozwiązujesz, ale chcesz szybciej trafić do właściwego narzędzia: sprawdzić zakres IP, odpytać rekordy DNS, zdekodować umiędzynarodowioną domenę, wyszukać port albo sprawdzić certyfikat lub odcisk palca klucza SSH.

## Co możesz zrobić

- Pracować z IPv4, IPv6, blokami CIDR, zakresami adresów i adresami link-local wyprowadzonymi z MAC.
- Odpytwać rekordy DNS i odwrotnego DNS za pomocą narzędzi przyjaznych dla przeglądarki.
- Wyszukiwać kody statusu HTTP, typy MIME, numery portów i bieżący czas sieciowy.
- Sprawdzać szczegóły certyfikatów i kluczy publicznych bez wysyłania materiału źródłowego na serwer.

## Wybór właściwego narzędzia

Zacznij od **IP i CIDR**, gdy wejściem jest adres, zakres, podsieć lub blok routingu. Wybierz **DNS i domeny** dla rekordów, wyszukiwań PTR oraz konwersji IDN/Punycode. Wybierz **Referencje protokołów**, gdy potrzebujesz szybkiej tabeli referencyjnej. Wybierz **Klucze i certyfikaty**, gdy materiałem źródłowym jest certyfikat TLS, klucz publiczny lub wpis authorized_keys SSH.

## Uwagi dotyczące prywatności

Większość narzędzi w tej kolekcji działa w całości w przeglądarce. Narzędzia, które wymagają publicznych danych sieciowych, takie jak wyszukiwania DNS lub informacje o IP, mogą kontaktować się z resolverem lub usługą wyszukiwania potrzebną do odpowiedzi na zapytanie. Unikaj wklejania sekretów do publicznych narzędzi wyszukiwania i preferuj narzędzia działające tylko lokalnie do sprawdzania certyfikatów i kluczy, gdy materiał jest poufny.
