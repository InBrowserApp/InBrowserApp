## Czym jest HighwayHash?

HighwayHash to szybka funkcja haszująca z kluczem, zaprojektowana przez Google do wydajnego tworzenia odcisków danych i sprawdzania integralności. Używa 256-bitowego klucza i może tworzyć wynik 64-, 128- lub 256-bitowy z tego samego tekstu albo pliku.

## Kiedy go używać

- Twórz deterministyczne sumy kontrolne z kluczem dla kluczy pamięci podręcznej, identyfikatorów obiektów, shardingowania lub wewnętrznych tabel wyszukiwania.
- Porównuj pliki lub treści tekstowe z tym samym kluczem, gdy szybkość jest ważniejsza niż szeroka zgodność kryptograficzna.
- Generuj 128- lub 256-bitowe odciski danych, gdy w przepływach sprawdzania integralności przydaje się większy hasz niebędący hasłem.

## Opcje klucza i wyniku

Wprowadź klucz jako dokładnie 32 bajty danych szesnastkowych, na przykład `0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f`. Prefiks `0x` jest opcjonalny, a narzędzie akceptuje spacje, dwukropki, łączniki i podkreślenia, aby długie klucze były łatwiejsze do odczytania. Pozostawienie klucza pustego używa domyślnego klucza biblioteki, co jest wygodne do szybkich kontroli, ale nie powinno być traktowane jako sekret.

## Uwagi dotyczące bezpieczeństwa

HighwayHash nie zastępuje HMAC, podpisów cyfrowych ani haszowania haseł. Używaj go do szybkich odcisków danych z kluczem i przepływów sum kontrolnych, a nie do potwierdzania autentyczności między systemami wymagającymi standardowej weryfikacji kryptograficznej.
