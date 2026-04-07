## Czym jest Base64?

Base64 jest przydatne, gdy kanał tekstowy musi przenosić ładunki przyjazne dla danych binarnych, takie jak treść e-maili, bloby JSON lub krótkie data URL. To warstwa kodowania, a nie warstwa bezpieczeństwa.

## Kiedy go używać

- Szybkie debugowanie, gdy API zwraca lub oczekuje ciągów Base64.
- Konwersja tekstu z przeglądarki do bezpiecznego formatu transportowego dla logów lub ładunków.
- Sprawdzanie, czy wklejony blob Base64 dekoduje się do oczekiwanej zawartości.

## O czym pamiętać

- Base64 zwiększa rozmiar mniej więcej o jedną trzecią.
- Nie szyfruje ani nie ukrywa oryginalnej wartości.
- Nieprawidłowe dopełnienie lub uszkodzone kopiowanie i wklejanie zwykle objawia się jako błąd dekodowania.
