## Czym jest Base32?

Base32 jest przydatny, gdy kanał tekstowy albo kanał niewrażliwy na wielkość liter musi przenosić dane binarne, takie jak sekrety OTP, tokeny bezpieczne dla DNS czy wyeksportowane wartości konfiguracji. To warstwa kodowania, a nie warstwa bezpieczeństwa.

## Kiedy go używać

- Kodować bajty, tekst lub pliki do Base32 przed wysłaniem ich przez kanały tekstowe.
- Przygotowywać sekrety OTP, wyeksportowane ustawienia lub binarne bloby dla systemów oczekujących danych wejściowych Base32.
- Zamieniać surowe bajty pliku na ciąg znaków wygodny do kopiowania podczas transferu, logowania lub ręcznego wpisywania.

## O czym warto pamiętać

- Base32 zwiększa rozmiar danych bardziej niż Base64.
- Nie szyfruje ani nie ukrywa oryginalnej wartości.
- Niektóre systemy wymagają paddingu `=`, a inne akceptują wynik bez paddingu, więc najlepiej dopasować się do odbiorcy.
