## Czym jest MurmurHash3 (x64 128-bit)?

MurmurHash3 to szybki, niekryptograficzny algorytm haszujący
zaprojektowany do powtarzalnych, dobrze rozłożonych sum kontrolnych.
Wariant x64 128-bit zwraca wartość 16-bajtową, zwykle wyświetlaną jako
32 znaki szesnastkowe, dzięki czemu lepiej niż hashe 32-bitowe sprawdza
się, gdy potrzebujesz szerszego identyfikatora dla dużych zbiorów
rekordów, plików lub kluczy cache.

**Gdzie się przydaje:**

- **Tablice haszujące i sharding**: Twórz stabilne klucze dla bucketów,
  partycji lub tabel wyszukiwania.
- **Deduplikacja**: Porównuj duże zbiory tekstu lub plików za pomocą
  kompaktowych 128-bitowych odcisków przed wykonaniem głębszych kontroli.
- **Klucze cache**: Twórz deterministyczne identyfikatory dla artefaktów
  kompilacji, przekształconych danych lub generowanej treści.
- **Niesłużące bezpieczeństwu kontrole integralności**: Wykrywaj
  przypadkowe zmiany podczas przechowywania lub przesyłania, gdy gwarancje
  kryptograficzne nie są wymagane.

**Zachowanie ziarna:**

Opcjonalne ziarno jest 32-bitową wartością bez znaku. Użyj tego samego
ziarna, gdy wyniki muszą być zgodne z innym systemem, albo zostaw `0`,
jeśli nie masz konkretnego wymagania zgodności. Akceptowane są wartości
dziesiętne oraz szesnastkowe wartości `0x`; większe wartości zawijają się
do tego samego 32-bitowego zakresu, którego używa algorytm.

**Uwagi dotyczące bezpieczeństwa:**

MurmurHash3 nie jest algorytmem do haszowania haseł, podpisywania ani
weryfikacji odpornej na manipulację. Użyj SHA-256, HMAC albo narzędzia
do haszowania haseł, gdy wynik ma zapewniać właściwości bezpieczeństwa.
To narzędzie najlepiej nadaje się do lokalnego, offline'owego haszowania
zorientowanego na wydajność, w którym szybkość i stabilny rozkład są
ważniejsze niż odporność na ataki.
