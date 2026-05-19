## Czym jest skrót tekstu lub pliku?

Funkcja skrótu zamienia tekst lub bajty pliku na skrót o stałej długości. Te same dane wejściowe i ten sam algorytm zawsze dają ten sam skrót, więc skróty przydają się, gdy potrzebujesz powtarzalnego odcisku danych bez przesyłania prywatnych informacji.

## Kiedy używać tego narzędzia

Użyj tego narzędzia do sprawdzania sum kontrolnych pobranych plików, porównywania, czy dwa pliki są identyczne, zapisywania szybkiego odcisku fragmentu tekstu albo debugowania systemów publikujących skróty SHA. Import pliku oblicza skrót bezpośrednio z bajtów pliku, a tryb tekstowy oblicza skrót z tekstu UTF-8 widocznego w edytorze.

## Wybór algorytmu

SHA-256 to solidny domyślny wybór dla nowych sprawdzeń integralności. SHA-384 i SHA-512 zapewniają dłuższe skróty SHA-2, gdy inny system oczekuje tych formatów. SHA-1 jest dostępny do porównań ze starszymi systemami, ale nie należy go używać w nowych projektach wrażliwych na bezpieczeństwo.

## Prywatność i ograniczenia

Obliczanie skrótu odbywa się lokalnie w przeglądarce przez Web Crypto, a pliki nie są przesyłane. Skrót nie jest szyfrowaniem: sam w sobie nie chroni sekretu, a przechowywanie haseł wymaga dedykowanej funkcji haszowania haseł z solą i czynnikiem kosztu.
