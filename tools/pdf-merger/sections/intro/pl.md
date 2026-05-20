# Scal pliki PDF w przeglądarce

Użyj tego narzędzia do scalania PDF, gdy potrzebujesz jednego dokumentu z kilku źródłowych plików PDF, na przykład do połączenia zeskanowanych stron, złączenia podpisanych formularzy lub przygotowania raportów do udostępnienia. Dodaj co najmniej dwa pliki, sprawdź liczbę ich stron, a następnie ustaw kolejkę przed utworzeniem końcowego PDF.

## Jak działa kolejność scalania

Narzędzie dołącza wszystkie strony z pierwszego PDF, potem wszystkie strony z kolejnego PDF i kontynuuje zgodnie z kolejnością w kolejce. Możesz zmieniać kolejność plików za pomocą przycisków strzałek, przeciągać wiersze na komputerze, usuwać pomyłki i wyświetlać podgląd każdego pliku źródłowego przed scaleniem.

## Prywatność i obsługa plików

Całe parsowanie i scalanie odbywa się lokalnie w przeglądarce z użyciem `pdf-lib` oraz workera działającego w tle. Twoje pliki nie są przesyłane do InBrowser.App, a wygenerowany link pobierania istnieje tylko w bieżącej sesji przeglądarki.

## Ograniczenia, które warto znać

Zaszyfrowanych lub uszkodzonych plików PDF nie da się niezawodnie scalić. Jeśli plik jest chroniony hasłem właściciela, najpierw usuń to ograniczenie i dodaj odblokowany PDF ponownie. Bardzo duże pliki mogą wymagać więcej czasu, ponieważ przeglądarka musi skopiować każdą stronę do nowego dokumentu.
