## Czym jest MurmurHash3 (x86 128-bit)?

MurmurHash3 to szybki, niekryptograficzny algorytm haszujący
przeznaczony do powtarzalnych, dobrze rozłożonych sum kontrolnych.
Wariant x86 128-bit zwraca wartość 16-bajtową, zwykle wyświetlaną jako
32 znaki szesnastkowe, dzięki czemu lepiej niż skróty 32-bitowe sprawdza
się wtedy, gdy potrzebujesz szerszego identyfikatora dla dużych zbiorów
rekordów, plików lub kluczy cache.

**Gdzie się przydaje:**

- **Tablice haszujące i sharding**: Twórz stabilne klucze dla bucketów,
  partycji lub tabel wyszukiwania.
- **Deduplikacja**: Porównuj duże zbiory tekstów lub plików za pomocą
  kompaktowych 128-bitowych odcisków przed wykonaniem dokładniejszych kontroli.
- **Klucze cache**: Twórz deterministyczne identyfikatory dla artefaktów
  kompilacji, przekształconych danych lub wygenerowanych treści.
- **Kontrole integralności niezwiązane z bezpieczeństwem**: Wykrywaj
  przypadkowe zmiany podczas przechowywania lub przesyłania, gdy gwarancje
  kryptograficzne nie są wymagane.

**Zachowanie ziarna:**

Opcjonalne ziarno jest 32-bitową wartością bez znaku. Użyj tego samego
ziarna, gdy wyniki muszą być zgodne z innym systemem, albo zostaw `0`,
jeśli nie masz konkretnego wymagania zgodności. Akceptowane są wartości
dziesiętne oraz wartości szesnastkowe z prefiksem `0x`; większe wartości
są zawijane do tego samego 32-bitowego zakresu, którego używa algorytm.

**Uwagi dotyczące bezpieczeństwa:**

MurmurHash3 nie jest algorytmem do haszowania haseł, podpisywania ani
weryfikacji odpornej na manipulacje. Użyj SHA-256, HMAC albo narzędzia
do haszowania haseł, gdy wynik ma zapewniać właściwości bezpieczeństwa.
To narzędzie najlepiej nadaje się do lokalnego haszowania offline
zorientowanego na wydajność, w którym szybkość i stabilny rozkład są
ważniejsze niż odporność na ataki.
